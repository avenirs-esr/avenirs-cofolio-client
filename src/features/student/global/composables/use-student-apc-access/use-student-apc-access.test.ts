import type { NavigationAccessDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { useStudentApcAccess } from '@/features/student/global/composables/use-student-apc-access/use-student-apc-access'
import { useStudentNavigationAccessControlQuery } from '@/features/student/user'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/features/student/queries', () => ({
  useStudentNavigationAccessControlQuery: vi.fn()
}))

const mockedUseStudentNavigationAccessControlQuery = vi.mocked(useStudentNavigationAccessControlQuery)

BddTest().given('an useStudentApcAccess composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function mockUseStudentNavigationAccessControlQuery (payload: NavigationAccessDTO) {
    const mockData: Ref<NavigationAccessDTO> = ref(payload)
    const queryMockedData = {
      data: mockData,
    } as unknown as UseQueryReturnType<NavigationAccessDTO, BaseApiException>
    mockedUseStudentNavigationAccessControlQuery.mockReturnValue(queryMockedData)
  }

  BddTest().when('APC is enabled by institution and has program', () => {
    beforeEach(() => {
      mockUseStudentNavigationAccessControlQuery({
        APC: {
          enabledByInstitution: true,
          hasProgram: true
        },
        LIFE_PROJECT: {
          enabledByInstitution: false,
        }
      })
    })

    BddTest().then('it should return isApcVisible as true', () => {
      const { isApcVisible } = useStudentApcAccess()
      expect(isApcVisible.value).toBe(true)
    })

    BddTest().then('it should return showApcGenericInfoPage as false', () => {
      const { showApcGenericInfoPage } = useStudentApcAccess()
      expect(showApcGenericInfoPage.value).toBe(false)
    })

    BddTest().then('it should return showApcSubmenus as true', () => {
      const { showApcSubmenus } = useStudentApcAccess()
      expect(showApcSubmenus.value).toBe(true)
    })
  })

  BddTest().when('APC is enabled by institution but has no program', () => {
    beforeEach(() => {
      mockUseStudentNavigationAccessControlQuery({
        APC: {
          enabledByInstitution: true,
          hasProgram: false
        },
        LIFE_PROJECT: {
          enabledByInstitution: false,
        }
      })
    })

    BddTest().then('it should return isApcVisible as true', () => {
      const { isApcVisible } = useStudentApcAccess()
      expect(isApcVisible.value).toBe(true)
    })

    BddTest().then('it should return showApcGenericInfoPage as true', () => {
      const { showApcGenericInfoPage } = useStudentApcAccess()
      expect(showApcGenericInfoPage.value).toBe(true)
    })

    BddTest().then('it should return showApcSubmenus as false', () => {
      const { showApcSubmenus } = useStudentApcAccess()
      expect(showApcSubmenus.value).toBe(false)
    })
  })

  BddTest().when('APC is not enabled by institution', () => {
    beforeEach(() => {
      mockUseStudentNavigationAccessControlQuery({
        APC: {
          enabledByInstitution: false,
          hasProgram: true
        },
        LIFE_PROJECT: {
          enabledByInstitution: false,
        }
      })
    })

    BddTest().then('it should return isApcVisible as false', () => {
      const { isApcVisible } = useStudentApcAccess()
      expect(isApcVisible.value).toBe(false)
    })

    BddTest().then('it should return showApcGenericInfoPage as false', () => {
      const { showApcGenericInfoPage } = useStudentApcAccess()
      expect(showApcGenericInfoPage.value).toBe(false)
    })

    BddTest().then('it should return showApcSubmenus as false', () => {
      const { showApcSubmenus } = useStudentApcAccess()
      expect(showApcSubmenus.value).toBe(false)
    })
  })

  BddTest().when('data is undefined', () => {
    beforeEach(() => {
      mockedUseStudentNavigationAccessControlQuery.mockReturnValue({
        data: { value: undefined }
      } as unknown as UseQueryReturnType<NavigationAccessDTO, BaseApiException>)
    })

    BddTest().then('it should return isApcVisible as false', () => {
      const { isApcVisible } = useStudentApcAccess()
      expect(isApcVisible.value).toBe(false)
    })

    BddTest().then('it should return showApcGenericInfoPage as false', () => {
      const { showApcGenericInfoPage } = useStudentApcAccess()
      expect(showApcGenericInfoPage.value).toBe(false)
    })

    BddTest().then('it should return showApcSubmenus as false', () => {
      const { showApcSubmenus } = useStudentApcAccess()
      expect(showApcSubmenus.value).toBe(false)
    })
  })
})
