import type { ActivityContentDTO, ActivityDraftUpdateRequest } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import type { ExposedComponentInstance } from 'tests/utils'
import type { EditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { PageTitleStub, QuerySuspenseStub } from '@avenirs-esr/shared'
import { EActivityStatus, getGetActivityContentUrl } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { addDays, format, parseISO, subDays } from 'date-fns'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'
import { toValue } from 'vue'
import {
  mockedActivityContent,
  mockedActivityContentWithDatedSubActivities,
  mockedActivityContentWithEnrolledStudent1,
  mockedActivityContentWithoutEnrolledStudent,
  mockedActivityContentWithSubActivities,
  mockedSubActivityContentWithPeriod,
} from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { mockedDevStudentGroupNode, mockedPrimaryInstitutionNode, mockedProgramNode } from '@/__mocks__/fixtures/staffs/staff-scope.fixtures'
import { createGetActivityContentDraftHandler, createUpdateActivityDraftHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { UpdateInProgressBadgeStub } from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { AddNationalActivitySideNavigationStub } from '@/features/staff/activities/components/navigation/AddNationalActivitySideNavigation/AddNationalActivitySideNavigation.stub'
import { EditActivityTabIndex } from '@/features/staff/activities/editActivity.constants'
import { EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import { ActivityContentTabStub } from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityContentTab/ActivityContentTab.stub'
import { ActivityPublicationTabStub } from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityPublicationTab/ActivityPublicationTab.stub'
import { useSubActivitiesOrder } from '@/features/staff/activities/views/EditNationalActivityView/composables/use-sub-activities-order/use-sub-activities-order'
import { mockSubActivitiesOrder, resetMockSubActivitiesOrder } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'
import EditNationalActivityView from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.vue'
import { editNationalActivityViewContextKey } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'

const ADD_ACTIVITY_TITLE = 'Créer mon activité'
const EDIT_ACTIVITY_TITLE = 'Modifier l\'activité'
const OPTION_REQUIRED_ERROR = 'Activez au moins une option\u00A0: commentaire, note ou validation'
const REQUIRED_ERROR = 'Ce champ est requis.'
const SAVE_SUCCESS_MESSAGE = 'Activité enregistrée avec succès'

const DATED_ACTIVITY = mockedActivityContentWithDatedSubActivities
const SUB_ACTIVITY_START_DATE = DATED_ACTIVITY.subActivities.find(({ startDate }) => startDate)!.startDate!
const COVERING_PERIOD: ActivityDraftUpdateRequest = {
  startDate: DATED_ACTIVITY.startDate,
  endDate: DATED_ACTIVITY.endDate,
  enableCompletionPeriod: true
}
const UNCOVERING_PERIOD: ActivityDraftUpdateRequest = {
  ...COVERING_PERIOD,
  startDate: format(addDays(parseISO(SUB_ACTIVITY_START_DATE), 1), 'yyyy-MM-dd')
}

const DATED_SUB_ACTIVITY = mockedSubActivityContentWithPeriod
const WITHIN_PERIOD: ActivityDraftUpdateRequest = {
  startDate: DATED_SUB_ACTIVITY.startDate,
  endDate: DATED_SUB_ACTIVITY.endDate,
  enableCompletionPeriod: true
}
const OVERFLOWING_PERIOD: ActivityDraftUpdateRequest = {
  ...WITHIN_PERIOD,
  startDate: format(subDays(parseISO(DATED_ACTIVITY.startDate!), 1), 'yyyy-MM-dd')
}

const mockMode = ref('edit')

vi.mock('@vueuse/router', () => ({
  useRouteQuery: vi.fn((key: string, defaultValue: string) => {
    if (key === 'mode') {
      return mockMode
    }
    return ref(defaultValue)
  }),
}))

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()
const mockNavigateToStaffActivities = vi.fn()

vi.mock('@/common/composables', async () => {
  const actual = await vi.importActual<typeof import('@/common/composables')>('@/common/composables')
  return {
    ...actual,
    useNavigation: vi.fn(() => ({
      navigateToStaffActivities: mockNavigateToStaffActivities,
    })),
  }
})

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    })),
  }
})

vi.mock('@/features/staff/activities/views/EditNationalActivityView/composables/use-sub-activities-order/use-sub-activities-order', () => ({
  useSubActivitiesOrder: vi.fn(() => mockSubActivitiesOrder),
}))

export const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    }),
  }
})

function getContext (wrapper: VueWrapper<InstanceType<typeof EditNationalActivityView>>): EditNationalActivityViewContext {
  const internalInstance = wrapper.vm as unknown as ExposedComponentInstance
  return internalInstance.$.provides[editNationalActivityViewContextKey] as EditNationalActivityViewContext
}

function makeSavePayload (): ActivityDraftUpdateRequest {
  return ({
    title: (mockedActivityContent as any).title ?? '',
    thematic: (mockedActivityContent as any).thematic,
    description: (mockedActivityContent as any).description ?? '',
    recommendedCompletionContexts: (mockedActivityContent as any).recommendedCompletionContexts ?? '',
    summary: (mockedActivityContent as any).summary ?? '',
    enableReflection: (mockedActivityContent as any).enableReflection ?? true,
    feedbackAllowedIterations: (mockedActivityContent as any).feedbackAllowedIterations ?? 0,
    traceAllowedAssociations: (mockedActivityContent as any).traceAllowedAssociations ?? 0,
  }) as ActivityDraftUpdateRequest
}

BddTest().given('a national activity view', () => {
  let wrapper: VueWrapper<InstanceType<typeof EditNationalActivityView>>

  const stubs = {
    PageTitle: PageTitleStub,
    UpdateInProgressBadge: UpdateInProgressBadgeStub,
    QuerySuspense: QuerySuspenseStub,
    ActivityContentTab: ActivityContentTabStub,
    ActivityPublicationTab: ActivityPublicationTabStub,
    AddNationalActivitySideNavigation: AddNationalActivitySideNavigationStub,
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
  }

  const mountView = async (id = mockedActivityContent.id) => {
    wrapper = mountComponent(EditNationalActivityView, {
      props: { id },
      global: { stubs },
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
  }

  const getAvTabs = () => wrapper.findComponent(AvTabsStub) as VueWrapper<InstanceType<typeof AvTabsStub>>
  const getContentTabItem = () => wrapper.findComponent(AvTabStub)

  const getActiveTab = (): EditActivityTabIndex => getAvTabs().props('modelValue') as EditActivityTabIndex
  const switchTab = async (tab: EditActivityTabIndex) => {
    getAvTabs().vm.$emit('update:modelValue', tab)
    await wrapper.vm.$nextTick()
  }

  const save = async ({
    banner = {
      file: null,
      action: EditActivityFormDataBannerAction.NONE
    },
    data = undefined
  }: {
    banner?: {
      file?: File | null
      action: EditActivityFormDataBannerAction
    }
    data?: ActivityDraftUpdateRequest
  }) => {
    const activeTab = getActiveTab()

    await getContext(wrapper).form.setFieldValue('bannerAction', banner.action)

    await switchTab(EditActivityTabIndex.PUBLICATION)
    await wrapper.findComponent(ActivityPublicationTabStub).vm.$emit('update:modelValue', banner.file)
    await wrapper.vm.$nextTick()
    await switchTab(activeTab)

    await getContext(wrapper).save(data)
    await wrapper.vm.$nextTick()
    await flushPromises()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    resetMockSubActivitiesOrder()
    mockIsMobile.value = false
    mockMode.value = 'edit'
  })

  BddTest().when('the view is mounted in add mode', () => {
    beforeEach(async () => {
      mockMode.value = 'add'
      await mountView()
    })

    BddTest().then('it should render PageTitle with add props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(ADD_ACTIVITY_TITLE)
      expect(pageTitle.props('trailingLinks')).toEqual([
        { text: mockedActivityContent.title },
        { text: ADD_ACTIVITY_TITLE },
      ])
    })

    BddTest().then('it should not render the update in progress badge', () => {
      const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('show')).toBe(false)
    })
  })

  BddTest().when('the view is mounted in edit mode', () => {
    beforeEach(async () => {
      await mountView()
    })

    BddTest().then('it should render PageTitle with edit props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(EDIT_ACTIVITY_TITLE)
      expect(pageTitle.props('trailingLinks')).toEqual([
        { text: mockedActivityContent.title },
        { text: EDIT_ACTIVITY_TITLE },
      ])
    })

    BddTest().then('it should always render the update in progress badge', () => {
      const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('show')).toBe(true)
    })
  })

  BddTest().when('save is triggered with pending changes', () => {
    BddTest().and('the update API succeeds', () => {
      beforeEach(async () => {
        await mountView()
        await save({ data: makeSavePayload() })
      })

      BddTest().then('it should call addSuccessMessage with the correct message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith(SAVE_SUCCESS_MESSAGE)
        })
      })
    })
  })

  BddTest().when('the form is saved successfully after local changes', () => {
    beforeEach(async () => {
      await mountView()

      const context = getContext(wrapper)
      await context.form.setFieldValue('title', 'Updated title')
      await wrapper.vm.$nextTick()

      await context.form.handleSubmit()
      await flushPromises()
    })

    BddTest().then('it should reset the dirty state', () => {
      expect(getContext(wrapper).form.state.isDirty).toBe(false)
    })
  })

  BddTest().when('an autosave succeeds after a local change', () => {
    beforeEach(async () => {
      await mountView()

      const context = getContext(wrapper)
      await context.form.setFieldValue('description', '<p>Nouvelle consigne</p>')
      await wrapper.vm.$nextTick()

      await save({ data: { description: '<p>Nouvelle consigne</p>' } })
    })

    BddTest().then('it should reset the dirty state so the loader stops', () => {
      expect(getContext(wrapper).form.state.isDirty).toBe(false)
    })

    BddTest().then('it should keep the locally edited value', () => {
      expect(getContext(wrapper).form.getFieldValue('description')).toBe('<p>Nouvelle consigne</p>')
    })
  })

  BddTest().when('save is triggered with no pending changes', () => {
    beforeEach(async () => {
      await mountView()
      await save({})
      await flushPromises()
    })

    BddTest().then('it should not call addSuccessMessage', () => {
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should not call addErrorMessage', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('an activity with a period is loaded and the execution period is disabled then saved', () => {
    let capturedPatchBody: unknown
    let getActivityContentCallCount: number
    let currentActivity: ActivityContentDTO

    beforeEach(async () => {
      capturedPatchBody = undefined
      getActivityContentCallCount = 0
      currentActivity = {
        ...mockedActivityContent,
        startDate: '2025-02-01',
        endDate: '2025-10-29',
      }

      server.use(
        createGetActivityContentDraftHandler(() => currentActivity, () => {
          getActivityContentCallCount += 1
        }),
        createUpdateActivityDraftHandler((body) => {
          capturedPatchBody = body
          currentActivity = { ...currentActivity, startDate: undefined, endDate: undefined }
        }),
      )

      await mountView()
    })

    BddTest().then('the form should be initialized with the loaded period', () => {
      expect(getContext(wrapper).form.getFieldValue('startDate')).toBe('2025-02-01')
      expect(getContext(wrapper).form.getFieldValue('endDate')).toBe('2025-10-29')
    })

    BddTest().and('the period is disabled and the form is submitted', () => {
      beforeEach(async () => {
        const context = getContext(wrapper)

        context.isExecutionPeriodEnabled.value = false
        context.form.setFieldValue('startDate', undefined)
        context.form.setFieldValue('endDate', undefined)

        await vi.waitFor(() => {
          expect(context.form.getFieldValue('startDate')).toBeFalsy()
          expect(context.form.getFieldValue('endDate')).toBeFalsy()
        })

        await context.form.handleSubmit()
        await flushPromises()
      })

      BddTest().then('the PATCH payload should contain enableCompletionPeriod set to false', () => {
        expect(capturedPatchBody).toMatchObject({ enableCompletionPeriod: false })
      })

      BddTest().then('the activity content should be refetched after saving', async () => {
        await vi.waitFor(() => {
          expect(getActivityContentCallCount).toBeGreaterThan(1)
        })
      })

      BddTest().then('the previous dates should not reappear after the refetch', async () => {
        await vi.waitFor(() => {
          expect(getActivityContentCallCount).toBeGreaterThan(1)
        })

        expect(currentActivity.startDate).toBeUndefined()
        expect(currentActivity.endDate).toBeUndefined()
        expect(getContext(wrapper).form.getFieldValue('startDate')).toBeFalsy()
        expect(getContext(wrapper).form.getFieldValue('endDate')).toBeFalsy()
      })
    })
  })

  BddTest().when('the activity has targets', () => {
    let capturedPatchBody: ActivityDraftUpdateRequest | undefined

    beforeEach(async () => {
      capturedPatchBody = undefined

      server.use(
        createGetActivityContentDraftHandler(() => ({
          ...mockedActivityContentWithEnrolledStudent1,
          targetInstitutionIds: [mockedPrimaryInstitutionNode.id],
          targetGroupIds: [mockedProgramNode.id],
        })),
        createUpdateActivityDraftHandler((body) => {
          capturedPatchBody = body
        }),
      )

      await mountView()
    })

    BddTest().then('the form should be initialized with the persisted targets', () => {
      expect(getContext(wrapper).form.getFieldValue('targetInstitutionIds')).toEqual([mockedPrimaryInstitutionNode.id])
      expect(getContext(wrapper).form.getFieldValue('targetGroupIds')).toEqual([mockedProgramNode.id])
    })

    BddTest().then('the publication tab should receive the persisted targets and the lock state', async () => {
      await switchTab(EditActivityTabIndex.PUBLICATION)
      const publicationTab = wrapper.findComponent(ActivityPublicationTabStub)

      expect(publicationTab.props('persistedTargetIds')).toEqual([mockedPrimaryInstitutionNode.id, mockedProgramNode.id])
      expect(publicationTab.props('lockPersistedTargets')).toBe(true)
    })

    BddTest().and('the form is submitted after adding a target', () => {
      beforeEach(async () => {
        const context = getContext(wrapper)
        context.form.setFieldValue('targetGroupIds', [mockedProgramNode.id, mockedDevStudentGroupNode.id])
        await context.form.handleSubmit()
        await flushPromises()
      })

      BddTest().then('the PATCH payload should contain all the targets', () => {
        expect(capturedPatchBody).toMatchObject({
          targetInstitutionIds: [mockedPrimaryInstitutionNode.id],
          targetGroupIds: [mockedProgramNode.id, mockedDevStudentGroupNode.id],
        })
      })
    })
  })

  BddTest().when('the form is submitted without thematic', () => {
    let capturedPatchBody: ActivityDraftUpdateRequest | undefined

    beforeEach(async () => {
      capturedPatchBody = undefined

      server.use(
        createUpdateActivityDraftHandler((body) => {
          capturedPatchBody = body
        }),
      )

      await mountView()
      const context = getContext(wrapper)
      context.form.setFieldValue('thematic', undefined)
      context.form.setFieldValue('title', 'Titre sans thématique')
      await context.form.handleSubmit()
      await flushPromises()
    })

    BddTest().then('it should save the draft anyway', async () => {
      await vi.waitFor(() => {
        expect(capturedPatchBody).toMatchObject({ title: 'Titre sans thématique' })
      })
    })

    BddTest().then('it should not flag the thematic field as invalid', () => {
      expect(getContext(wrapper).form.getFieldMeta('thematic')?.errors).toEqual([])
    })
  })

  BddTest().when('the activity has no target', () => {
    let capturedPatchBody: ActivityDraftUpdateRequest | undefined

    beforeEach(async () => {
      capturedPatchBody = undefined

      server.use(
        createGetActivityContentDraftHandler(() => mockedActivityContentWithoutEnrolledStudent),
        createUpdateActivityDraftHandler((body) => {
          capturedPatchBody = body
        }),
      )

      await mountView()
      await getContext(wrapper).form.handleSubmit()
      await flushPromises()
    })

    BddTest().then('the publication tab should not lock anything', async () => {
      await switchTab(EditActivityTabIndex.PUBLICATION)
      expect(wrapper.findComponent(ActivityPublicationTabStub).props('persistedTargetIds')).toEqual([])
      expect(wrapper.findComponent(ActivityPublicationTabStub).props('lockPersistedTargets')).toBeFalsy()
    })

    BddTest().then('the PATCH payload should contain empty targets (national activity)', () => {
      expect(capturedPatchBody).toMatchObject({ targetInstitutionIds: [], targetGroupIds: [] })
    })
  })

  BddTest().when('the activity has an assessment', () => {
    let capturedPatchBody: ActivityDraftUpdateRequest | undefined

    beforeEach(async () => {
      capturedPatchBody = undefined

      server.use(
        createGetActivityContentDraftHandler(() => ({
          ...mockedActivityContent,
          assessment: {
            comment: true,
            grade: 20,
          },
        })),
        createUpdateActivityDraftHandler((body) => {
          capturedPatchBody = body
        }),
      )

      await mountView()
    })

    BddTest().then('the form should be initialized with the persisted assessment', () => {
      const { form } = getContext(wrapper)
      expect(form.getFieldValue('assessmentComment')).toBe(true)
      expect(form.getFieldValue('assessmentGrade')).toBe(20)
      expect(form.getFieldValue('assessmentValidation')).toBe(false)
    })

    BddTest().and('the form is submitted', () => {
      beforeEach(async () => {
        await getContext(wrapper).form.handleSubmit()
        await flushPromises()
      })

      BddTest().then('the PATCH payload should contain the assessment', () => {
        expect(capturedPatchBody).toMatchObject({
          assessment: {
            comment: true,
            grade: 20,
          },
        })
      })
    })

    BddTest().and('the assessment is disabled and the form is submitted', () => {
      beforeEach(async () => {
        const context = getContext(wrapper)
        context.isAssessmentEnabled.value = false
        context.form.setFieldValue('assessmentComment', false)
        context.form.setFieldValue('assessmentGrade', undefined)
        context.form.setFieldValue('assessmentValidation', false)
        await context.form.handleSubmit()
        await flushPromises()
      })

      BddTest().then('the PATCH payload should contain an empty assessment to clear it', () => {
        expect(capturedPatchBody?.assessment).toEqual({})
      })
    })

    BddTest().and('every option is removed while the assessment stays enabled, then the form is submitted', () => {
      beforeEach(async () => {
        const context = getContext(wrapper)
        context.isAssessmentEnabled.value = true
        context.isAssessmentGradeEnabled.value = false
        context.form.setFieldValue('assessmentComment', false)
        context.form.setFieldValue('assessmentGrade', undefined)
        context.form.setFieldValue('assessmentValidation', false)
        await context.form.handleSubmit()
        await flushPromises()
      })

      BddTest().then('it should not save the draft', () => {
        expect(capturedPatchBody).toBeUndefined()
      })

      BddTest().then('it should attach the option required error to the validation field', () => {
        expect(getContext(wrapper).form.getFieldMeta('assessmentValidation')?.errors).toEqual([OPTION_REQUIRED_ERROR])
      })
    })

    BddTest().and('the grade max is cleared while the grade option stays enabled, then the form is submitted', () => {
      beforeEach(async () => {
        const context = getContext(wrapper)
        context.isAssessmentEnabled.value = true
        context.isAssessmentGradeEnabled.value = true
        context.form.setFieldValue('assessmentGrade', undefined)
        await context.form.handleSubmit()
        await flushPromises()
      })

      BddTest().then('it should not save the draft', () => {
        expect(capturedPatchBody).toBeUndefined()
      })

      BddTest().then('it should flag the grade as required', () => {
        expect(getContext(wrapper).form.getFieldMeta('assessmentGrade')?.errors).toEqual([REQUIRED_ERROR])
      })
    })
  })

  BddTest().when('the view is mounted on desktop', () => {
    beforeEach(async () => {
      await mountView()
    })

    BddTest().then('it should render AddNationalActivitySideNavigation', () => {
      expect(wrapper.findComponent(AddNationalActivitySideNavigationStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the correct activeTab prop', () => {
      expect(wrapper.findComponent(AddNationalActivitySideNavigationStub).props('activeTab')).toBe(EditActivityTabIndex.CONTENT)
    })
  })

  BddTest().when('the view is mounted on mobile', () => {
    beforeEach(async () => {
      mockIsMobile.value = true
      await mountView()
    })

    BddTest().then('it should not render AddNationalActivitySideNavigation', () => {
      expect(wrapper.findComponent(AddNationalActivitySideNavigationStub).exists()).toBe(false)
    })
  })

  BddTest().when('the content tab emits nextStep', () => {
    beforeEach(async () => {
      await mountView()
      wrapper.findComponent(ActivityContentTabStub).vm.$emit('nextStep')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should switch the active tab to publication', () => {
      expect(
        wrapper.findComponent(AddNationalActivitySideNavigationStub).props('activeTab'),
      ).toBe(EditActivityTabIndex.PUBLICATION)
    })
  })

  BddTest().when('the publication tab emits published', () => {
    beforeEach(async () => {
      await mountView()
      await switchTab(EditActivityTabIndex.PUBLICATION)
      wrapper.findComponent(ActivityPublicationTabStub).vm.$emit('published')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should navigate back to staff activities', () => {
      expect(mockNavigateToStaffActivities).toHaveBeenCalledWith(true)
    })
  })

  BddTest().when('the form is submitted after local changes', () => {
    let isRefetching: boolean
    let releaseRefetch: () => void
    let submission: Promise<void>

    beforeEach(async () => {
      isRefetching = false
      await mountView()

      const refetchReleased = new Promise<void>((resolve) => {
        releaseRefetch = resolve
      })
      server.use(http.get(`*${getGetActivityContentUrl(EActivityStatus.DRAFT, ':activityId')}`, async () => {
        isRefetching = true
        await refetchReleased
        return HttpResponse.json<ActivityContentDTO>(mockedActivityContent)
      }))

      const context = getContext(wrapper)
      await context.form.setFieldValue('title', 'Updated title')
      submission = context.form.handleSubmit()

      await vi.waitFor(() => {
        expect(isRefetching).toBe(true)
      })
    })

    afterEach(async () => {
      releaseRefetch()
      await submission
    })

    BddTest().then('it should still be saving while the saved activity is refetched', () => {
      expect(getContext(wrapper).isSaving.value).toBe(true)
    })

    BddTest().and('the saved activity is refetched', () => {
      beforeEach(async () => {
        releaseRefetch()
        await submission
      })

      BddTest().then('it should no longer be saving', () => {
        expect(getContext(wrapper).isSaving.value).toBe(false)
      })

      BddTest().then('it should reset the dirty state', () => {
        expect(getContext(wrapper).form.state.isDirty).toBe(false)
      })
    })
  })

  BddTest().when('the form has local changes', () => {
    let patchedTitles: (string | undefined)[]

    beforeEach(async () => {
      patchedTitles = []
      server.use(createUpdateActivityDraftHandler((body) => {
        patchedTitles.push(body.title)
      }))

      await mountView()
      await getContext(wrapper).form.setFieldValue('title', 'Updated title')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('the view should be busy', () => {
      expect(getContext(wrapper).isBusy.value).toBe(true)
      expect(getContentTabItem().props('isLoading')).toBe(true)
    })

    BddTest().then('it should be savable manually', () => {
      expect(getContext(wrapper).canSave.value).toBe(true)
    })

    BddTest().and('the manual save is triggered', () => {
      beforeEach(async () => {
        await getContext(wrapper).saveNow()
        await flushPromises()
      })

      BddTest().then('it should submit the form', () => {
        expect(patchedTitles).toEqual(['Updated title'])
      })

      BddTest().then('the view should no longer be busy', () => {
        expect(getContext(wrapper).isBusy.value).toBe(false)
      })
    })
  })

  BddTest().when('the activity has sub-activities', () => {
    beforeEach(async () => {
      server.use(createGetActivityContentDraftHandler(() => mockedActivityContentWithSubActivities))
      await mountView()
    })

    BddTest().then('it should give the activity id and its sub-activities to the sub-activities order', () => {
      const [activityDraftId, subActivities] = vi.mocked(useSubActivitiesOrder).mock.calls[0]!

      expect(toValue(activityDraftId)).toBe(mockedActivityContent.id)
      expect(toValue(subActivities)).toEqual(mockedActivityContentWithSubActivities.subActivities)
    })

    BddTest().then('it should share the sub-activities order with the tabs', () => {
      expect(getContext(wrapper).subActivitiesOrder).toBe(mockSubActivitiesOrder)
    })
  })

  BddTest().when('the activity has sub-activities with a period', () => {
    let capturedPatchBody: ActivityDraftUpdateRequest | undefined

    beforeEach(async () => {
      capturedPatchBody = undefined
      server.use(createUpdateActivityDraftHandler((body) => {
        capturedPatchBody = body
      }))
      await mountView(DATED_ACTIVITY.id)
    })

    BddTest().and('a period not covering the sub-activities is entered', () => {
      beforeEach(async () => {
        const { form } = getContext(wrapper)
        form.setFieldValue('startDate', UNCOVERING_PERIOD.startDate)
        form.setFieldValue('endDate', UNCOVERING_PERIOD.endDate)
        await form.validate('change')
      })

      BddTest().then('it should flag the end date', () => {
        expect(getContext(wrapper).form.getFieldMeta('endDate')?.errors).toHaveLength(1)
      })

      BddTest().and('another change is autosaved', () => {
        beforeEach(async () => {
          await getContext(wrapper).save({
            title: 'Updated title'
          })
          await flushPromises()
        })

        BddTest().then('it should still flag the end date', () => {
          expect(getContext(wrapper).form.getFieldMeta('endDate')?.errors).toHaveLength(1)
        })
      })
    })

    BddTest().and('a period not covering the sub-activities is autosaved', () => {
      beforeEach(async () => {
        await getContext(wrapper).save(UNCOVERING_PERIOD)
        await flushPromises()
      })

      BddTest().then('it should not save the activity', () => {
        expect(capturedPatchBody).toBeUndefined()
      })
    })

    BddTest().and('a period not covering the sub-activities is autosaved with another change', () => {
      beforeEach(async () => {
        await getContext(wrapper).save({
          ...UNCOVERING_PERIOD,
          title: 'Updated title'
        })
        await flushPromises()
      })

      BddTest().then('it should save the other change without the period', () => {
        expect(capturedPatchBody).toEqual({
          title: 'Updated title'
        })
      })
    })

    BddTest().and('a period covering the sub-activities is autosaved', () => {
      beforeEach(async () => {
        await getContext(wrapper).save(COVERING_PERIOD)
        await flushPromises()
      })

      BddTest().then('it should save the period', () => {
        expect(capturedPatchBody).toEqual(COVERING_PERIOD)
      })
    })

    BddTest().and('the period is disabled while a period not covering the sub-activities is pending', () => {
      beforeEach(async () => {
        await getContext(wrapper).save({
          ...UNCOVERING_PERIOD,
          enableCompletionPeriod: false
        })
        await flushPromises()
      })

      BddTest().then('it should save the disabling', () => {
        expect(capturedPatchBody).toMatchObject({
          enableCompletionPeriod: false
        })
      })
    })
  })

  BddTest().when('the activity is a sub-activity of an activity with a period', () => {
    let capturedPatchBody: ActivityDraftUpdateRequest | undefined
    let isParentActivityFetched: boolean

    beforeEach(async () => {
      capturedPatchBody = undefined
      isParentActivityFetched = false
      server.use(
        http.get(`*${getGetActivityContentUrl(EActivityStatus.DRAFT, ':activityId')}`, ({ params }) => {
          if (params.activityId === DATED_ACTIVITY.id) {
            isParentActivityFetched = true
          }
        }),
        createUpdateActivityDraftHandler((body) => {
          capturedPatchBody = body
        }),
      )

      await mountView(DATED_SUB_ACTIVITY.id)
      await vi.waitFor(() => {
        expect(isParentActivityFetched).toBe(true)
      })
      await flushPromises()
    })

    BddTest().and('a period overflowing the parent activity is entered', () => {
      beforeEach(async () => {
        const { form } = getContext(wrapper)
        form.setFieldValue('startDate', OVERFLOWING_PERIOD.startDate)
        form.setFieldValue('endDate', OVERFLOWING_PERIOD.endDate)
        await form.validate('change')
      })

      BddTest().then('it should flag the end date', () => {
        expect(getContext(wrapper).form.getFieldMeta('endDate')?.errors).toHaveLength(1)
      })

      BddTest().and('another change is autosaved', () => {
        beforeEach(async () => {
          await getContext(wrapper).save({
            title: 'Updated title'
          })
          await flushPromises()
        })

        BddTest().then('it should still flag the end date', () => {
          expect(getContext(wrapper).form.getFieldMeta('endDate')?.errors).toHaveLength(1)
        })
      })
    })

    BddTest().and('a period overflowing the parent activity is autosaved', () => {
      beforeEach(async () => {
        await getContext(wrapper).save(OVERFLOWING_PERIOD)
        await flushPromises()
      })

      BddTest().then('it should not save the activity', () => {
        expect(capturedPatchBody).toBeUndefined()
      })
    })

    BddTest().and('a period overflowing the parent activity is autosaved with another change', () => {
      beforeEach(async () => {
        await getContext(wrapper).save({
          ...OVERFLOWING_PERIOD,
          title: 'Updated title'
        })
        await flushPromises()
      })

      BddTest().then('it should save the other change without the period', () => {
        expect(capturedPatchBody).toEqual({
          title: 'Updated title'
        })
      })
    })

    BddTest().and('a period within the parent activity is autosaved', () => {
      beforeEach(async () => {
        await getContext(wrapper).save(WITHIN_PERIOD)
        await flushPromises()
      })

      BddTest().then('it should save the period', () => {
        expect(capturedPatchBody).toEqual(WITHIN_PERIOD)
      })
    })

    BddTest().and('the period is disabled while a period overflowing the parent activity is pending', () => {
      beforeEach(async () => {
        await getContext(wrapper).save({
          ...OVERFLOWING_PERIOD,
          enableCompletionPeriod: false
        })
        await flushPromises()
      })

      BddTest().then('it should save the disabling', () => {
        expect(capturedPatchBody).toMatchObject({
          enableCompletionPeriod: false
        })
      })
    })
  })

  BddTest().when('the sub-activities order is waiting for the autosave', () => {
    beforeEach(async () => {
      await mountView()
      mockSubActivitiesOrder.hasPendingChanges.value = true
      await wrapper.vm.$nextTick()
    })

    BddTest().then('the view should be busy', () => {
      expect(getContext(wrapper).isBusy.value).toBe(true)
      expect(getContentTabItem().props('isLoading')).toBe(true)
    })

    BddTest().then('it should be savable manually, even if the form is pristine', () => {
      expect(getContext(wrapper).form.state.isDirty).toBe(false)
      expect(getContext(wrapper).canSave.value).toBe(true)
    })

    BddTest().and('the manual save is triggered', () => {
      beforeEach(async () => {
        await getContext(wrapper).saveNow()
        await flushPromises()
      })

      BddTest().then('it should save the sub-activities order', () => {
        expect(mockSubActivitiesOrder.saveNow).toHaveBeenCalledOnce()
      })

      BddTest().then('it should not save the pristine form', () => {
        expect(mockAddSuccessMessage).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the sub-activities order is being saved', () => {
    beforeEach(async () => {
      await mountView()
      mockSubActivitiesOrder.isSaving.value = true
      await wrapper.vm.$nextTick()
    })

    BddTest().then('the view should be saving and busy', () => {
      expect(getContext(wrapper).isSaving.value).toBe(true)
      expect(getContext(wrapper).isBusy.value).toBe(true)
    })
  })
})
