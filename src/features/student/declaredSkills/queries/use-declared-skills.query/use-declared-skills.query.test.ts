import type { BaseApiException } from '@/common/exceptions'
import type { UseMutationReturnType, UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import {
  type DeclaredSkillDTO,
  type DeclaredSkillProgressDetailsDTO,
  type DeclaredSkillProgressDTO,
  EExternalSkillType,
  type PagedResponseDeclaredSkillDTO,
  type PagedResponseDeclaredSkillProgressDTO,
  type PageInfoDTO
} from '@/api/avenir-esr'
import {
  type DeleteDeclaredSkillVariables,
  useDeclaredSkillDetailedQuery,
  useDeclaredSkillsViewQuery,
  useDeleteDeclaredSkillMutation,
  useSearchExternalSkillsQuery,
  useUnassociateTracesFromDeclaredSkillMutation,
  type UseUnassociateTracesFromDeclaredSkillMutationVariables
} from '@/features/student/declaredSkills/queries/use-declared-skills.query/use-declared-skills.query'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable, mountQueryComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an useDeclaredSkillsViewQuery composable', () => {
  const uiidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  BddTest().and('valid query parameters', () => {
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    BddTest().when('the query is executed with all parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseDeclaredSkillDTO | PagedResponseDeclaredSkillProgressDTO, BaseApiException> & {
        skills: Ref<DeclaredSkillDTO[] | DeclaredSkillProgressDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useDeclaredSkillsViewQuery(page, pageSize))

        await flushPromises()
      })

      BddTest().then('it should return mocked skills data for given parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(4)
        expect(queryResult.data.value?.page?.page).toBe(0)
        expect(queryResult.data.value?.page?.totalElements).toBe(20)
        expect(queryResult.data.value?.page?.totalPages).toBe(5)
        expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.FOUR)

        const firstSkill = queryResult.data.value?.data?.[0]
        expect(firstSkill).toHaveProperty('id')
        expect(firstSkill?.id).toMatch(uiidRegex)
        expect(firstSkill?.title).toContain('Ma super compétence')
        expect(firstSkill).toHaveProperty('pathSegments')
        expect(firstSkill).toHaveProperty('type')
      })

      BddTest().then('it should return computed skills array', () => {
        expect(queryResult.skills.value).toHaveLength(4)
        expect(queryResult.skills.value[0]).toHaveProperty('id')
        expect(queryResult.skills.value[0]).toHaveProperty('title')
      })

      BddTest().then('it should return correct pageInfo', () => {
        expect(queryResult.pageInfo.value.totalPages).toBe(5)
        expect(queryResult.pageInfo.value.page).toBe(0)
        expect(queryResult.pageInfo.value.totalElements).toBe(20)
        expect(queryResult.pageInfo.value.pageSize).toBe(PageSizes.FOUR)
      })
    })
  })

  BddTest().and('different page and pageSize values', () => {
    const page = ref(1)
    const pageSize = ref(PageSizes.EIGHT)

    BddTest().when('the query is executed with different parameters', () => {
      let queryResult: UseQueryReturnType<PagedResponseDeclaredSkillDTO | PagedResponseDeclaredSkillProgressDTO, BaseApiException> & {
        skills: Ref<DeclaredSkillDTO[] | DeclaredSkillProgressDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useDeclaredSkillsViewQuery(page, pageSize))
        await flushPromises()
      })

      BddTest().then('it should return data with correct page parameters', () => {
        expect(queryResult.data.value?.data).toHaveLength(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.page).toBe(1)
        expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
        expect(queryResult.data.value?.page?.totalElements).toBe(20)

        const firstSkill = queryResult.data.value?.data?.[0]
        expect(firstSkill?.title).toContain('Ma super compétence')
        expect(firstSkill?.id).toMatch(uiidRegex)
      })

      BddTest().then('it should return correct number of items based on pageSize', () => {
        expect(queryResult.skills.value).toHaveLength(PageSizes.EIGHT)
      })
    })
  })

  BddTest().and('reactive parameters that change', () => {
    const page = ref(0)
    const pageSize = ref(PageSizes.FOUR)

    BddTest().when('parameter values are updated', () => {
      let queryResult: UseQueryReturnType<PagedResponseDeclaredSkillDTO | PagedResponseDeclaredSkillProgressDTO, BaseApiException> & {
        skills: Ref<DeclaredSkillDTO[] | DeclaredSkillProgressDTO[]>
        pageInfo: Ref<PageInfoDTO>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useDeclaredSkillsViewQuery(page, pageSize))
        await flushPromises()
      })

      BddTest().and('page changes', () => {
        beforeEach(async () => {
          page.value = 1
          await flushPromises()
        })

        BddTest().then('the query should update with new page', () => {
          expect(queryResult.data.value?.page?.page).toBe(1)
        })
      })

      BddTest().and('pageSize changes', () => {
        beforeEach(async () => {
          pageSize.value = PageSizes.EIGHT
          await flushPromises()
        })
        BddTest().then('the query should update with new pageSize', async () => {
          expect(queryResult.data.value?.page?.pageSize).toBe(PageSizes.EIGHT)
          expect(queryResult.skills.value).toHaveLength(PageSizes.EIGHT)
        })
      })
    })
  })
})

BddTest().given('an useSearchExternalSkillsQuery composable', () => {
  const uiidRegex = /^search-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  BddTest().and('valid search parameters', () => {
    const keyword = ref('com')
    const pageSize = ref(PageSizes.FOUR)

    BddTest().when('the query is executed with keyword >= 3 characters', () => {
      let queryResult: ReturnType<typeof useSearchExternalSkillsQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSearchExternalSkillsQuery(keyword, pageSize))
        await flushPromises()
      })

      BddTest().then('it should return search results matching the keyword', () => {
        expect(queryResult.skills.value.length).toBeGreaterThan(0)

        const firstSkill = queryResult.skills.value[0]
        expect(firstSkill).toHaveProperty('id')
        expect(firstSkill.id).toMatch(uiidRegex)
        expect(firstSkill.title.toLowerCase()).toContain('com')
        expect(firstSkill).toHaveProperty('pathSegments')
        expect(firstSkill).toHaveProperty('type')
        expect(firstSkill.type).toBe(EExternalSkillType.ROME4)
      })

      BddTest().then('it should have infinite query properties', () => {
        expect(queryResult.hasNextPage).toBeDefined()
        expect(queryResult.fetchNextPage).toBeDefined()
        expect(queryResult.isFetchingNextPage).toBeDefined()
      })
    })

    BddTest().when('keyword is less than 3 characters', () => {
      const shortKeyword = ref('co')
      let queryResult: ReturnType<typeof useSearchExternalSkillsQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSearchExternalSkillsQuery(shortKeyword, pageSize))
        await flushPromises()
      })

      BddTest().then('it should return empty skills array', () => {
        expect(queryResult.skills.value).toHaveLength(0)
      })
    })

    BddTest().when('keyword is empty', () => {
      const emptyKeyword = ref('')
      let queryResult: ReturnType<typeof useSearchExternalSkillsQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSearchExternalSkillsQuery(emptyKeyword, pageSize))
        await flushPromises()
      })

      BddTest().then('it should return empty skills array', () => {
        expect(queryResult.skills.value).toHaveLength(0)
      })
    })

    BddTest().when('keyword changes from valid to invalid', () => {
      const dynamicKeyword = ref('communication')
      let queryResult: ReturnType<typeof useSearchExternalSkillsQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSearchExternalSkillsQuery(dynamicKeyword, pageSize))
        await flushPromises()
      })

      BddTest().then('it should clear results when keyword becomes too short', async () => {
        expect(queryResult.skills.value.length).toBeGreaterThan(0)

        dynamicKeyword.value = 'co'
        await flushPromises()

        expect(queryResult.skills.value).toHaveLength(0)
      })
    })
  })
})

BddTest().given('an useDeclaredSkillDetailedQuery composable', () => {
  BddTest().and('a valid skill id', () => {
    const skillId = ref('test-skill-id-123')

    BddTest().when('the query is executed', () => {
      let queryResult: UseQueryReturnType<DeclaredSkillProgressDetailsDTO, BaseApiException> & {
        declaredSkillDetailed: Ref<DeclaredSkillProgressDetailsDTO | undefined>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useDeclaredSkillDetailedQuery(skillId))
        await flushPromises()
      })

      BddTest().then('it should return the declared skill details', () => {
        expect(queryResult.data.value).toBeDefined()
        expect(queryResult.data.value?.id).toBe('test-skill-id-123')
        expect(queryResult.data.value?.title).toBe('Conduire un projet de bout en bout')
        expect(queryResult.data.value?.type).toBe(EExternalSkillType.ROME4)
      })

      BddTest().then('it should return computed declaredSkillDetailed', () => {
        expect(queryResult.declaredSkillDetailed.value).toBeDefined()
        expect(queryResult.declaredSkillDetailed.value?.id).toBe('test-skill-id-123')
        expect(queryResult.declaredSkillDetailed.value?.title).toBe('Conduire un projet de bout en bout')
      })

      BddTest().then('it should include path segments', () => {
        expect(queryResult.data.value?.pathSegments).toHaveLength(3)
        expect(queryResult.data.value?.pathSegments[0].libelle).toBe('Aider les entreprises à gérer des projets complexes et à s\'adapter aux mutations du marché du travail')
        expect(queryResult.data.value?.pathSegments[1].libelle).toBe('Développer une approche par compétences pour favoriser la mobilité professionnelle et l\'employabilité des individus.')
        expect(queryResult.data.value?.pathSegments[2].libelle).toBe('Conduire un projet de bout en bout')
      })

      BddTest().then('it should include trace associations', () => {
        expect(queryResult.data.value?.traceAssociations).toHaveLength(3)
      })

      BddTest().then('it should include description', () => {
        expect(queryResult.data.value?.description).toBe(`Voici les enjeux et les objectifs de cette compétence \"Conduire un projet de bout en bout\"
Enjeu : Aider les entreprises à gérer des projets complexes et à s'adapter aux mutations du marché du travail
Objectif : Développer une approche par compétences pour favoriser la mobilité professionnelle et l'employabilité des individus.`)
      })

      BddTest().then('it should include timestamps', () => {
        expect(queryResult.data.value?.createdAt).toBeDefined()
        expect(queryResult.data.value?.updatedAt).toBeDefined()
      })
    })
  })

  BddTest().and('an empty skill id', () => {
    const skillId = ref('')

    BddTest().when('the query is executed', () => {
      let queryResult: UseQueryReturnType<DeclaredSkillProgressDetailsDTO, BaseApiException> & {
        declaredSkillDetailed: Ref<DeclaredSkillProgressDetailsDTO | undefined>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useDeclaredSkillDetailedQuery(skillId))
        await flushPromises()
      })

      BddTest().then('it should not fetch data', () => {
        expect(queryResult.data.value).toBeUndefined()
        expect(queryResult.declaredSkillDetailed.value).toBeUndefined()
      })
    })
  })

  BddTest().and('a reactive skill id that changes', () => {
    const skillId = ref('initial-skill-id')

    BddTest().when('the skill id changes', () => {
      let queryResult: UseQueryReturnType<DeclaredSkillProgressDetailsDTO, BaseApiException> & {
        declaredSkillDetailed: Ref<DeclaredSkillProgressDetailsDTO | undefined>
      }

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useDeclaredSkillDetailedQuery(skillId))
        await flushPromises()
      })

      BddTest().then('the query should update with new skill id', async () => {
        const initialId = queryResult.data.value?.id

        skillId.value = 'new-skill-id'
        await flushPromises()

        expect(queryResult.data.value?.id).toBe('new-skill-id')
        expect(queryResult.data.value?.id).not.toBe(initialId)
      })
    })
  })
})

BddTest().given('the useUnassociateTracesFromDeclaredSkillMutation composable', () => {
  let composableResult: UseMutationReturnType<string, BaseApiException, UseUnassociateTracesFromDeclaredSkillMutationVariables, unknown>
  let mockOnSuccess: ReturnType<typeof vi.fn>
  let mockOnError: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnSuccess = vi.fn()
    mockOnError = vi.fn()
    const result = mountComposable(() => useUnassociateTracesFromDeclaredSkillMutation({ onSuccess: mockOnSuccess, onError: mockOnError }), {
      useI18n: true,
      useTanstack: true,
      usePinia: true
    })
    composableResult = result.result
  })

  BddTest().when('the mutation is called with valid data', () => {
    BddTest().then('it should successfully unassociate traces from declared skill', async () => {
      const variables: UseUnassociateTracesFromDeclaredSkillMutationVariables = {
        declaredSkillProgressId: 'skill-1',
        traceIds: ['trace-1', 'trace-2']
      }

      composableResult.mutate(variables)

      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      expect(composableResult.data.value).toBe('success')
    })
  })

  BddTest().when('checking the mutation initial state', () => {
    BddTest().then('it should have correct initial values', () => {
      expect(composableResult.isPending.value).toBe(false)
      expect(composableResult.isError.value).toBe(false)
      expect(composableResult.isSuccess.value).toBe(false)
      expect(composableResult.data.value).toBeUndefined()
    })
  })
})

BddTest().given('the useDeleteDeclaredSkillMutation composable', () => {
  let composableResult: UseMutationReturnType<string, BaseApiException, DeleteDeclaredSkillVariables, unknown>
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    const result = mountComposable(() => useDeleteDeclaredSkillMutation({ onSuccess: mockOnSuccess, onError: mockOnError }), {
      useI18n: true,
      useTanstack: true,
      usePinia: true
    })
    composableResult = result.result
  })

  BddTest().when('checking the mutation initial state', () => {
    BddTest().then('it should have correct initial values', () => {
      expect(composableResult.isPending.value).toBe(false)
      expect(composableResult.isError.value).toBe(false)
      expect(composableResult.isSuccess.value).toBe(false)
      expect(composableResult.data.value).toBeUndefined()
    })
  })

  BddTest().when('the mutation is called with valid data', () => {
    BddTest().then('it should successfully delete the declared skill', async () => {
      const variables: DeleteDeclaredSkillVariables = {
        declaredSkillProgressId: 'skill-to-delete-123'
      }

      composableResult.mutate(variables)

      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      expect(composableResult.data.value).toBe(`Skill progress with id ${variables.declaredSkillProgressId} deleted successfully`)
    })
  })

  BddTest().when('the mutation is called with an invalid id', () => {
    BddTest().then('it should handle the error correctly', async () => {
      const variables: DeleteDeclaredSkillVariables = {
        declaredSkillProgressId: 'INVALID_SKILL_ID'
      }

      composableResult.mutate(variables)

      await vi.waitFor(() => {
        expect(composableResult.isError.value).toBe(true)
      })

      expect(mockOnError).toHaveBeenCalledTimes(1)
      expect(composableResult.error.value).toBeDefined()
    })
  })
})
