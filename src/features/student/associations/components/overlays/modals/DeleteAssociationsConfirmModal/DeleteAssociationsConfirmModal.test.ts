import type { DeleteAssociationsConfirmModalProps } from '@/features/student/associations/components/overlays/modals/DeleteAssociationsConfirmModal/DeleteAssociationsConfirmModal.vue'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import DeleteAssociationsConfirmModal from '@/features/student/associations/components/overlays/modals/DeleteAssociationsConfirmModal/DeleteAssociationsConfirmModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a DeleteAssociationsConfirmModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteAssociationsConfirmModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
  }

  const getHeader = () => wrapper.find('[data-testid="delete-associations-confirm-modal__header"]')
  const getAssociationsList = () => wrapper.find('[data-testid="delete-associations-confirm-modal__associations-list"]')

  BddTest().when('the component is mounted without associations', () => {
    const props: DeleteAssociationsConfirmModalProps = {
      opened: true,
      associations: []
    }

    beforeEach(() => {
      wrapper = mount(DeleteAssociationsConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should not render the associations list', () => {
      expect(getAssociationsList().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a single association', () => {
    const props: DeleteAssociationsConfirmModalProps = {
      opened: true,
      associations: [{ id: '1', title: 'Association 1' }]
    }

    beforeEach(() => {
      wrapper = mount(DeleteAssociationsConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should display a singular title', () => {
      expect(getHeader().text()).toBe('Êtes-vous certain(e) de vouloir supprimer cette association\u00A0?')
    })
  })

  BddTest().when('the component is mounted with associations', () => {
    const props: DeleteAssociationsConfirmModalProps = {
      opened: true,
      associations: [
        { id: '1', title: 'Association 1' },
        { id: '2', title: 'Association 2' }
      ]
    }

    beforeEach(() => {
      wrapper = mount(DeleteAssociationsConfirmModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the opened confirmation modal', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('opened')).toBe(true)
    })

    BddTest().then('it should display a pluralized title', () => {
      expect(getHeader().text()).toBe('Êtes-vous certain(e) de vouloir supprimer ces associations\u00A0?')
    })

    BddTest().then('it should render the associations list', () => {
      const items = getAssociationsList().findAll('li')

      expect(items).toHaveLength(2)
      expect(items[0].text()).toBe('Association 1')
      expect(items[1].text()).toBe('Association 2')
    })

    BddTest().and('the user clicks the cancel button', () => {
      beforeEach(() => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('close')
      })

      BddTest().then('it should emit "cancel"', () => {
        expect(wrapper.emitted()).toHaveProperty('cancel')
      })
    })

    BddTest().and('the user clicks the confirm button', () => {
      beforeEach(() => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
      })

      BddTest().then('it should emit "confirm"', () => {
        expect(wrapper.emitted()).toHaveProperty('confirm')
      })
    })
  })
})
