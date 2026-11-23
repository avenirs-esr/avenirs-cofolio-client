import { canvasToFile } from '#shared/utils/file/file'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect, vi } from 'vitest'

BddTest().given('the canvas to file utility', () => {
  const createCanvas = (blob: Blob | null) => ({
    toBlob: vi.fn((callback: BlobCallback) => callback(blob)),
  }) as unknown as HTMLCanvasElement

  BddTest().when('the canvas is valid', () => {
    BddTest().then('it should return a File object', async () => {
      const blob = new Blob(['test'], { type: 'image/png' })

      const file = await canvasToFile(createCanvas(blob), 'image.png')

      expect(file).toBeInstanceOf(File)
      expect(file?.name).toBe('image.png')
      expect(file?.type).toBe('image/png')
    })
  })

  BddTest().when('the canvas is invalid', () => {
    BddTest().then('it should return null', async () => {
      const file = await canvasToFile(createCanvas(null), 'image.png')

      expect(file).toBeNull()
    })
  })

  BddTest().when('the canvas is null', () => {
    BddTest().then('it should return null', async () => {
      const file = await canvasToFile(null, 'image.png')

      expect(file).toBeNull()
    })
  })
})
