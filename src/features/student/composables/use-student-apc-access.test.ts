import type { BaseApiException } from '@/common/exceptions'
import type { StudentNavigationAccessControlDTO } from '@/types'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { useStudentApcAccess } from '@/features/student/composables'
import { useStudentNavigationAccessControlQuery } from '@/features/student/queries'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/student/queries', () => ({
  useStudentNavigationAccessControlQuery: vi.fn()
}))

const mockedUseStudentNavigationAccessControlQuery = vi.mocked(useStudentNavigationAccessControlQuery)

describe('useStudentApcAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function mockUseStudentNavigationAccessControlQuery (payload: StudentNavigationAccessControlDTO) {
    const mockData: Ref<StudentNavigationAccessControlDTO> = ref(payload)
    const queryMockedData = {
      data: mockData,
    } as unknown as UseQueryReturnType<StudentNavigationAccessControlDTO, BaseApiException>
    mockedUseStudentNavigationAccessControlQuery.mockReturnValue(queryMockedData)
  }

  describe('when APC is enabled by institution and has program', () => {
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

    it('should return isApcVisible as true', () => {
      const { isApcVisible } = useStudentApcAccess()
      expect(isApcVisible.value).toBe(true)
    })

    it('should return showApcGenericInfoPage as false', () => {
      const { showApcGenericInfoPage } = useStudentApcAccess()
      expect(showApcGenericInfoPage.value).toBe(false)
    })

    it('should return showApcSubmenus as true', () => {
      const { showApcSubmenus } = useStudentApcAccess()
      expect(showApcSubmenus.value).toBe(true)
    })
  })

  describe('when APC is enabled by institution but has no program', () => {
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

    it('should return isApcVisible as true', () => {
      const { isApcVisible } = useStudentApcAccess()
      expect(isApcVisible.value).toBe(true)
    })

    it('should return showApcGenericInfoPage as true', () => {
      const { showApcGenericInfoPage } = useStudentApcAccess()
      expect(showApcGenericInfoPage.value).toBe(true)
    })

    it('should return showApcSubmenus as false', () => {
      const { showApcSubmenus } = useStudentApcAccess()
      expect(showApcSubmenus.value).toBe(false)
    })
  })

  describe('when APC is not enabled by institution', () => {
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

    it('should return isApcVisible as false', () => {
      const { isApcVisible } = useStudentApcAccess()
      expect(isApcVisible.value).toBe(false)
    })

    it('should return showApcGenericInfoPage as false', () => {
      const { showApcGenericInfoPage } = useStudentApcAccess()
      expect(showApcGenericInfoPage.value).toBe(false)
    })

    it('should return showApcSubmenus as false', () => {
      const { showApcSubmenus } = useStudentApcAccess()
      expect(showApcSubmenus.value).toBe(false)
    })
  })

  describe('when data is undefined', () => {
    beforeEach(() => {
      mockedUseStudentNavigationAccessControlQuery.mockReturnValue({
        data: { value: undefined }
      } as unknown as UseQueryReturnType<StudentNavigationAccessControlDTO, BaseApiException>)
    })

    it('should return isApcVisible as false', () => {
      const { isApcVisible } = useStudentApcAccess()
      expect(isApcVisible.value).toBe(false)
    })

    it('should return showApcGenericInfoPage as false', () => {
      const { showApcGenericInfoPage } = useStudentApcAccess()
      expect(showApcGenericInfoPage.value).toBe(false)
    })

    it('should return showApcSubmenus as false', () => {
      const { showApcSubmenus } = useStudentApcAccess()
      expect(showApcSubmenus.value).toBe(false)
    })
  })
})
