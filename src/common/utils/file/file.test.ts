import { EFileType, type FileDTO } from '@/api/avenir-esr'
import { bytesToMegabytes, getFileExtension, getFileTypeFromFileName, isDifferentFile, renameFile, stripExtension } from '@/common/utils/file/file'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('the file  helper', () => {
  BddTest().when('a file size in bytes is provided', () => {
    BddTest().then('it should return the size in Mo rounded to two decimals', () => {
      expect(bytesToMegabytes(5123456)).toBe(4.89)
    })
  })

  BddTest().when('the file size is less than one Mo', () => {
    BddTest().then('it should return the size in Mo rounded to two decimals', () => {
      expect(bytesToMegabytes(500000)).toBe(0.48)
    })
  })

  BddTest().when('the file size is exactly one Mo', () => {
    BddTest().then('it should return 1', () => {
      expect(bytesToMegabytes(1024 * 1024)).toBe(1)
    })
  })
})

BddTest().given('the file extension helper', () => {
  BddTest().when('the file name has an extension', () => {
    BddTest().then('it should return the extension with the leading dot', () => {
      expect(getFileExtension('document.pdf')).toBe('.pdf')
    })
  })

  BddTest().when('the file name has multiple dots', () => {
    BddTest().then('it should return only the last extension', () => {
      expect(getFileExtension('archive.tar.gz')).toBe('.gz')
    })
  })

  BddTest().when('the file name has no extension', () => {
    BddTest().then('it should return an empty string', () => {
      expect(getFileExtension('document')).toBe('')
    })
  })

  BddTest().when('the file name is a dotfile', () => {
    BddTest().then('it should return an empty string', () => {
      expect(getFileExtension('.gitignore')).toBe('')
    })
  })
})

BddTest().given('the strip extension helper', () => {
  BddTest().when('the file name has an extension', () => {
    BddTest().then('it should return the name without the extension', () => {
      expect(stripExtension('document.pdf')).toBe('document')
    })
  })

  BddTest().when('the file name has multiple dots', () => {
    BddTest().then('it should strip only the last extension', () => {
      expect(stripExtension('archive.tar.gz')).toBe('archive.tar')
    })
  })

  BddTest().when('the file name has no extension', () => {
    BddTest().then('it should return the name unchanged', () => {
      expect(stripExtension('document')).toBe('document')
    })
  })

  BddTest().when('the file name is a dotfile', () => {
    BddTest().then('it should return the name unchanged', () => {
      expect(stripExtension('.gitignore')).toBe('.gitignore')
    })
  })
})

BddTest().given('the rename file helper', () => {
  BddTest().when('a file is renamed', () => {
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf', lastModified: 1000 })
    const renamed = renameFile(file, 'report.pdf')

    BddTest().then('it should return a File with the new name', () => {
      expect(renamed).toBeInstanceOf(File)
      expect(renamed.name).toBe('report.pdf')
    })

    BddTest().then('it should preserve the type, size and lastModified', () => {
      expect(renamed.type).toBe('application/pdf')
      expect(renamed.size).toBe(file.size)
      expect(renamed.lastModified).toBe(1000)
    })
  })
})

BddTest().given('the file type helper', () => {
  BddTest().when('a file extension is \'pdf\'', () => {
    BddTest().then('it should return EFileType.PDF', () => {
      expect(getFileTypeFromFileName('test.pdf')).toBe(EFileType.PDF)
    })
  })

  BddTest().when('a file extension is \'doc\'', () => {
    BddTest().then('it should return EFileType.DOC', () => {
      expect(getFileTypeFromFileName('test.doc')).toBe(EFileType.DOC)
    })
  })

  BddTest().when('a file extension is \'docx\'', () => {
    BddTest().then('it should return EFileType.DOCX', () => {
      expect(getFileTypeFromFileName('test.docx')).toBe(EFileType.DOCX)
    })
  })

  BddTest().when('a file extension is \'jpg\'', () => {
    BddTest().then('it should return EFileType.JPEG', () => {
      expect(getFileTypeFromFileName('test.jpg')).toBe(EFileType.JPEG)
    })
  })

  BddTest().when('a file extension is \'jpeg\'', () => {
    BddTest().then('it should return EFileType.JPEG', () => {
      expect(getFileTypeFromFileName('test.jpeg')).toBe(EFileType.JPEG)
    })
  })

  BddTest().when('a file extension is \'png\'', () => {
    BddTest().then('it should return EFileType.PNG', () => {
      expect(getFileTypeFromFileName('test.png')).toBe(EFileType.PNG)
    })
  })
})

BddTest().given('the isDifferentFile helper', () => {
  BddTest().when('both files are identical File instances', () => {
    BddTest().then('it should return false', () => {
      const first = new File(['content'], 'document.pdf', { type: 'application/pdf', lastModified: 1000 })
      const second = new File(['content'], 'document.pdf', { type: 'application/pdf', lastModified: 1000 })
      expect(isDifferentFile(first, second)).toBe(false)
    })
  })

  BddTest().when('two File instances differ', () => {
    BddTest().then('it should return true', () => {
      const first = new File(['content'], 'document.pdf', { type: 'application/pdf', lastModified: 1000 })
      const second = new File(['content'], 'report.pdf', { type: 'application/pdf', lastModified: 1000 })
      expect(isDifferentFile(first, second)).toBe(true)
    })
  })

  BddTest().when('both objects are FileDTO instances with the same id', () => {
    BddTest().then('it should return false', () => {
      const first = {
        id: 'file-1',
        fileName: 'image.png',
        url: 'https://example.com/image.png',
        fileType: EFileType.PNG,
        fileSize: 204800,
        version: 1,
        uploadedAt: '2024-01-15T10:45:00'
      } as FileDTO
      const second = {
        id: 'file-1',
        fileName: 'image2.png',
        url: 'https://example.com/image2.png',
        fileType: EFileType.PNG,
        fileSize: 409600,
        version: 2,
        uploadedAt: '2024-01-15T10:45:00'
      } as FileDTO
      expect(isDifferentFile(first, second)).toBe(false)
    })
  })

  BddTest().when('both objects are FileDTO instances with different ids', () => {
    BddTest().then('it should return true', () => {
      const first = {
        id: 'file-1',
        fileName: 'image.png',
        url: 'https://example.com/image.png',
        fileType: EFileType.PNG,
        fileSize: 204800,
        version: 1,
        uploadedAt: '2024-01-15T10:45:00'
      } as FileDTO
      const second = {
        id: 'file-2',
        fileName: 'image2.png',
        url: 'https://example.com/image2.png',
        fileType: EFileType.PNG,
        fileSize: 409600,
        version: 2,
        uploadedAt: '2024-01-15T10:45:00'
      } as FileDTO
      expect(isDifferentFile(first, second)).toBe(true)
    })
  })

  BddTest().when('one object is a File and the other is a FileDTO', () => {
    BddTest().then('it should return true', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf', lastModified: 1000 })
      const dto = {
        id: 'file-1',
        fileName: 'image2.png',
        url: 'https://example.com/image2.png',
        fileType: EFileType.PNG,
        fileSize: 409600,
        version: 2,
        uploadedAt: '2024-01-15T10:45:00'
      } as FileDTO

      expect(isDifferentFile(file, dto)).toBe(true)
      expect(isDifferentFile(dto, file)).toBe(true)
    })
  })
})
