import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import UnpublishActivityConfirmationModal from '@/features/staff/activities/components/modals/UnpublishActivityConfirmationModal/UnpublishActivityConfirmationModal.vue'
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

BddTest().given('an UnpublishActivityConfirmationModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UnpublishActivityConfirmationModal>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('mounted with show=true and a valid activityId', () => {
    beforeEach(() => {
      wrapper = mountComponent(UnpublishActivityConfirmationModal, {
        props: { show: true, activityId: 'activity-id-123' },
        global: { stubs: { ConfirmationModal: ConfirmationModalStub } },
      })
    })

    BddTest().then('it should pass show=true to ConfirmationModal', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('show')).toBe(true)
    })

    BddTest().then('it should pass the correct title', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('title')).toBe('Êtes-vous certain(e) de vouloir dépublier cette activité ?')
    })

    BddTest().then('it should pass showDescription=false', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('showDescription')).toBe(false)
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

  BddTest().when('mounted with show=false', () => {
    beforeEach(() => {
      wrapper = mountComponent(UnpublishActivityConfirmationModal, {
        props: { show: false, activityId: 'activity-id-123' },
        global: { stubs: { ConfirmationModal: ConfirmationModalStub } },
      })
    })

    BddTest().then('it should pass show=false to ConfirmationModal', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('show')).toBe(false)
    })
  })

  BddTest().when('confirm is triggered with a valid activityId and the API succeeds', () => {
    beforeEach(async () => {
      wrapper = mountComponent(UnpublishActivityConfirmationModal, {
        props: { show: true, activityId: 'activity-id-123' },
        global: { stubs: { ConfirmationModal: ConfirmationModalStub } },
      })
      wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
      await flushPromises()
    })

    BddTest().then('it should call addSuccessMessage', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledWith('L\'activité a été dépubliée avec succès')
    })

    BddTest().then('it should emit unpublished', () => {
      expect(wrapper.emitted('unpublished')).toBeTruthy()
    })

    BddTest().then('it should not call addErrorMessage', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('confirm is triggered with INVALID_ACTIVITY_ID and the API returns an error', () => {
    beforeEach(async () => {
      wrapper = mountComponent(UnpublishActivityConfirmationModal, {
        props: { show: true, activityId: 'INVALID_ACTIVITY_ID' },
        global: { stubs: { ConfirmationModal: ConfirmationModalStub } },
      })
      wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
      await flushPromises()
    })

    BddTest().then('it should call addErrorMessage with the correct title', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Une erreur est survenue lors de la dépublication de l\'activité',
        })
      )
    })

    BddTest().then('it should not emit unpublished', () => {
      expect(wrapper.emitted('unpublished')).toBeUndefined()
    })

    BddTest().then('it should not call addSuccessMessage', () => {
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })
  })
})
