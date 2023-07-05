import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { NFTCard } from "@/components/NFTCard"

export default function Home() {
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
            Times are tough. Liven up your home with some cute Doggy Stickers.
            🐶
          </p>
        </div>
        <div className="py-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
          <NFTCard />
          <NFTCard />
          <NFTCard />
        </div>
      </main>
    </div>
  )
}
