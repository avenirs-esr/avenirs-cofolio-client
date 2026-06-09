import { bytesToMegabytes } from '@/common/utils/filesize/filesize'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('the file size helper', () => {
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
