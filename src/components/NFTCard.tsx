import Image from "next/image"
import { useRef } from "react"
import { useAccount, useNetwork } from "wagmi"
import { OPENSEA_URL } from "@/constants"

interface NFTCardProps {
  tokenId: number
  description: string
  imageURL: string
  owner: string
  onClick: (owner: string, tokenId: number, text: string) => void
}

export function NFTCard({
  tokenId,
  description,
  imageURL,
  owner,
  onClick,
}: NFTCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { address } = useAccount()
  const { chain } = useNetwork()

  return (
    <div className="h-120 w-72 rounded shadow-lg mx-auto border border-palette-lighter">
      <div className="h-72 border-b-2 border-palette-lighter relative">
        <a
          href={`${OPENSEA_URL}/${tokenId}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src={imageURL}
            alt={description}
            layout="fill"
            className="transform duration-500 ease-in-out hover:scale-110"
          />
        </a>
      </div>
      <div className="h-48 relative">
        <div className="font-primary text-palette-primary text-2xl pt-4 px-4 font-semibold">
          {description}
        </div>
        <div className="text-lg text-gray-600 p-4 font-primary font-light">
          Owner:{" "}
          <a
            href={`${chain?.blockExplorers?.default.url}/address/${owner}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {owner === address
              ? "ME"
              : `${owner.slice(0, 6)}...${owner.slice(-4)}`}
          </a>
        </div>

        <div
          className="text-palette-dark font-primary font-medium text-base absolute bottom-0 right-0 mb-4 pl-4 pr-4 pb-1 pt-2 bg-palette-lighter 
            rounded-tl-sm triangle"
        >
          <form className="w-full max-w-sm">
            <div className="flex items-center border-b border-teal-500 py-2">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                ref={inputRef}
                placeholder="Yo Bob here"
              />
              <button
                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="button"
                onClick={() =>
                  inputRef.current &&
                  onClick(owner, tokenId, inputRef.current.value)
                }
              >
                Steal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
// {
//   "internalType": "address",
//   "name": "from",
//   "type": "address"
// },
// {
//   "internalType": "address",
//   "name": "to",
//   "type": "address"
// },
// {
//   "internalType": "uint256",
//   "name": "tokenId",
//   "type": "uint256"
// }
