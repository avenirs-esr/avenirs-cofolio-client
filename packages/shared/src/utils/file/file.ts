export function canvasToFile (canvas: HTMLCanvasElement | null, fileName: string): Promise<File | null> {
  return new Promise((resolve) => {
    if (!canvas) {
      resolve(null)
      return
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null)
        return
      }

      resolve(new File([blob], fileName, { type: blob.type }))
    })
  })
}
