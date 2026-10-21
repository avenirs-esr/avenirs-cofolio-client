/**
 * Downloads a Blob as a file.
 * @param blob The Blob to download.
 * @param fileName The name of the file to save as. If not provided, defaults to "file".
 */
export function downloadBlob (blob: Blob, fileName?: string): void {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = objectUrl
  link.download = fileName ?? 'file'
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}
