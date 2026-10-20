import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { EGroupType } from '@/api/avenir-esr'
import { useGroupTypeConfig } from '@/features/staff/admin/views/AdminInstitutionGroupsView/composables/use-group-type-config/use-group-type-config'

BddTest().given('a useGroupTypeConfig composable', () => {
  let getGroupTypeConfig: ReturnType<typeof useGroupTypeConfig>['getGroupTypeConfig']

  const PROGRAM_LABEL = 'Formation'
  const PROGRAM_OPTION_LABEL = 'Option de formation'
  const STUDENT_GROUP_LABEL = 'Ensemble d\'apprenant(e)s'

  beforeEach(() => {
    const { result } = mountComposable(useGroupTypeConfig, { useI18n: true })
    getGroupTypeConfig = result.getGroupTypeConfig
  })

  BddTest().when('getting the config for a PROGRAM group', () => {
    BddTest().then('it should return the school icon and translated label', () => {
      const config = getGroupTypeConfig(EGroupType.PROGRAM)

      expect(config.icon.value).toBe(MDI_ICONS.SCHOOL_OUTLINE)
      expect(config.label.value).toBe(PROGRAM_LABEL)
    })
  })

  BddTest().when('getting the config for a PROGRAM_OPTION group', () => {
    BddTest().then('it should return the book icon and translated label', () => {
      const config = getGroupTypeConfig(EGroupType.PROGRAM_OPTION)

      expect(config.icon.value).toBe(MDI_ICONS.BOOK_OPEN_BLANK_VARIANT_OUTLINE)
      expect(config.label.value).toBe(PROGRAM_OPTION_LABEL)
    })
  })

  BddTest().when('getting the config for a STUDENT_GROUP group', () => {
    BddTest().then('it should return the people group icon and translated label', () => {
      const config = getGroupTypeConfig(EGroupType.STUDENT_GROUP)

      expect(config.icon.value).toBe(MDI_ICONS.PEOPLE_GROUP_OUTLINE)
      expect(config.label.value).toBe(STUDENT_GROUP_LABEL)
    })
  })
})
