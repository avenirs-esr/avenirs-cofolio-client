import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ActivityConsignFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityConsignFormField/ActivityConsignFormField.stub'
import { ActivityFeedbackFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.stub'
import { ActivityReflectionFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityReflectionFormField/ActivityReflectionFormField.stub'
import { ActivityTitleFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.stub'
import { ActivityTraceFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTraceFormField/ActivityTraceFormField.stub'
import { ActivityResourcesListStub } from '@/features/staff/activities/components/lists/ActivityResourcesList/ActivityResourcesList.stub'
import { ContentSectionId } from '@/features/staff/activities/editActivity.constants'
import { ActivityResourceType } from '@/features/staff/activities/types/resource.types'
import ActivityContentTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityContentTab/ActivityContentTab.vue'
import { AddActivityResourceModalStub } from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/AddActivityResourceModal.stub'
import { EditNationalActivityViewTabActionsStub } from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.stub'
import { EditNationalActivityViewFormWrapper, EditNationalActivityViewFormWrapperDirty } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'
import { IconTitleCardContainerStub } from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'

BddTest().given('an ActivityContentTab component', () => {
  let wrapper: ReturnType<typeof mount>
  let tab: VueWrapper<InstanceType<typeof ActivityContentTab>>

  const stubs = {
    ActivityConsignFormField: ActivityConsignFormFieldStub,
    ActivityFeedbackFormField: ActivityFeedbackFormFieldStub,
    ActivityReflectionFormField: ActivityReflectionFormFieldStub,
    ActivityTitleFormField: ActivityTitleFormFieldStub,
    ActivityTraceFormField: ActivityTraceFormFieldStub,
    ActivityResourcesList: ActivityResourcesListStub,
    AddActivityResourceModal: AddActivityResourceModalStub,
    EditNationalActivityViewTabActions: EditNationalActivityViewTabActionsStub,
    AvButton: AvButtonStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
  }

  function mountTab (FormWrapper: typeof EditNationalActivityViewFormWrapper | typeof EditNationalActivityViewFormWrapperDirty) {
    wrapper = mount(FormWrapper, {
      slots: { default: h(ActivityContentTab, { activity: mockedActivityContent }) },
      global: { stubs },
    })
    tab = wrapper.findComponent(ActivityContentTab)
  }

  const getNextStepButton = () => tab.findAllComponents(AvButtonStub).find(c => c.attributes('data-testid') === 'activity-content-tab-next-step-button') as VueWrapper<InstanceType<typeof AvButtonStub>>
  const getModal = () => tab.findComponent(AddActivityResourceModalStub)
  const getResourcesList = () => tab.findComponent(ActivityResourcesListStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mountTab(EditNationalActivityViewFormWrapper)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render IconTitleCardContainer', () => {
      expect(tab.findComponent({ name: 'IconTitleCardContainer' }).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityTitleFormField', () => {
      expect(tab.findComponent({ name: 'ActivityTitleFormField' }).exists()).toBe(true)
    })

    BddTest().then('it should render the TITLE section anchor', () => {
      expect(tab.find(`#${ContentSectionId.TITLE}`).exists()).toBe(true)
    })

    BddTest().then('it should render the INSTRUCTIONS section anchor', () => {
      expect(tab.find(`#${ContentSectionId.INSTRUCTIONS}`).exists()).toBe(true)
    })

    BddTest().then('it should render the INSTRUCTIONS IconTitleCardContainer as collapsible and collapsed', () => {
      const instructionsSection = tab.find(`#${ContentSectionId.INSTRUCTIONS}`)
      const cardContainer = instructionsSection.findComponent({ name: 'IconTitleCardContainer' })
      expect(cardContainer.props('collapsible')).toBeDefined()
      expect(cardContainer.props('collapsed')).toBeDefined()
    })

    BddTest().then('it should render the DOCUMENTS section anchor', () => {
      expect(tab.find(`#${ContentSectionId.DOCUMENTS}`).exists()).toBe(true)
    })

    BddTest().then('it should render the DOCUMENTS IconTitleCardContainer as collapsible and collapsed', () => {
      const documentsSection = tab.find(`#${ContentSectionId.DOCUMENTS}`)
      const cardContainer = documentsSection.findComponent({ name: 'IconTitleCardContainer' })
      expect(cardContainer.props('collapsible')).toBeDefined()
      expect(cardContainer.props('collapsed')).toBeDefined()
    })

    BddTest().then('it should render the ActivityResourcesList with the add card enabled in the DOCUMENTS section', () => {
      const documentsSection = tab.find(`#${ContentSectionId.DOCUMENTS}`)
      const resourcesList = documentsSection.findComponent(ActivityResourcesListStub)
      expect(resourcesList.exists()).toBe(true)
      expect(resourcesList.props('showAddCard')).toBe(true)
    })

    BddTest().then('it should render the CONTEXT section anchor with a collapsible and collapsed IconTitleCardContainer', () => {
      const contextSection = tab.find(`#${ContentSectionId.CONTEXT}`)
      expect(contextSection.exists()).toBe(true)
      const cardContainer = contextSection.findComponent({ name: 'IconTitleCardContainer' })
      expect(cardContainer.props('collapsible')).toBeDefined()
      expect(cardContainer.props('collapsed')).toBeDefined()
    })

    BddTest().then('it should render ActivityExecutionPeriodFormField', () => {
      expect(tab.findComponent({ name: 'ActivityExecutionPeriodFormField' }).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityFeedbackFormField', () => {
      expect(tab.findComponent({ name: 'ActivityFeedbackFormField' }).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityReflectionFormField', () => {
      expect(tab.findComponent({ name: 'ActivityReflectionFormField' }).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityTraceFormField', () => {
      expect(tab.findComponent({ name: 'ActivityTraceFormField' }).exists()).toBe(true)
    })

    BddTest().then('it should render EditNationalActivityViewTabActions', () => {
      expect(tab.findComponent({ name: 'EditNationalActivityViewTabActions' }).exists()).toBe(true)
    })

    BddTest().then('it should render the next step AvButton', () => {
      expect(getNextStepButton().exists()).toBe(true)
    })

    BddTest().then('it should render the next step button with correct label', () => {
      expect(getNextStepButton().props('label')).toBe('Étape suivante')
    })

    BddTest().then('it should not set disabled on the next step button when form is pristine', () => {
      expect(getNextStepButton().props('disabled')).toBe(false)
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
  })

  BddTest().when('the next step button is clicked', () => {
    beforeEach(async () => {
      await getNextStepButton().trigger('click')
    })

    BddTest().then('it should emit nextStep', () => {
      expect(tab.emitted('nextStep')).toBeTruthy()
    })
  })

  BddTest().when('the add resource modal is rendered', () => {
    BddTest().then('it should render the modal closed initially', () => {
      expect(getModal().exists()).toBe(true)
      expect(getModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the resources list emits add', () => {
    beforeEach(() => {
      getResourcesList().vm.$emit('add')
    })

    BddTest().then('it should open the modal', () => {
      expect(getModal().props('opened')).toBe(true)
    })
  })

  BddTest().when('the modal emits close', () => {
    beforeEach(() => {
      getResourcesList().vm.$emit('add')
      getModal().vm.$emit('close')
    })

    BddTest().then('it should close the modal', () => {
      expect(getModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the modal emits added with a file payload', () => {
    beforeEach(() => {
      getResourcesList().vm.$emit('add')
      getModal().vm.$emit('added', {
        resourceType: ActivityResourceType.FILE,
        file: new File(['content'], 'document.pdf', { type: 'application/pdf' }),
        resourceName: 'document',
      })
    })

    BddTest().then('it should pass the added file to the resources list', () => {
      expect(getResourcesList().props('files')).toHaveLength(1)
    })

    BddTest().then('it should close the modal', () => {
      expect(getModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the modal emits added with a link payload', () => {
    beforeEach(() => {
      getResourcesList().vm.$emit('add')
      getModal().vm.$emit('added', {
        resourceType: ActivityResourceType.LINK,
        link: 'https://avenir-esr.fr',
      })
    })

    BddTest().then('it should pass the added link to the resources list', () => {
      expect(getResourcesList().props('links')).toHaveLength(1)
      expect(getResourcesList().props('links')[0]).toBe('https://avenir-esr.fr')
    })

    BddTest().then('it should close the modal', () => {
      expect(getModal().props('opened')).toBe(false)
    })
  })
})
