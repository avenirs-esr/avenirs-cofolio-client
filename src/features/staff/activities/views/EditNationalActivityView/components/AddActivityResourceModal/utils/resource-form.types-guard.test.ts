import type { AddActivityResourceFileFormData, AddActivityResourceLinkFormData } from '@/features/staff/activities/types/forms.types'
import { ActivityResourceType } from '@/features/staff/activities/types/resource.types'
import { isActivityResourceFileType, isActivityResourceLinkType } from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/utils/resource-form.types-guard'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('activity resource form type guards', () => {
  BddTest().when('the form data is a file type', () => {
    const fileData: AddActivityResourceFileFormData = {
      resourceType: ActivityResourceType.FILE,
      file: new File(['content'], 'guide.pdf', { type: 'application/pdf' }),
      resourceName: 'guide',
    }

    BddTest().then('isActivityResourceFileType should return true', () => {
      expect(isActivityResourceFileType(fileData)).toBe(true)
    })

    BddTest().then('isActivityResourceLinkType should return false', () => {
      expect(isActivityResourceLinkType(fileData)).toBe(false)
    })
  })

  BddTest().when('the form data is a link type', () => {
    const linkData: AddActivityResourceLinkFormData = {
      resourceType: ActivityResourceType.LINK,
      link: 'https://avenir-esr.fr',
    }

    BddTest().then('isActivityResourceFileType should return false', () => {
      expect(isActivityResourceFileType(linkData)).toBe(false)
    })

    BddTest().then('isActivityResourceLinkType should return true', () => {
      expect(isActivityResourceLinkType(linkData)).toBe(true)
    })
  })
})
