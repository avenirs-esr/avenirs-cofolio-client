import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ActivitySummaryFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivitySummaryFormField/ActivitySummaryFormField.stub'
import { PublicationSectionId } from '@/features/staff/activities/editActivity.constants'
import ActivityPublicationTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityPublicationTab/ActivityPublicationTab.vue'
import { EditNationalActivityViewFormWrapper, mockSave } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'
import { FormFieldCardContainerStub } from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'

BddTest().given('an ActivityPublicationTab component', () => {
  let wrapper: ReturnType<typeof mount>
  let tab: VueWrapper<InstanceType<typeof ActivityPublicationTab>>

  const stubs = {
    ActivitySummaryFormField: ActivitySummaryFormFieldStub,
    FormFieldCardContainer: FormFieldCardContainerStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(EditNationalActivityViewFormWrapper, {
      slots: { default: h(ActivityPublicationTab, { activity: mockedActivityContent }) },
      global: { stubs },
    })
    tab = wrapper.findComponent(ActivityPublicationTab)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(tab.exists()).toBe(true)
    })

    BddTest().then('it should render FormFieldCardContainer', () => {
      expect(tab.findComponent({ name: 'FormFieldCardContainer' }).exists()).toBe(true)
    })

    BddTest().then('it should render ActivitySummaryFormField', () => {
      expect(tab.findComponent({ name: 'ActivitySummaryFormField' }).exists()).toBe(true)
    })

    BddTest().then('it should render the SUMMARY section anchor', () => {
      expect(tab.find(`#${PublicationSectionId.SUMMARY}`).exists()).toBe(true)
    })

    BddTest().then('it should pass the form to ActivitySummaryFormField', () => {
      const summaryField = tab.findComponent(ActivitySummaryFormFieldStub)
      expect(summaryField.props('form')).toBeTruthy()
    })
  })

  BddTest().when('ActivitySummaryFormField emits autosave', () => {
    beforeEach(() => {
      tab.findComponent(ActivitySummaryFormFieldStub).vm.$emit('autosave', { summary: 'Resume MAJ' })
    })

    BddTest().then('it should call save from the view context', () => {
      expect(mockSave).toHaveBeenCalledWith({ summary: 'Resume MAJ' })
    })
  })
})
