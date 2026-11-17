import type { Association } from '@/features/student/associations/types/associations.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ConfirmationModalStub } from '@avenirs-esr/shared'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, beforeEach, expect } from 'vitest'
import ConfirmManageAssociationModal from '@/features/student/associations/components/overlays/modals/ConfirmManageAssociationModal/ConfirmManageAssociationModal.vue'
import { PendingItemsListStub } from '@/features/student/associations/components/overlays/modals/ConfirmManageAssociationModal/PendingItemsList.stub'

BddTest().given('a confirm manage association modal', () => {
  const items: Association[] = [
    { id: 'skill', title: 'Skill', contextType: EAssociationContextType.DECLARED_SKILL },
    { id: 'trace-1', title: 'Trace 1', contextType: EAssociationContextType.TRACE },
    { id: 'activity', title: 'Activity', contextType: EAssociationContextType.DECLARED_ACTIVITY },
    { id: 'trace-2', title: 'Trace 2', contextType: EAssociationContextType.TRACE },
    { id: 'experience', title: 'Experience', contextType: EAssociationContextType.DECLARED_EXPERIENCE },
    { id: 'program', title: 'Program', contextType: EAssociationContextType.DECLARED_PROGRAM },
    { id: 'unknown', title: 'No context' }
  ]

  let wrapper: ReturnType<typeof mountComponent<typeof ConfirmManageAssociationModal>>

  afterEach(() => wrapper?.unmount())

  BddTest().when('the modal is opened with items from different context types', () => {
    beforeEach(() => {
      wrapper = mountComponent(ConfirmManageAssociationModal, {
        props: { opened: true, items, title: 'Confirm selection' },
        global: { stubs: { ConfirmationModal: ConfirmationModalStub, PendingItemsList: PendingItemsListStub } }
      })
    })

    BddTest().then('it should pass the open state and title to the confirmation modal', () => {
      expect(wrapper.findComponent(ConfirmationModalStub).props('opened')).toBe(true)
      expect(wrapper.text()).toContain('Confirm selection')
    })

    BddTest().then('it should group the items by context type in display order', () => {
      const lists = wrapper.findAllComponents(PendingItemsListStub)
      expect(lists.map(list => list.props('items'))).toEqual([
        [items[1], items[3]],
        [items[2]],
        [items[0]],
        [items[4]],
        [items[5]]
      ])
    })

    BddTest().and('the user closes the modal', () => {
      beforeEach(() => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('close')
      })

      BddTest().then('it should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toEqual([[]])
      })
    })

    BddTest().and('the user confirms', () => {
      beforeEach(() => {
        wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
      })

      BddTest().then('it should emit confirm', () => {
        expect(wrapper.emitted('confirm')).toEqual([[]])
      })
    })
  })
})
