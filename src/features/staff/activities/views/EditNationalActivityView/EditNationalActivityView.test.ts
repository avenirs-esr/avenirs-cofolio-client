import type { ActivityContentDTO, ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { createGetActivityContentDraftHandler, createUpdateActivityDraftHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { AddNationalActivitySideNavigationStub } from '@/features/staff/activities/components/navigation/AddNationalActivitySideNavigation/AddNationalActivitySideNavigation.stub'
import { EditActivityTabIndex } from '@/features/staff/activities/editActivity.constants'
import { EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import { ActivityContentTabStub } from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityContentTab/ActivityContentTab.stub'
import { ActivityPublicationTabStub } from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityPublicationTab/ActivityPublicationTab.stub'
import EditNationalActivityView from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.vue'
import {
  type EditNationalActivityViewContext,
  editNationalActivityViewContextKey,
} from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { type ExposedComponentInstance, mountComponent } from 'tests/utils'
import { vi } from 'vitest'

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
    QuerySuspense: QuerySuspenseStub,
    ActivityContentTab: ActivityContentTabStub,
    ActivityPublicationTab: ActivityPublicationTabStub,
    AddNationalActivitySideNavigation: AddNationalActivitySideNavigationStub,
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
  }

  const mountView = async () => {
    wrapper = mountComponent(EditNationalActivityView, {
      props: { id: mockedActivityContent.id },
      global: { stubs },
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
  }

  const getAvTabs = () => wrapper.findComponent(AvTabsStub) as VueWrapper<InstanceType<typeof AvTabsStub>>
  const getActiveTab = (): EditActivityTabIndex => getAvTabs().props('modelValue')
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

      expect(pageTitle.props('title')).toBe('Créer mon activité')
      expect(pageTitle.props('trailingLinks')).toEqual([
        { text: mockedActivityContent.title },
        { text: 'Créer mon activité' },
      ])
    })
  })

  BddTest().when('the view is mounted in edit mode', () => {
    beforeEach(async () => {
      await mountView()
    })

    BddTest().then('it should render PageTitle with edit props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe('Modifier l\'activité')
      expect(pageTitle.props('trailingLinks')).toEqual([
        { text: mockedActivityContent.title },
        { text: 'Modifier l\'activité' },
      ])
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
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('Activité enregistrée avec succès')
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
})
