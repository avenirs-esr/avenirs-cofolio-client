import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ICONS } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'
import { mockedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { ActivityBannerFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityBannerFormField/ActivityBannerFormField.stub'
import { ActivityRecommendedCompletionContextsFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityRecommendedCompletionContextsFormField/ActivityRecommendedCompletionContextsFormField.stub'
import { ActivitySummaryFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivitySummaryFormField/ActivitySummaryFormField.stub'
import { ActivityTargetsFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTargetsFormField/ActivityTargetsFormField.stub'
import { ActivityTitleFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.stub'
import { PublicationSectionId } from '@/features/staff/activities/editActivity.constants'
import ActivityPublicationTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityPublicationTab/ActivityPublicationTab.vue'
import {
  EditNationalActivityViewFormWrapper,
  mockQueueAutoSave,
  resetMockSaveState,
} from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'

BddTest().given('an ActivityPublicationTab component', () => {
  let wrapper: ReturnType<typeof mountComponent>
  let tab: VueWrapper<InstanceType<typeof ActivityPublicationTab>>

  const stubs = {
    ActivityTitleFormField: ActivityTitleFormFieldStub,
    ActivityTargetsFormField: ActivityTargetsFormFieldStub,
    ActivityBannerFormField: ActivityBannerFormFieldStub,
    ActivitySummaryFormField: ActivitySummaryFormFieldStub,
    ActivityRecommendedCompletionContextsFormField: ActivityRecommendedCompletionContextsFormFieldStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
  }

  function mountTab (
    { withSlot = false }: { withSlot?: boolean } = {},
    targetProps: { isSubActivity?: boolean } = {}
  ) {
    wrapper = mountComponent(EditNationalActivityViewFormWrapper, {
      slots: {
        default: h(
          ActivityPublicationTab,
          { modelValue: null, activity: mockedActivityDetail, ...targetProps },
          withSlot ? { default: () => h('div', { 'data-testid': 'custom-slot' }) } : undefined,
        ),
      },
      global: { stubs },
    })

    tab = wrapper.findComponent(ActivityPublicationTab)
  }

  const getActivityTitleCard = () =>
    tab
      .findAllComponents(IconTitleCardContainerStub)
      .find(card => card.props('titleIcon') === ICONS.ACTIVITY)!

  beforeEach(() => {
    vi.clearAllMocks()
    resetMockSaveState()
    mountTab()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render IconTitleCardContainer', () => {
      expect(tab.findComponent(IconTitleCardContainerStub).exists()).toBe(true)
    })

    BddTest().then('it should render every publication section', () => {
      Object.values(PublicationSectionId).forEach((id) => {
        expect(tab.find(`#${id}`).exists()).toBe(true)
      })
    })

    BddTest().then('it should render ActivityTitleFormField', () => {
      expect(tab.findComponent(ActivityTitleFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityTargetsFormField', () => {
      expect(tab.findComponent(ActivityTargetsFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityBannerFormField with the remote banner', () => {
      expect(tab.findComponent(ActivityBannerFormFieldStub).exists()).toBe(true)
      expect(tab.findComponent(ActivityBannerFormFieldStub).props('remoteBanner')).toEqual(mockedActivityDetail.banner)
    })

    BddTest().then('it should render ActivitySummaryFormField', () => {
      expect(tab.findComponent(ActivitySummaryFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityRecommendedCompletionContextsFormField', () => {
      expect(tab.findComponent(ActivityRecommendedCompletionContextsFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should not render any slot content', () => {
      expect(tab.find('[data-testid="custom-slot"]').exists()).toBe(false)
    })
  })

  BddTest().when('content is passed in the default slot', () => {
    beforeEach(() => {
      mountTab({ withSlot: true })
    })

    BddTest().then('it should render the slot content', () => {
      expect(tab.find('[data-testid="custom-slot"]').exists()).toBe(true)
    })
  })

  BddTest().when('a form field asks for an autosave', () => {
    beforeEach(() => {
      tab.findComponent(ActivityBannerFormFieldStub).vm.$emit('autosave')
    })

    BddTest().then('it should queue an autosave', () => {
      expect(mockQueueAutoSave).toHaveBeenCalledOnce()
    })
  })

  BddTest().when('the activity is a main activity', () => {
    beforeEach(() => {
      mountTab({}, { isSubActivity: false })
    })

    BddTest().then('it should display the activity title label', () => {
      expect(getActivityTitleCard().props('title')).toBe('Titre de l\'activité')
    })
  })

  BddTest().when('the activity is a sub-activity', () => {
    beforeEach(() => {
      mountTab({}, { isSubActivity: true })
    })

    BddTest().then('it should display the sub-activity title label', () => {
      expect(getActivityTitleCard().props('title')).toBe('Titre de la sous-activité')
    })
  })
})
