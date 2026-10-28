import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { EAuthorizationEntityType } from '@/api/avenir-esr'
import { usePaginatedUserContextualAuthorizations } from '@/features/staff/admin/views/InstitutionUserDetailedView/composables/use-paginated-user-contextual-authorizations/use-paginated-user-contextual-authorizations'

function mountUsePaginatedUserContextualAuthorizations ({
  currentPage = 0,
  pageSize = PageSizes.TWELVE,
  entityType = EAuthorizationEntityType.ACTIVITY,
  userId = mockExternalUserDetail.id,
}: {
  currentPage?: number
  pageSize?: PageSizes
  entityType?: EAuthorizationEntityType
  userId?: string
} = {}) {
  const currentPageRef = ref(currentPage)
  const pageSizeRef = ref(pageSize)
  const entityTypeRef = ref(entityType)
  const userIdRef = ref(userId)

  const { result } = mountComposable(() => usePaginatedUserContextualAuthorizations({
    currentPageRef,
    pageSizeRef,
    entityTypeRef,
    userIdRef,
  }), { useTanstack: true })

  return {
    ...result,
    currentPageRef,
    pageSizeRef,
    entityTypeRef,
    userIdRef,
  }
}

BddTest().given('a usePaginatedUserContextualAuthorizations composable', () => {
  BddTest().when('the composable is mounted', () => {
    let result: ReturnType<typeof mountUsePaginatedUserContextualAuthorizations>

    beforeEach(() => {
      result = mountUsePaginatedUserContextualAuthorizations()
    })

    BddTest().then('it should expose the pagination handlers', () => {
      expect(result.pageSizeSelected.value).toBe(PageSizes.TWELVE)
      expect(typeof result.onUpdateCurrentPage).toBe('function')
      expect(typeof result.onUpdatePageSize).toBe('function')
    })

    BddTest().then('it should return the contextual authorizations and page info from the API', async () => {
      await vi.waitFor(() => {
        expect(result.authorizations.value.length).toBeGreaterThan(0)
        expect(result.pageInfo.value).toBeDefined()
      })
    })
  })

  BddTest().when('the current page changes', () => {
    let result: ReturnType<typeof mountUsePaginatedUserContextualAuthorizations>

    beforeEach(() => {
      result = mountUsePaginatedUserContextualAuthorizations()
    })

    BddTest().then('it should update the selected page', () => {
      result.onUpdateCurrentPage(1)

      expect(result.currentPageRef.value).toBe(1)
    })

    BddTest().then('it should fetch the authorizations for the selected page', async () => {
      result.onUpdateCurrentPage(1)

      await vi.waitFor(() => {
        expect(result.pageInfo.value?.page).toBe(1)
      })
    })
  })

  BddTest().when('the page size changes', () => {
    let result: ReturnType<typeof mountUsePaginatedUserContextualAuthorizations>

    beforeEach(() => {
      result = mountUsePaginatedUserContextualAuthorizations()
    })

    BddTest().then('it should update the selected page size', () => {
      result.onUpdatePageSize(PageSizes.EIGHT)

      expect(result.pageSizeSelected.value).toBe(PageSizes.EIGHT)
    })
  })

  BddTest().when('the entity type changes', () => {
    let result: ReturnType<typeof mountUsePaginatedUserContextualAuthorizations>

    beforeEach(() => {
      result = mountUsePaginatedUserContextualAuthorizations()
    })

    BddTest().then('it should fetch authorizations for the selected entity type', async () => {
      result.entityTypeRef.value = EAuthorizationEntityType.ACTIVITY_DRAFT

      await nextTick()

      await vi.waitFor(() => {
        expect(result.authorizations.value.length).toBeGreaterThan(0)
        expect(result.authorizations.value.every(
          authorization => authorization.entityType === EAuthorizationEntityType.ACTIVITY_DRAFT,
        )).toBe(true)
      })
    })
  })

  BddTest().when('the user id changes', () => {
    let result: ReturnType<typeof mountUsePaginatedUserContextualAuthorizations>

    beforeEach(() => {
      result = mountUsePaginatedUserContextualAuthorizations()
    })

    BddTest().then('it should update the authorizations for the selected user', async () => {
      result.userIdRef.value = 'INVALID_USER_ID'

      await nextTick()

      await vi.waitFor(() => {
        expect(result.error.value).not.toBeNull()
      })
    })
  })
})
