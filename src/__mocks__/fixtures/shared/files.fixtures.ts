export const mockImageBlob = new Blob(['fake image content'], { type: 'image/png' })

export async function getLoremPicsumResponse () {
  const response = await fetch('https://picsum.photos/200')
  return response
}
