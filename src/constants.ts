export const CONTRACT_ADDRESS = "0x743fD2bE82B329D172F0D6e26ef6eD6f23f46fe6"

export const TOKEN_ID_URL =
  "https://www.fakejson.online/api/json?name=AAABBBCCC&description=This%20image%20shows%20the%20true%20nature%20of%20NFT.&image=https://fakeimg.pl/500x500/?text="

export const getTokenIdUrl = (text: string) =>
  `https://www.fakejson.online/api/json?name=AAABBBCCC&description=${text}&image=https://fakeimg.pl/500x500/?text=${text}`

export const OPENSEA_URL = `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`

export const getOpenseaUpdateMetadataUrl = (tokenId: number) =>
  `https://testnets-api.opensea.io/api/v1/asset/${CONTRACT_ADDRESS}/${tokenId}/?force_update=true`
