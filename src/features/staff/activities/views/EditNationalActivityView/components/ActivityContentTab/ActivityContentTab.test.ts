import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ActivityConsignFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityConsignFormField/ActivityConsignFormField.stub'
import { ActivityTitleFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.stub'
import { ContentSectionId } from '@/features/staff/activities/editActivity.constants'
import ActivityContentTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityContentTab/ActivityContentTab.vue'
import { EditNationalActivityViewTabActionsStub } from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.stub'
import { EditNationalActivityViewFormWrapper } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'
import { FormFieldCardContainerStub } from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'

BddTest().given('an ActivityContentTab component', () => {
  let wrapper: ReturnType<typeof mount>
  let tab: VueWrapper<InstanceType<typeof ActivityContentTab>>

  const stubs = {
    ActivityConsignFormField: ActivityConsignFormFieldStub,
    ActivityTitleFormField: ActivityTitleFormFieldStub,
    EditNationalActivityViewTabActions: EditNationalActivityViewTabActionsStub,
    AvButton: AvButtonStub,
    FormFieldCardContainer: FormFieldCardContainerStub,
  }

  const getNextStepButton = () => tab.findAllComponents(AvButtonStub).find(c => c.attributes('data-testid') === 'activity-content-tab-next-step-button') as VueWrapper<InstanceType<typeof AvButtonStub>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(EditNationalActivityViewFormWrapper, {
      slots: { default: h(ActivityContentTab, { activity: mockedActivityContent }) },
      global: { stubs },
    })
    tab = wrapper.findComponent(ActivityContentTab)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render FormFieldCardContainer', () => {
      expect(tab.findComponent({ name: 'FormFieldCardContainer' }).exists()).toBe(true)
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

    BddTest().then('it should render ActivityExecutionPeriodFormField', () => {
      expect(tab.findComponent({ name: 'ActivityExecutionPeriodFormField' }).exists()).toBe(true)
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
  })

  BddTest().when('the next step button is clicked', () => {
    beforeEach(async () => {
      await getNextStepButton().trigger('click')
    })

    BddTest().then('it should emit nextStep', () => {
      expect(tab.emitted('nextStep')).toBeTruthy()
    })
  })
})
