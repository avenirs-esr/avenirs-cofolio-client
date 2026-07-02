import { type ActivityResourceFile, type ActivityResourceLink, ActivityResourceType } from '@/features/staff/activities/types/resource.types'
import { isActivityResourceFile, isActivityResourceLink } from '@/features/staff/activities/utils/resource.types-guard'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('activity resource type guards', () => {
  BddTest().when('the resource type is file', () => {
    const fileResource: ActivityResourceFile = {
      type: ActivityResourceType.FILE,
      title: 'guide.pdf',
      fileId: '123',
    }

    BddTest().then('isActivityResourceFile should return true', () => {
      expect(isActivityResourceFile(fileResource)).toBe(true)
    })

    BddTest().then('isActivityResourceLink should return false', () => {
      expect(isActivityResourceLink(fileResource)).toBe(false)
    })
  })

  BddTest().when('the resource type is link', () => {
    const linkResource: ActivityResourceLink = {
      type: ActivityResourceType.LINK,
      title: 'Documentation',
      url: 'https://avenir-esr.fr',
    }

    BddTest().then('isActivityResourceFile should return false', () => {
      expect(isActivityResourceFile(linkResource)).toBe(false)
    })

    BddTest().then('isActivityResourceLink should return true', () => {
      expect(isActivityResourceLink(linkResource)).toBe(true)
    })
  })
})
