"use client"

import { useEffect, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { NFTCard } from "@/components/NFTCard"
import nftABI from "@/contract/NFTabi.json"

import { useContractReads } from "wagmi"

const nftContract: Record<string, any> = {
  address: "0x1540F4ed07e3e8557F8EB1Fe2d248446F39ef6bA",
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

const defaultNftState = {
  name: "",
  description: "",
  image: "",
  owner: "",
}
export default function Home() {
  const [nft1, setNft1] = useState(defaultNftState)
  const [nft2, setNft2] = useState(defaultNftState)
  const [nft3, setNft3] = useState(defaultNftState)

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...nftContract,
        functionName: "symbol",
      },
      ...contractCalls,
    ],
  })

  useEffect(() => {
    if (isLoading) return

    const { result: token1URI } = data?.[1] || {}
    const { result: token1Owner } = data?.[2] || {}
    if (token1URI && token1Owner) {
      fetch(token1URI.toString())
        .then((res) => res.json())
        .then((data) => setNft1({ ...data, owner: token1Owner }))
    }

    const { result: token2URI } = data?.[3] || {}
    const { result: token2Owner } = data?.[4] || {}
    console.log("aaaaaaa2", token2URI)
    if (token2URI && token2Owner) {
      fetch(token2URI.toString())
        .then((res) => res.json())
        .then((data) => setNft2({ ...data, owner: token2Owner }))
    }

    const { result: token3URI } = data?.[5] || {}
    const { result: token3Owner } = data?.[6] || {}
    if (token3URI && token3Owner) {
      fetch(token3URI.toString())
        .then((res) => res.json())
        .then((data) => setNft3({ ...data, owner: token3Owner }))
    }
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
          {nft1.owner.length !== 0 && (
            <NFTCard
              name={nft1.name}
              description={nft1.description}
              imageURL={nft1.image}
              owner={nft1.owner}
            />
          )}
          {nft2.owner.length !== 0 && (
            <NFTCard
              name={nft2.name}
              description={nft2.description}
              imageURL={nft2.image}
              owner={nft2.owner}
            />
          )}
          {nft3.owner.length !== 0 && (
            <NFTCard
              name={nft3.name}
              description={nft3.description}
              imageURL={nft3.image}
              owner={nft3.owner}
            />
          )}
        </div>
      </main>
    </div>
  )
}
