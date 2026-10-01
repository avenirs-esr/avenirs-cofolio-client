import type { VueWrapper } from '@vue/test-utils'
import { EActivityStatus } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import DeleteActivityDefinitivelyConfirmationModal from '@/features/staff/activities/components/modals/DeleteActivityDefinitivelyConfirmationModal/DeleteActivityDefinitivelyConfirmationModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

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

BddTest().given('a DeleteActivityDefinitivelyConfirmationModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteActivityDefinitivelyConfirmationModal>>

  function mountModal (props: { opened: boolean, activityId: string }) {
    return mountComponent(DeleteActivityDefinitivelyConfirmationModal, {
      props: { ...props, activityStatus: EActivityStatus.PUBLISHED },
      global: { stubs: { ConfirmationModal: ConfirmationModalStub } },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('mounted with opened=true and a valid activityId', () => {
    beforeEach(() => {
      wrapper = mountModal({ opened: true, activityId: 'activity-id-123' })
    })

    BddTest().then('it should pass opened=true to ConfirmationModal', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('opened')).toBe(true)
    })

    BddTest().then('it should pass the correct title', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('title')).toBe('Êtes-vous certain(e) de vouloir supprimer définitivement cette activité nationale ?')
    })

    BddTest().then('it should pass the irreversibility warning as description', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('description')).toBe('Cette action est irréversible : l\'activité et les données associées seront définitivement supprimées.')
    })

    BddTest().and('the modal emits close', () => {
      beforeEach(() => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('close')
      })

      BddTest().then('it should re-emit close', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })
  })

  BddTest().when('mounted with opened=false', () => {
    beforeEach(() => {
      wrapper = mountModal({ opened: false, activityId: 'activity-id-123' })
    })

    BddTest().then('it should pass opened=false to ConfirmationModal', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('opened')).toBe(false)
    })
  })

  BddTest().when('confirm is triggered with a valid activityId and the API succeeds', () => {
    beforeEach(async () => {
      wrapper = mountModal({ opened: true, activityId: 'activity-id-123' })
      wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
      await flushPromises()
    })

    BddTest().then('it should call addSuccessMessage', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledWith('L\'activité a été supprimée définitivement avec succès')
    })

    BddTest().then('it should emit deleted', () => {
      expect(wrapper.emitted('deleted')).toBeTruthy()
    })

    BddTest().then('it should not call addErrorMessage', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('confirm is triggered with INVALID_ACTIVITY_ID and the API returns an error', () => {
    beforeEach(async () => {
      wrapper = mountModal({ opened: true, activityId: 'INVALID_ACTIVITY_ID' })
      wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
      await flushPromises()
    })

    BddTest().then('it should call addErrorMessage with the correct title', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Une erreur est survenue lors de la suppression définitive de l\'activité',
        })
      )
    })

    BddTest().then('it should not emit deleted', () => {
      expect(wrapper.emitted('deleted')).toBeUndefined()
    })

    BddTest().then('it should not call addSuccessMessage', () => {
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })
  })
})
