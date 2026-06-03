import { EFileType } from '@/api/avenir-esr'
import { getFileTypeFromFileName } from '@/common/utils/filetype/filetype'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

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
