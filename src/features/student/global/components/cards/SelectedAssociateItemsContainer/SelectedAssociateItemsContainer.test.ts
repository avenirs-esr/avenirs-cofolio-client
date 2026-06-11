import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import SelectedAssociateItemsContainer, {
  type SelectedAssociateItemsContainerProps
} from '@/features/student/global/components/cards/SelectedAssociateItemsContainer/SelectedAssociateItemsContainer.vue'
import { DeleteOverlayStub } from '@/features/student/global/components/interaction/DeleteOverlay/DeleteOverlay.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const SelectedAssociateItemsContainerComponent = SelectedAssociateItemsContainer as unknown as Component

BddTest().given('a selected associate items container', () => {
  let wrapper: VueWrapper

  const stubs = {
    Card: CardStub,
    DeleteOverlay: DeleteOverlayStub
  }

  const props: SelectedAssociateItemsContainerProps<{ id: string, title: string }> = {
    items: [
      { id: 'item-1', title: 'Item 1' },
      { id: 'item-2', title: 'Item 2' }
    ]
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelectedAssociateItemsContainerComponent, {
        props,
        global: { stubs },
        slots: {
          item: '<div data-testid="item-slot-content">Item slot content</div>'
        }
      })
    })

    BddTest().then('it should render the title with the count', () => {
      expect(wrapper.text()).toContain('Mes éléments sélectionnés (2)')
    })

    BddTest().then('it should render the card container', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should render one delete overlay per item', () => {
      const deleteOverlays = wrapper.findAll('[data-testid="delete-overlay-stub"]')
      expect(deleteOverlays).toHaveLength(2)
    })
  })

  BddTest().when('a delete overlay emits delete', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelectedAssociateItemsContainerComponent, {
        props,
        global: { stubs },
        slots: {
          item: '<div data-testid="item-slot-content">Item slot content</div>'
        }
      })
    })

    BddTest().then('it should emit delete with the corresponding item id', async () => {
      const deleteOverlays = wrapper.findAllComponents(DeleteOverlayStub)

      await deleteOverlays[0].vm.$emit('delete')

      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')?.[0]).toEqual(['item-1'])
    })
  })

  BddTest().when('the component is mounted with no items', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelectedAssociateItemsContainerComponent, {
        props: {
          items: []
        },
        global: { stubs },
        slots: {
          item: '<div data-testid="item-slot-content">Item slot content</div>'
        }
      })
    })

    BddTest().then('it should render the title with zero count', () => {
      expect(wrapper.text()).toContain('Mes éléments sélectionnés (0)')
    })

    BddTest().then('it should not render any delete overlay', () => {
      const deleteOverlays = wrapper.findAll('[data-testid="delete-overlay-stub"]')
      expect(deleteOverlays).toHaveLength(0)
    })
  })
})
