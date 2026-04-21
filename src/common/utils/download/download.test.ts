import { downloadBlob } from '@/common/utils/download/download'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('the download blob helper', () => {
  beforeEach(() => {
    vi.restoreAllMocks()

    if (!window.URL.createObjectURL) {
      Object.defineProperty(window.URL, 'createObjectURL', {
        writable: true,
        value: vi.fn(() => 'blob:download-url')
      })
    }
    else {
      vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:download-url')
    }

    if (!window.URL.revokeObjectURL) {
      Object.defineProperty(window.URL, 'revokeObjectURL', {
        writable: true,
        value: vi.fn()
      })
    }
    else {
      vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => undefined)
    }

    vi.spyOn(document.body, 'append').mockImplementation(() => undefined)
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    vi.spyOn(HTMLAnchorElement.prototype, 'remove').mockImplementation(() => undefined)
  })

  BddTest().when('a filename is provided', () => {
    BddTest().then('it should create and trigger a download link with that filename', () => {
      const blob = new Blob(['trace content'], { type: 'text/plain' })
      const link = {
        href: '',
        download: '',
        click: vi.fn(),
        remove: vi.fn()
      } as unknown as HTMLAnchorElement
      vi.spyOn(document, 'createElement').mockReturnValue(link)

      downloadBlob(blob, 'trace.txt')

      expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
      expect(document.body.append).toHaveBeenCalledWith(link)
      expect(link.href).toBe('blob:download-url')
      expect(link.download).toBe('trace.txt')
      expect(link.click).toHaveBeenCalledTimes(1)
      expect(link.remove).toHaveBeenCalledTimes(1)
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:download-url')
    })
  })
})
