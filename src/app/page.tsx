"use client"

import { useEffect, useState } from "react"
import { readContract } from "@wagmi/core"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { NFTCard } from "@/components/NFTCard"
import nftABI from "@/contract/NFTabi.json"
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi"

const nftContractAddress = "0xC5eCb63B680Fd35fb6d2ca2eb29d4Fbd489a1EDc"
const fakejsonUri =
  "https://www.fakejson.online/api/json?name=AAABBBCCC&description=This%20image%20shows%20the%20true%20nature%20of%20NFT.&image=https://fakeimg.pl/500x500/?text="

const nftContract: Record<string, any> = {
  address: nftContractAddress,
  abi: nftABI,
}

const contractCalls = [1, 2, 3].flatMap((tokenId) => [
  {
    ...nftContract,
    functionName: "tokenURI",
    args: [tokenId],
  },
  {
    ...nftContract,
    functionName: "ownerOf",
    args: [tokenId],
  },
])
interface tokenURIInfo {
  tokenId: number
  name: string
  description: string
  image: string
  owner: string
}

export default function Home() {
  const { address } = useAccount()
  const [tokenURIInfos, setTokenUriInfos] = useState<tokenURIInfo[]>([])

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...nftContract,
        functionName: "symbol",
      },
      ...contractCalls,
    ],
  })

  const { write: transferNFT } = useContractWrite({
    ...nftContract,
    functionName: "transferNFT",
  })

  const { write: mint } = useContractWrite({
    ...nftContract,
    functionName: "mint",
  })

  const handleMintNFT = async () => {
    try {
      const data = await readContract({
        address: nftContractAddress,
        abi: nftABI,
        functionName: "getMintedTokenIds",
      })

      const nextTokenId = String(data).split(",").length + 1

      mint({
        args: [address, nextTokenId],
      })
    } catch (e) {
      console.log("eeee", e)
    }
  }

  const handleTransferNFT = (owner: string, tokenId: number, text: string) => {
    const url = `${fakejsonUri}${text?.length ? text : "Hi"}`

    transferNFT({
      args: [owner, address, tokenId, url],
    })
  }

  useEffect(() => {
    if (isLoading || !data) return

    const fetchNFTData = async () => {
      let _tokenUriInfos: tokenURIInfo[] = []

      const fetchRequests = []

      for (let i = 1; i < data.length; i += 2) {
        const { result: uri, status: uriStatus } = data[i]
        const { result: owner, status: ownerStatus } = data[i + 1]

        if (uriStatus !== "success" || ownerStatus !== "success") continue
        if (
          uri &&
          owner &&
          uri.toString().length > 0 &&
          owner.toString().length > 0
        ) {
          fetchRequests.push(
            fetch(uri.toString())
              .then((res) => res.json())
              .then((data) =>
                _tokenUriInfos.push({
                  tokenId: (i + 1) / 2,
                  owner: owner,
                  ...data,
                })
              )
          )
        }
      }

      await Promise.all(fetchRequests)
      console.log("_tokenUriInfos", _tokenUriInfos)
      setTokenUriInfos(_tokenUriInfos)
    }

    fetchNFTData()
  }, [isLoading])

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <header>
        0xCafe <ConnectButton />
      </header>
      <main className="mx-auto max-w-6xl">
        <div className="">
          <h1 className="leading-relaxed font-primary font-extrabold text-4xl text-center text-palette-primary mt-4 py-2 sm:py-4">
            0xCafe
          </h1>

          <p className="max-w-xl text-center px-2 mx-auto text-base text-gray-600">
            Boooooooooooob NFT
          </p>
        </div>
        <div className="py-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
          {tokenURIInfos.map(({ tokenId, name, description, image, owner }) => (
            <NFTCard
              key={tokenId}
              tokenId={tokenId}
              name={name}
              description={description}
              imageURL={image}
              owner={owner}
              onClick={handleTransferNFT}
            />
          ))}
          <div className="flex h-120 w-72 rounded shadow-lg mx-auto border border-palette-lighter">
            <button
              className="bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white m-auto py-1 px-2 rounded"
              type="button"
              onClick={() => handleMintNFT()}
            >
              Mint New One
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
