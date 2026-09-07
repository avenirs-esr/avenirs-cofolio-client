import type { IImageOptions } from 'docx'
import { centimeterToEmu, centimeterToPixel, centimeterToTwip, generateImageRunData } from '@/features/student/kit/composables/use-export-kit/utils/utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a centimeterToTwip function', () => {
  let result: number

  BddTest().when('the input is 1 centimeter', () => {
    beforeEach(() => {
      result = centimeterToTwip(1)
    })

    BddTest().then('it should return 567 twips', () => {
      expect(result).toBe(567)
    })
  })
})

BddTest().given('a centimeterToPixel function', () => {
  let result: number

  BddTest().when('the input is 1 centimeter', () => {
    beforeEach(() => {
      result = centimeterToPixel(1)
    })

    BddTest().then('it should return 37.7952755906 pixels', () => {
      expect(result).toBeCloseTo(37.7952755906, 0)
    })
  })
})

BddTest().given('a centimeterToEmu function', () => {
  let result: number

  BddTest().when('the input is 1 centimeter', () => {
    beforeEach(() => {
      result = centimeterToEmu(1)
    })

    BddTest().then('it should return 360000 emus', () => {
      expect(result).toBe(360000)
    })
  })
})

BddTest().given('a generateImageRunData function', () => {
  let result: IImageOptions | null
  let drawImage: ReturnType<typeof vi.fn>
  let toBlob: ReturnType<typeof vi.fn>

  beforeEach(() => {
    drawImage = vi.fn()
    toBlob = vi.fn((callback) => {
      callback(new Blob(['image'], { type: 'image/png' }))
    })

    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({
      width: 800,
      height: 600,
    }))

    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: vi.fn().mockReturnValue({ drawImage }),
          toBlob,
        } as unknown as HTMLCanvasElement
      }

      return document.createElement(tagName)
    })
  })

  BddTest().when('the input image exceeds the maximum height', () => {
    beforeEach(async () => {
      result = await generateImageRunData({
        url: 'https://example.com/image.png',
        requiredWidth: 400,
        requiredHeight: 100,
      })
    })

    BddTest().then('it should crop the image vertically', () => {
      expect(result).not.toBeNull()

      expect(drawImage).toHaveBeenCalledWith(
        expect.objectContaining({
          width: 800,
          height: 600,
        }),
        0,
        200,
        800,
        200,
        0,
        0,
        400,
        100,
      )
    })
  })

  BddTest().when('the canvas fails to create a blob', () => {
    beforeEach(async () => {
      toBlob.mockImplementation((callback) => {
        callback(null)
      })

      result = await generateImageRunData({ url: 'https://example.com/image.png' })
    })

    BddTest().then('it should reject the image generation', () => {
      expect(result).toBeNull()
    })
  })

  BddTest().when('the image bitmap creation fails', () => {
    beforeEach(async () => {
      vi.stubGlobal(
        'createImageBitmap',
        vi.fn().mockRejectedValue(new Error('Failed to create bitmap')),
      )

      result = await generateImageRunData({ url: 'https://example.com/image.png' })
    })

    BddTest().then('it should return null', () => {
      expect(result).toBeNull()
    })
  })

  BddTest().when('the input is an invalid image URL', () => {
    beforeEach(async () => {
      result = await generateImageRunData({ url: 'https://example.com/error.png' })
    })

    BddTest().then('it should return null', () => {
      expect(result).toBeNull()
    })
  })

  BddTest().when('the input is a non supported image URL', () => {
    beforeEach(async () => {
      result = await generateImageRunData({ url: 'https://example.com/file.bmp' })
    })

    BddTest().then('it should return null', () => {
      expect(result).toBeNull()
    })
  })

  BddTest().when('the input is a non-image URL', () => {
    beforeEach(async () => {
      result = await generateImageRunData({ url: 'https://example.com/file.txt' })
    })

    BddTest().then('it should return null', () => {
      expect(result).toBeNull()
    })
  })

  BddTest().when('the input is a valid image URL (png)', () => {
    beforeEach(async () => {
      result = await generateImageRunData({ url: 'https://example.com/image.png' })
    })

    BddTest().then('it should return a valid IImageOptions object', () => {
      expect(result).not.toBeNull()
      if (result) {
        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('type')
        expect(result).toHaveProperty('transformation')
      }
    })
  })

  BddTest().when('the input is a valid image URL (jpg)', () => {
    beforeEach(async () => {
      result = await generateImageRunData({ url: 'https://example.com/image.jpg' })
    })

    BddTest().then('it should return a valid IImageOptions object', () => {
      expect(result).not.toBeNull()
      if (result) {
        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('type')
        expect(result).toHaveProperty('transformation')
      }
    })
  })

  BddTest().when('the input is a valid image URL (jpeg)', () => {
    beforeEach(async () => {
      result = await generateImageRunData({ url: 'https://example.com/image.jpeg' })
    })

    BddTest().then('it should return a valid IImageOptions object', () => {
      expect(result).not.toBeNull()
      if (result) {
        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('type')
        expect(result).toHaveProperty('transformation')
      }
    })
  })

  BddTest().when('the input is a valid image URL (gif)', () => {
    beforeEach(async () => {
      result = await generateImageRunData({ url: 'https://example.com/image.gif' })
    })

    BddTest().then('it should return a valid IImageOptions object', () => {
      expect(result).not.toBeNull()
      if (result) {
        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('type')
        expect(result).toHaveProperty('transformation')
      }
    })
  })
})
