import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import SelfKnowledgeElementsDropdown, { type SelfKnowledgeElementsDropdownProps } from '@/features/student/selfKnowledge/components/dropdowns/SelfKnowledgeElementsDropdown/SelfKnowledgeElementsDropdown.vue'
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

  const getAvDropdown = () => wrapper.findComponent(AvDropdownStub)

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
          const dropdown = getAvDropdown()
          expect(dropdown.exists()).toBe(true)
          expect(dropdown.findAll('button')).toHaveLength(isCategoryDeletable(category) ? 3 : 2)
        })

        BddTest().and('the add item is selected', () => {
          beforeEach(async () => {
            await getAvDropdown().vm.$emit('itemSelected', 'add')
          })

          BddTest().then('it should emit the add event', () => {
            expect(wrapper.emitted()).toHaveProperty('add')
          })
        })

        BddTest().and('the delete item is selected', () => {
          beforeEach(async () => {
            await getAvDropdown().vm.$emit('itemSelected', 'delete')
          })

          BddTest().then('it should emit the delete event', () => {
            expect(wrapper.emitted()).toHaveProperty('delete')
          })
        })

        if (isCategoryDeletable(category)) {
          BddTest().and('the delete category item is selected', () => {
            beforeEach(async () => {
              await getAvDropdown().vm.$emit('itemSelected', 'deleteCategory')
            })

            BddTest().then('it should emit the deleteCategory event', () => {
              expect(wrapper.emitted()).toHaveProperty('deleteCategory')
            })
          })
        }
      })
    })
  }
})
