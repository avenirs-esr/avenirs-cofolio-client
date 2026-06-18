import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import DeleteDraftActivityConfirmationModal from '@/features/staff/activities/components/modals/DeleteDraftActivityConfirmationModal/DeleteDraftActivityConfirmationModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a DeleteDraftActivityConfirmationModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteDraftActivityConfirmationModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
  }

  const mountModal = (show: boolean) => mount(DeleteDraftActivityConfirmationModal, {
    props: { show },
    global: { stubs },
  })

  BddTest().when('mounted with show=true', () => {
    beforeEach(() => {
      wrapper = mountModal(true)
    })

    BddTest().then('it should pass show=true to ConfirmationModal', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('show')).toBe(true)
    })

    BddTest().then('it should pass the correct title', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('title')).toBe('Êtes-vous certain(e) de vouloir supprimer cette activité ?')
    })

    BddTest().then('it should pass no-description', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('noDescription')).toBe(true)
    })

    BddTest().and('the modal emits close', () => {
      beforeEach(() => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('close')
      })

      BddTest().then('it should re-emit close', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })

    BddTest().and('the modal emits confirm', () => {
      beforeEach(() => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
      })

      BddTest().then('it should re-emit confirm', () => {
        expect(wrapper.emitted('confirm')).toBeTruthy()
      })
    })
  })

  BddTest().when('mounted with show=false', () => {
    beforeEach(() => {
      wrapper = mountModal(false)
    })

    BddTest().then('it should pass show=false to ConfirmationModal', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('show')).toBe(false)
    })
  })
})
