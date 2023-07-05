import Image from "next/image"

interface NFTCardProps {}

interface NFTCardProps {
  name: string
  description: string
  imageURL: string
  owner: string
}

export function NFTCard({ name, description, imageURL, owner }: NFTCardProps) {
  const imageNode = {
    originalSrc: "https://fakeimg.pl/600x400/?text=Hello",
    altText: "altText",
  }

  return (
    <a className="h-120 w-72 rounded shadow-lg mx-auto border border-palette-lighter">
      <div className="h-72 border-b-2 border-palette-lighter relative">
        <Image
          src={imageNode.originalSrc}
          alt={imageNode.altText}
          layout="fill"
          className="transform duration-500 ease-in-out hover:scale-110"
        />
      </div>
      <div className="h-48 relative">
        <div className="font-primary text-palette-primary text-2xl pt-4 px-4 font-semibold">
          {name}
        </div>
        <div className="text-lg text-gray-600 p-4 font-primary font-light">
          Owner: {owner}
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
                placeholder="Yo Bob here"
              />
              <button
                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="button"
              >
                Steal
              </button>
            </div>
          </form>
        </div>
      </div>
    </a>
  )
}
