import type { FileDTO } from '@/api/avenir-esr'
import { EFileType } from '@/api/avenir-esr'
import { isActivityResourceFile, isActivityResourceLink, isActivityResourcePendingFile } from '@/features/staff/activities/utils/resource.types-guard'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('activity resource type guards', () => {
  BddTest().when('the resource is a saved file', () => {
    const fileResource: FileDTO = {
      id: '123',
      fileName: 'guide.pdf',
      fileType: EFileType.PDF,
      fileSize: 1024,
      url: 'https://avenir-esr.fr/guide.pdf',
      uploadedAt: '2026-07-05T00:00:00Z',
    }

    BddTest().then('isActivityResourceFile should return true', () => {
      expect(isActivityResourceFile(fileResource)).toBe(true)
    })

    BddTest().then('isActivityResourceLink should return false', () => {
      expect(isActivityResourceLink(fileResource)).toBe(false)
    })

    BddTest().then('isPendingFile should return false', () => {
      expect(isActivityResourcePendingFile(fileResource)).toBe(false)
    })
  })

  BddTest().when('the resource is a pending file', () => {
    const pendingFile = new File(['content'], 'guide.pdf', { type: 'application/pdf' })

    BddTest().then('isActivityResourceFile should return true', () => {
      expect(isActivityResourceFile(pendingFile)).toBe(true)
    })

    BddTest().then('isActivityResourceLink should return false', () => {
      expect(isActivityResourceLink(pendingFile)).toBe(false)
    })

    BddTest().then('isPendingFile should return true', () => {
      expect(isActivityResourcePendingFile(pendingFile)).toBe(true)
    })
  })

  BddTest().when('the resource is a link', () => {
    const linkResource = 'https://avenir-esr.fr'

    BddTest().then('isActivityResourceFile should return false', () => {
      expect(isActivityResourceFile(linkResource)).toBe(false)
    })

    BddTest().then('isActivityResourceLink should return true', () => {
      expect(isActivityResourceLink(linkResource)).toBe(true)
    })

    BddTest().then('isPendingFile should return false', () => {
      expect(isActivityResourcePendingFile(linkResource)).toBe(false)
    })
  })
})
