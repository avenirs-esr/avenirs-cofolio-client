import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ConfirmationModalStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockedSubActivitiesOverviewDTO } from '@/__mocks__/fixtures/shared/activities.fixtures'
import { mockedActivityContentWithSubActivities } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ConfirmDeleteSubActivitiesModalStub } from '@/features/staff/activities/views/EditNationalActivityView/components/modals/ConfirmDeleteSubActivitiesModal/ConfirmDeleteSubActivitiesModal.stub'
import DeleteSubActivitiesModal from '@/features/staff/activities/views/EditNationalActivityView/components/modals/DeleteSubActivitiesModal/DeleteSubActivitiesModal.vue'
import { CompactCardSelectorStub } from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.stub'

BddTest().given('a DeleteSubActivitiesModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteSubActivitiesModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
    CompactCardSelector: CompactCardSelectorStub,
    ConfirmDeleteSubActivitiesModal: ConfirmDeleteSubActivitiesModalStub,
  }

  const getModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getSelector = () => wrapper.findComponent(CompactCardSelectorStub)
  const getConfirmModal = () => wrapper.findComponent(ConfirmDeleteSubActivitiesModalStub)

  async function selectSubActivities (subActivityIds: string[]) {
    getSelector().vm.$emit('update:modelValue', subActivityIds)
    await flushPromises()
  }

  beforeEach(() => {
    wrapper = mountComponent(DeleteSubActivitiesModal, {
      props: {
        opened: true,
        activityDraftId: mockedActivityContentWithSubActivities.id,
        subActivities: mockedSubActivitiesOverviewDTO,
      },
      global: { stubs },
    })
  })

  BddTest().when('the modal is opened with the sub-activities of the draft', () => {
    BddTest().then('it should ask which sub-activities to delete', () => {
      expect(wrapper.find('[data-testid="delete-sub-activities-modal-title"]').text()).toBe('Quelles sous-activités souhaitez-vous supprimer ?')
    })

    BddTest().then('it should let the user pick among the sub-activities, none selected', () => {
      expect(getSelector().props('elements')).toEqual(mockedSubActivitiesOverviewDTO)
      expect(getSelector().props('modelValue')).toEqual([])
    })

    BddTest().then('it should disable the confirm button with its tooltip', () => {
      expect(getModal().props('confirmButtonDisabled')).toBe(true)
      expect(getModal().props('confirmButtonDisabledTooltip')).toBe('Sélectionnez au moins une sous-activité à supprimer')
    })

    BddTest().then('it should keep the confirmation modal closed', () => {
      expect(getConfirmModal().props('opened')).toBe(false)
    })

    BddTest().and('the user cancels', () => {
      beforeEach(async () => {
        getModal().vm.$emit('close')
        await flushPromises()
      })

      BddTest().then('it should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the user selects two sub-activities', () => {
    const [first, , third] = mockedSubActivitiesOverviewDTO

    beforeEach(async () => {
      await selectSubActivities([third.id, first.id])
    })

    BddTest().then('it should enable the confirm button with the selected count', () => {
      expect(getModal().props('confirmButtonDisabled')).toBe(false)
      expect(getModal().props('confirmButtonLabel')).toBe('Supprimer les sous-activités sélectionnées (2)')
    })

    BddTest().and('the user cancels', () => {
      beforeEach(async () => {
        getModal().vm.$emit('close')
        await flushPromises()
      })

      BddTest().then('it should emit cancel and clear the selection', () => {
        expect(wrapper.emitted('cancel')).toHaveLength(1)
        expect(getSelector().props('modelValue')).toEqual([])
      })
    })

    BddTest().and('the user confirms the selection', () => {
      beforeEach(async () => {
        getModal().vm.$emit('confirm')
        await flushPromises()
      })

      BddTest().then('it should open the confirmation modal for the draft, with the selected sub-activities in the list order', () => {
        expect(getConfirmModal().props('opened')).toBe(true)
        expect(getConfirmModal().props('activityDraftId')).toBe(mockedActivityContentWithSubActivities.id)
        expect(getConfirmModal().props('subActivities')).toEqual([first, third])
      })

      BddTest().and('the confirmation is cancelled', () => {
        beforeEach(async () => {
          getConfirmModal().vm.$emit('cancel')
          await flushPromises()
        })

        BddTest().then('it should close the confirmation modal and keep the selection', () => {
          expect(getConfirmModal().props('opened')).toBe(false)
          expect(getSelector().props('modelValue')).toEqual([third.id, first.id])
        })
      })

      BddTest().and('the sub-activities are deleted', () => {
        beforeEach(async () => {
          getConfirmModal().vm.$emit('deleted')
          await flushPromises()
        })

        BddTest().then('it should close the confirmation modal and clear the selection', () => {
          expect(getConfirmModal().props('opened')).toBe(false)
          expect(getSelector().props('modelValue')).toEqual([])
        })

        BddTest().then('it should emit deleted', () => {
          expect(wrapper.emitted('deleted')).toHaveLength(1)
        })
      })
    })
  })
})
