import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ICONS } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'
import { mockedSubActivitiesOverviewDTO } from '@/__mocks__/fixtures/shared/activities.fixtures'
import { mockedActivityContent, mockedActivityContentWithEnrolledStudent1, mockedActivityContentWithSubActivities } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { ActivityAssessmentFormFieldsContainerStub } from '@/features/staff/activities/components/interactions/ActivityAssessmentFormFieldsContainer/ActivityAssessmentFormFieldsContainer.stub'
import { ActivityConsignFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityConsignFormField/ActivityConsignFormField.stub'
import { ActivityExecutionPeriodFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.stub'
import { ActivityFeedbackFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.stub'
import { ActivityReflectionFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityReflectionFormField/ActivityReflectionFormField.stub'
import { ActivityTitleFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.stub'
import { ActivityTraceFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTraceFormField/ActivityTraceFormField.stub'
import { ActivityResourcesListEditableStub } from '@/features/staff/activities/components/lists/ActivityResourcesListEditable/ActivityResourcesListEditable.stub'
import { ActivityCreationModalStub } from '@/features/staff/activities/components/modals/ActivityCreationModal/ActivityCreationModal.stub'
import { ContentSectionId } from '@/features/staff/activities/editActivity.constants'
import { ActivityResourceType } from '@/features/staff/activities/types/resource.types'
import ActivityContentTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityContentTab/ActivityContentTab.vue'
import { EditNationalActivityViewTabActionsStub } from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.stub'
import { ManageSubActivitiesDropdownStub } from '@/features/staff/activities/views/EditNationalActivityView/components/interactions/dropdowns/ManageSubActivitiesDropdown/ManageSubActivitiesDropdown.stub'
import { SubActivitiesSortableListStub } from '@/features/staff/activities/views/EditNationalActivityView/components/lists/SubActivitiesSortableList/SubActivitiesSortableList.stub'
import { DeleteSubActivitiesModalStub } from '@/features/staff/activities/views/EditNationalActivityView/components/modals/DeleteSubActivitiesModal/DeleteSubActivitiesModal.stub'
import {
  EditNationalActivityViewFormWrapper,
  EditNationalActivityViewFormWrapperDirty,
  mockIsBusy,
  mockIsSaving,
  mockSubActivitiesOrder,
  resetMockSaveState,
  resetMockSubActivitiesOrder,
} from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'

BddTest().given('an ActivityContentTab component', () => {
  let wrapper: ReturnType<typeof mount>
  let tab: VueWrapper<InstanceType<typeof ActivityContentTab>>

  const stubs = {
    ActivityAssessmentFormFieldsContainer: ActivityAssessmentFormFieldsContainerStub,
    ActivityConsignFormField: ActivityConsignFormFieldStub,
    ActivityCreationModal: ActivityCreationModalStub,
    ActivityExecutionPeriodFormField: ActivityExecutionPeriodFormFieldStub,
    ActivityFeedbackFormField: ActivityFeedbackFormFieldStub,
    ActivityReflectionFormField: ActivityReflectionFormFieldStub,
    ActivityResourcesListEditable: ActivityResourcesListEditableStub,
    ActivityTitleFormField: ActivityTitleFormFieldStub,
    ActivityTraceFormField: ActivityTraceFormFieldStub,
    AvButton: AvButtonStub,
    DeleteSubActivitiesModal: DeleteSubActivitiesModalStub,
    EditNationalActivityViewTabActions: EditNationalActivityViewTabActionsStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    ManageSubActivitiesDropdown: ManageSubActivitiesDropdownStub,
    SubActivitiesSortableList: SubActivitiesSortableListStub,
  }

  function mountTab (
    FormWrapper: typeof EditNationalActivityViewFormWrapper | typeof EditNationalActivityViewFormWrapperDirty,
    activity = mockedActivityContent,
    targetProps: { isSubActivity?: boolean } = {},
  ) {
    wrapper = mount(FormWrapper, {
      slots: {
        default: h(ActivityContentTab, {
          activity,
          ...targetProps
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

  const getSubActivitiesList = () =>
    tab.findComponent(SubActivitiesSortableListStub)

  const getManageSubActivitiesDropdown = () =>
    tab.findComponent(ManageSubActivitiesDropdownStub)

  const getActivityCreationModal = () =>
    tab.findComponent(ActivityCreationModalStub)

  const getDeleteSubActivitiesModal = () =>
    tab.findComponent(DeleteSubActivitiesModalStub)

  const getActivityTitleCard = () =>
    tab
      .findAllComponents(IconTitleCardContainerStub)
      .find(card => card.props('titleIcon') === ICONS.ACTIVITY)!

  beforeEach(() => {
    vi.clearAllMocks()
    resetMockSaveState()
    resetMockSubActivitiesOrder()
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
      expect(tab.findComponent(ActivityAssessmentFormFieldsContainerStub).exists()).toBe(true)
    })

    BddTest().then('it should render the next step button', () => {
      expect(getNextStepButton().exists()).toBe(true)
    })

    BddTest().then('it should render SubActivitiesSortableList in the SUB_ACTIVITIES section', () => {
      const subActivitiesList = tab
        .find(`#${ContentSectionId.SUB_ACTIVITIES}`)
        .findComponent(SubActivitiesSortableListStub)

      expect(subActivitiesList.exists()).toBe(true)
    })

    BddTest().then('it should render ManageSubActivitiesDropdown in the SUB_ACTIVITIES section', () => {
      const dropdown = tab
        .find(`#${ContentSectionId.SUB_ACTIVITIES}`)
        .findComponent(ManageSubActivitiesDropdownStub)

      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should let the sub-activities menu be used', () => {
      expect(getManageSubActivitiesDropdown().props('isLoading')).toBe(false)
    })

    BddTest().then('it should pass an empty list to SubActivitiesSortableList', () => {
      expect(getSubActivitiesList().props('modelValue')).toEqual([])
    })

    BddTest().then('it should not show the sub-activities as being saved', () => {
      expect(getSubActivitiesList().props('isLoading')).toBe(false)
    })

    BddTest().then('it should render ActivityCreationModal closed', () => {
      expect(getActivityCreationModal().props('opened')).toBe(false)
    })

    BddTest().then('it should pass the activity id to ActivityCreationModal', () => {
      expect(getActivityCreationModal().props('activityDraftId')).toBe(mockedActivityContent.id)
    })

    BddTest().then('it should tell ManageSubActivitiesDropdown there is no sub-activity and no enrolled student', () => {
      expect(getManageSubActivitiesDropdown().props('hasSubActivities')).toBe(false)
      expect(getManageSubActivitiesDropdown().props('hasEnrolledStudent')).toBe(false)
    })

    BddTest().then('it should render DeleteSubActivitiesModal closed, for the activity', () => {
      expect(getDeleteSubActivitiesModal().props('opened')).toBe(false)
      expect(getDeleteSubActivitiesModal().props('activityDraftId')).toBe(mockedActivityContent.id)
    })
  })

  BddTest().when('the form is dirty', () => {
    beforeEach(async () => {
      mountTab(EditNationalActivityViewFormWrapperDirty)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should pass dirty state to ActivityResourcesListEditable', () => {
      expect(getResourcesList().props('isFormDirty')).toBe(true)
    })
  })

  BddTest().when('the view is busy', () => {
    beforeEach(async () => {
      mockIsBusy.value = true
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should show the next step button as loading', () => {
      expect(getNextStepButton().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('a save is in flight', () => {
    beforeEach(async () => {
      mockIsSaving.value = true
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should pass the updating state to ActivityResourcesListEditable', () => {
      expect(getResourcesList().props('isUpdating')).toBe(true)
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

  BddTest().when('the activity has sub-activities', () => {
    beforeEach(async () => {
      mockSubActivitiesOrder.orderedSubActivities.value = mockedSubActivitiesOverviewDTO
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should pass the ordered sub-activities to SubActivitiesSortableList', () => {
      expect(getSubActivitiesList().props('modelValue')).toEqual(mockedSubActivitiesOverviewDTO)
    })

    BddTest().then('it should tell ManageSubActivitiesDropdown there are sub-activities', () => {
      expect(getManageSubActivitiesDropdown().props('hasSubActivities')).toBe(true)
    })

    BddTest().then('it should pass the ordered sub-activities to DeleteSubActivitiesModal', () => {
      expect(getDeleteSubActivitiesModal().props('subActivities')).toEqual(mockedSubActivitiesOverviewDTO)
    })

    BddTest().and('they are reordered', () => {
      const reversedSubActivities = [...mockedSubActivitiesOverviewDTO].reverse()

      beforeEach(async () => {
        getSubActivitiesList().vm.$emit('update:modelValue', reversedSubActivities)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hand the new order over to the sub-activities order', () => {
        expect(mockSubActivitiesOrder.orderedSubActivities.value).toEqual(reversedSubActivities)
      })
    })
  })

  BddTest().when('a period is entered', () => {
    const startDate = '2026-03-01'
    const endDate = '2026-03-31'

    beforeEach(async () => {
      const form = tab.findComponent(ActivityExecutionPeriodFormFieldStub).props('form')!
      form.setFieldValue('startDate', startDate)
      form.setFieldValue('endDate', endDate)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should pass the period to SubActivitiesSortableList', () => {
      expect(getSubActivitiesList().props()).toMatchObject({
        activityStartDate: startDate,
        activityEndDate: endDate
      })
    })
  })

  BddTest().when('the sub-activities order is waiting for the autosave', () => {
    beforeEach(async () => {
      mockSubActivitiesOrder.hasPendingChanges.value = true
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not show the sub-activities as being saved yet', () => {
      expect(getSubActivitiesList().props('isLoading')).toBe(false)
    })

    BddTest().then('it should lock the sub-activities menu', () => {
      expect(getManageSubActivitiesDropdown().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('the sub-activities order is being saved', () => {
    beforeEach(async () => {
      mockSubActivitiesOrder.isSaving.value = true
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should show the sub-activities as being saved', () => {
      expect(getSubActivitiesList().props('isLoading')).toBe(true)
    })

    BddTest().then('it should lock the sub-activities menu', () => {
      expect(getManageSubActivitiesDropdown().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('ManageSubActivitiesDropdown emits add', () => {
    beforeEach(async () => {
      getManageSubActivitiesDropdown().vm.$emit('add')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should open ActivityCreationModal', () => {
      expect(getActivityCreationModal().props('opened')).toBe(true)
    })
  })

  BddTest().when('ActivityCreationModal emits close', () => {
    beforeEach(async () => {
      getManageSubActivitiesDropdown().vm.$emit('add')
      await wrapper.vm.$nextTick()

      getActivityCreationModal().vm.$emit('close')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should close ActivityCreationModal', () => {
      expect(getActivityCreationModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('students are enrolled in the activity', () => {
    beforeEach(() => {
      mountTab(EditNationalActivityViewFormWrapper, mockedActivityContentWithEnrolledStudent1)
    })

    BddTest().then('it should tell ManageSubActivitiesDropdown', () => {
      expect(getManageSubActivitiesDropdown().props('hasEnrolledStudent')).toBe(true)
    })
  })

  BddTest().when('ManageSubActivitiesDropdown emits delete', () => {
    beforeEach(async () => {
      getManageSubActivitiesDropdown().vm.$emit('delete')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should open DeleteSubActivitiesModal', () => {
      expect(getDeleteSubActivitiesModal().props('opened')).toBe(true)
    })

    BddTest().and('DeleteSubActivitiesModal emits cancel', () => {
      beforeEach(async () => {
        getDeleteSubActivitiesModal().vm.$emit('cancel')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should close DeleteSubActivitiesModal', () => {
        expect(getDeleteSubActivitiesModal().props('opened')).toBe(false)
      })
    })

    BddTest().and('DeleteSubActivitiesModal emits deleted', () => {
      beforeEach(async () => {
        getDeleteSubActivitiesModal().vm.$emit('deleted')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should close DeleteSubActivitiesModal', () => {
        expect(getDeleteSubActivitiesModal().props('opened')).toBe(false)
      })
    })
  })

  BddTest().when('the activity is a main activity', () => {
    beforeEach(() => {
      mountTab(EditNationalActivityViewFormWrapper, mockedActivityContent, { isSubActivity: false })
    })

    BddTest().then('it should display the activity title label', () => {
      expect(getActivityTitleCard().props('title')).toBe('Titre de l\'activité\u00A0*')
    })
  })

  BddTest().when('the activity is a sub-activity', () => {
    beforeEach(() => {
      mountTab(EditNationalActivityViewFormWrapper, mockedActivityContentWithSubActivities, { isSubActivity: true })
    })

    BddTest().then('it should display the sub-activity title label', () => {
      expect(getActivityTitleCard().props('title')).toBe('Titre de la sous-activité\u00A0*')
    })
  })
})
