"use client"

import { useEffect, useState } from "react"
import { readContract } from "@wagmi/core"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { NFTCard } from "@/components/NFTCard"
import nftABI from "@/contract/NFTabi.json"
import {
  readContracts,
  useAccount,
  useContractEvent,
  useContractWrite,
} from "wagmi"
import {
  CONTRACT_ADDRESS,
  getTokenIdUrl,
  getOpenseaUpdateMetadataUrl,
} from "@/constants"

const nftContract: Record<string, any> = {
  address: CONTRACT_ADDRESS,
  abi: nftABI,
}

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
      mint({
        args: [address],
      })
    } catch (e) {
      console.log("eeee", e)
    }
  }

  const handleTransferNFT = (
    owner: string,
    tokenId: number,
    text: string = "Hi"
  ) => {
    transferNFT({
      args: [owner, address, tokenId, getTokenIdUrl(text)],
    })

    // call opensea to change
    try {
      fetch(getOpenseaUpdateMetadataUrl(tokenId))
    } catch {}
  }

  const fetchNFTInfo = async () => {
    // 1. fetch current token id
    const _currentTokenId = await readContract({
      address: CONTRACT_ADDRESS,
      abi: nftABI,
      functionName: "currentTokenId",
    })

    const currentTokenId = Number(_currentTokenId)

    // 2. fetch all tokenURI
    let contractCalls: any[] = []
    for (let i = 1; i <= currentTokenId; i++) {
      contractCalls.push(
        {
          ...nftContract,
          functionName: "tokenURI",
          args: [i],
        },
        {
          ...nftContract,
          functionName: "ownerOf",
          args: [i],
        }
      )
    }

    const data = await readContracts({
      contracts: contractCalls,
    })

    // 3. fetch all nft info(images)
    const fetchRequests = []
    let _tokenUriInfos: tokenURIInfo[] = []
    for (let i = 0; i < data.length; i += 2) {
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
                tokenId: i / 2 + 1,
                owner: owner,
                ...data,
              })
            )
        )
      }
    }

    await Promise.all(fetchRequests)

    setTokenUriInfos(_tokenUriInfos.sort((a, b) => a.tokenId - b.tokenId))
  }

  // fetch NFT info
  useEffect(() => {
    fetchNFTInfo()
  }, [])

  // keep listen contract event
  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: nftABI,
    eventName: "NFTChanged",
    listener(log) {
      console.info("NFTChanged", log)
      fetchNFTInfo()
    },
  })

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
          {tokenURIInfos.map(({ tokenId, description, image, owner }) => (
            <NFTCard
              key={tokenId}
              tokenId={tokenId}
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
