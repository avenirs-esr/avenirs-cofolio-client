import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import SelfKnowledgeElementsDropdown, { type SelfKnowledgeElementsDropdownProps } from '@/features/selfKnowledge/components/dropdowns/SelfKnowledgeElementsDropdown/SelfKnowledgeElementsDropdown.vue'
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

  function isCategoryDeletable (categoryType: ESelfKnowledgeCategory) {
    return (![
      ESelfKnowledgeCategory.VALUES,
      ESelfKnowledgeCategory.STRENGTHS,
      ESelfKnowledgeCategory.ASPIRATIONS
    ].includes(categoryType))
  }

  for (const category of Object.values(ESelfKnowledgeCategory)) {
    BddTest().and(`the category type is ${category}`, () => {
      BddTest().when('the component is mounted', () => {
        beforeEach(() => {
          wrapper = mountDropdown({
            categoryType: category
          })
        })

        BddTest().then(isCategoryDeletable(category) ? 'the category should be deletable' : 'the category should not be deletable', () => {
          const dropdown = wrapper.findComponent(AvDropdownStub)
          expect(dropdown.exists()).toBe(true)
          expect(dropdown.findAll('button')).toHaveLength(isCategoryDeletable(category) ? 4 : 3)
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

        if (isCategoryDeletable(category)) {
          BddTest().and('the delete category item is selected', () => {
            beforeEach(async () => {
              const dropdown = wrapper.findComponent(AvDropdownStub)
              await dropdown.vm.$emit('itemSelected', 'deleteCategory')
            })

            BddTest().then('it should emit the deleteCategorySelected event', () => {
              expect(wrapper.emitted()).toHaveProperty('deleteCategorySelected')
            })
          })
        }
      })
    })
  }
})
