import SelfKnowledgeElementsDropdown, { type SelfKnowledgeElementsDropdownProps } from '@/features/student/selfKnowledge/components/dropdowns/SelfKnowledgeElementsDropdown/SelfKnowledgeElementsDropdown.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvDropdown: AvDropdownStub,
}

BddTest().given('a self knowledge elements dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementsDropdown>>

  function mountDropdown (props: SelfKnowledgeElementsDropdownProps): VueWrapper<InstanceType<typeof SelfKnowledgeElementsDropdown>> {
    return mount(SelfKnowledgeElementsDropdown, { props, global: { stubs } })
  }

  BddTest().and('the category is deletable', () => {
    const props: SelfKnowledgeElementsDropdownProps = {
      addLabel: 'Add an improvement',
      deleteLabel: 'Delete an improvement',
      shareLabel: 'Share my improvements',
      isCategoryDeletable: true
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountDropdown(props)
      })

      BddTest().then('it should render the AvDropdown with correct props', () => {
        const dropdown = wrapper.findComponent(AvDropdownStub)
        expect(dropdown.exists()).toBe(true)
        expect(dropdown.props('items')).toEqual([
          { name: 'add', label: 'Add an improvement', icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE },
          { name: 'delete', label: 'Delete an improvement', icon: MDI_ICONS.TRASH_CAN_OUTLINE },
          { name: 'share', label: 'Share my improvements', icon: MDI_ICONS.SHARE_VARIANT_OUTLINE },
          { name: 'deleteCategory', label: 'Supprimer la catégorie', icon: MDI_ICONS.TRASH_CAN_OUTLINE }
        ])
      })

      BddTest().and('the add item is selected', () => {
        beforeEach(async () => {
          const dropdown = wrapper.findComponent(AvDropdownStub)
          await dropdown.vm.$emit('itemSelected', 'add')
        })

        BddTest().then('it should emit the addSelected event', () => {
          expect(wrapper.emitted()).toHaveProperty('addSelected')
        })
      })

      BddTest().and('the delete item is selected', () => {
        beforeEach(async () => {
          const dropdown = wrapper.findComponent(AvDropdownStub)
          await dropdown.vm.$emit('itemSelected', 'delete')
        })

        BddTest().then('it should emit the deleteSelected event', () => {
          expect(wrapper.emitted()).toHaveProperty('deleteSelected')
        })
      })

      BddTest().and('the share item is selected', () => {
        beforeEach(async () => {
          const dropdown = wrapper.findComponent(AvDropdownStub)
          await dropdown.vm.$emit('itemSelected', 'share')
        })

        BddTest().then('it should emit the shareSelected event', () => {
          expect(wrapper.emitted()).toHaveProperty('shareSelected')
        })
      })

      BddTest().and('the deleteCategory item is selected', () => {
        beforeEach(async () => {
          const dropdown = wrapper.findComponent(AvDropdownStub)
          await dropdown.vm.$emit('itemSelected', 'deleteCategory')
        })

        BddTest().then('it should emit the deleteCategorySelected event', () => {
          expect(wrapper.emitted()).toHaveProperty('deleteCategorySelected')
        })
      })
    })
  })

  BddTest().and('the category is not deletable', () => {
    const props: SelfKnowledgeElementsDropdownProps = {
      addLabel: 'Add a strength',
      deleteLabel: 'Delete an strength',
      shareLabel: 'Share my strengths',
      isCategoryDeletable: false
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountDropdown(props)
      })

      BddTest().then('it should render the AvDropdown with correct props', () => {
        const dropdown = wrapper.findComponent(AvDropdownStub)
        expect(dropdown.exists()).toBe(true)
        expect(dropdown.props('items')).toEqual([
          { name: 'add', label: 'Add a strength', icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE },
          { name: 'delete', label: 'Delete an strength', icon: MDI_ICONS.TRASH_CAN_OUTLINE },
          { name: 'share', label: 'Share my strengths', icon: MDI_ICONS.SHARE_VARIANT_OUTLINE }
        ])
      })
    })
  })
})
