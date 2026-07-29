import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { ActivityConsignFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityConsignFormField/ActivityConsignFormField.stub'
import { ActivityExecutionPeriodFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.stub'
import { ActivityFeedbackFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.stub'
import { ActivityReflectionFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityReflectionFormField/ActivityReflectionFormField.stub'
import { ActivityTitleFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.stub'
import { ActivityTraceFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTraceFormField/ActivityTraceFormField.stub'
import { ActivityResourcesListEditableStub } from '@/features/staff/activities/components/lists/ActivityResourcesListEditable/ActivityResourcesListEditable.stub'
import { ContentSectionId } from '@/features/staff/activities/editActivity.constants'
import { ActivityResourceType } from '@/features/staff/activities/types/resource.types'
import ActivityContentTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityContentTab/ActivityContentTab.vue'
import { EditNationalActivityViewTabActionsStub } from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.stub'
import { EditNationalActivityViewFormWrapper, EditNationalActivityViewFormWrapperDirty } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'

BddTest().given('an ActivityContentTab component', () => {
  let wrapper: ReturnType<typeof mount>
  let tab: VueWrapper<InstanceType<typeof ActivityContentTab>>

  const stubs = {
    ActivityConsignFormField: ActivityConsignFormFieldStub,
    ActivityExecutionPeriodFormField: ActivityExecutionPeriodFormFieldStub,
    ActivityFeedbackFormField: ActivityFeedbackFormFieldStub,
    ActivityReflectionFormField: ActivityReflectionFormFieldStub,
    ActivityTitleFormField: ActivityTitleFormFieldStub,
    ActivityTraceFormField: ActivityTraceFormFieldStub,
    ActivityResourcesListEditable: ActivityResourcesListEditableStub,
    EditNationalActivityViewTabActions: EditNationalActivityViewTabActionsStub,
    AvButton: AvButtonStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
  }

  function mountTab (
    FormWrapper: typeof EditNationalActivityViewFormWrapper | typeof EditNationalActivityViewFormWrapperDirty
  ) {
    wrapper = mount(FormWrapper, {
      slots: {
        default: h(ActivityContentTab, {
          activity: mockedActivityContent,
        }),
      },
      global: { stubs }
    })

    tab = wrapper.findComponent(ActivityContentTab)
  }

  const getNextStepButton = () =>
    tab
      .findAllComponents(AvButtonStub)
      .find(c => c.attributes('data-testid') === 'activity-content-tab-next-step-button') as VueWrapper<InstanceType<typeof AvButtonStub>>

  const getResourcesList = () =>
    tab.findComponent(ActivityResourcesListEditableStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mountTab(EditNationalActivityViewFormWrapper)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render IconTitleCardContainer', () => {
      expect(tab.findComponent(IconTitleCardContainerStub).exists()).toBe(true)
    })

    BddTest().then('it should render the main content sections', () => {
      expect(tab.find(`#${ContentSectionId.TITLE}`).exists()).toBe(true)
      expect(tab.find(`#${ContentSectionId.INSTRUCTIONS}`).exists()).toBe(true)
      expect(tab.find(`#${ContentSectionId.DOCUMENTS}`).exists()).toBe(true)
      expect(tab.find(`#${ContentSectionId.CONTEXT}`).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityResourcesListEditable in the DOCUMENTS section', () => {
      const resourcesList = tab
        .find(`#${ContentSectionId.DOCUMENTS}`)
        .findComponent(ActivityResourcesListEditableStub)

      expect(resourcesList.exists()).toBe(true)
    })

    BddTest().then('it should pass form state props to ActivityResourcesListEditable', () => {
      const resourcesList = getResourcesList()

      expect(resourcesList.props('files')).toBeDefined()
      expect(resourcesList.props('links')).toBeDefined()
      expect(resourcesList.props('isFormDirty')).toBe(false)
      expect(resourcesList.props('isUpdating')).toBe(false)
    })

    BddTest().then('it should render form fields', () => {
      expect(tab.findComponent(ActivityTitleFormFieldStub).exists()).toBe(true)
      expect(tab.findComponent(ActivityConsignFormFieldStub).exists()).toBe(true)
      expect(tab.findComponent(ActivityExecutionPeriodFormFieldStub).exists()).toBe(true)
      expect(tab.findComponent(ActivityFeedbackFormFieldStub).exists()).toBe(true)
      expect(tab.findComponent(ActivityReflectionFormFieldStub).exists()).toBe(true)
      expect(tab.findComponent(ActivityTraceFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render the next step button', () => {
      expect(getNextStepButton().exists()).toBe(true)
    })
  })

  BddTest().when('the form is dirty', () => {
    beforeEach(async () => {
      mountTab(EditNationalActivityViewFormWrapperDirty)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should show the next step button as loading', () => {
      expect(getNextStepButton().props('isLoading')).toBe(true)
    })

    BddTest().then('it should pass dirty state to ActivityResourcesListEditable', () => {
      expect(getResourcesList().props('isFormDirty')).toBe(true)
    })
  })

  BddTest().when('the next step button is clicked', () => {
    beforeEach(async () => {
      await getNextStepButton().trigger('click')
    })

    BddTest().then('it should emit nextStep', () => {
      expect(tab.emitted('nextStep')).toBeTruthy()
    })
  })

  BddTest().when('ActivityResourcesListEditable emits add with a file', () => {
    const file = new File(['content'], 'document.pdf', {
      type: 'application/pdf',
    })

    beforeEach(() => {
      getResourcesList().vm.$emit('add', {
        resourceType: ActivityResourceType.FILE,
        file,
      })
    })

    BddTest().then('it should update the form files', () => {
      expect(getResourcesList().props('files')).toContain(file)
    })
  })

  BddTest().when('ActivityResourcesListEditable emits add with a link', () => {
    beforeEach(() => {
      getResourcesList().vm.$emit('add', {
        resourceType: ActivityResourceType.LINK,
        link: 'https://avenir-esr.fr',
      })
    })

    BddTest().then('it should update the form links', () => {
      expect(getResourcesList().props('links')).toContain('https://avenir-esr.fr')
    })
  })

  BddTest().when('ActivityResourcesListEditable emits delete', () => {
    beforeEach(() => {
      getResourcesList().vm.$emit('delete', [], ['https://avenir-esr.fr'])
    })

    BddTest().then('it should remove deleted links from the form', () => {
      expect(getResourcesList().props('links')).not.toContain('https://avenir-esr.fr')
    })
  })
})
