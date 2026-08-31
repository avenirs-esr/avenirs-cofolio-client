import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { CompactCardSelectorStub } from '@/features/global/components/cards/CompactCardSelector/CompactCardSelector.stub'
import SelfKnowledgeElementsSelector, { type SelfKnowledgeElementsSelectorProps } from '@/features/selfKnowledge/components/pickers/SelfKnowledgeElementsSelector/SelfKnowledgeElementsSelector.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a self knowledge element selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementsSelector>>

  const stubs = {
    AvIcon: AvIconStub,
    CompactCardSelector: CompactCardSelectorStub
  }

  BddTest().and('no elements are given', () => {
    const props: SelfKnowledgeElementsSelectorProps = {
      elements: [],
      categoryType: ESelfKnowledgeCategory.STRENGTHS
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(SelfKnowledgeElementsSelector, { props, global: { stubs } })
      })

      BddTest().then('it should render no elements', () => {
        const cards = wrapper.findAll('[data-testid="compact-card-selector"]')
        expect(cards).toHaveLength(0)
      })
    })
  })

  BddTest().and('one element is given', () => {
    const props: SelfKnowledgeElementsSelectorProps = {
      elements: [
        {
          id: '1',
          title: 'Element 1',
          description: 'Description 1',
          category: { type: ESelfKnowledgeCategory.STRENGTHS, mandatory: true }
        }
      ],
      categoryType: ESelfKnowledgeCategory.STRENGTHS
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(SelfKnowledgeElementsSelector, { props, global: { stubs } })
      })

      BddTest().then('it should render the element', () => {
        const card = wrapper.find('[data-testid="compact-card-selector"]')
        expect(card.exists()).toBe(true)
        expect(card.text()).toContain(props.elements[0].title)
      })

      BddTest().and('the element is clicked', () => {
        beforeEach(async () => {
          await wrapper.find('a[role="button"]').trigger('click')
        })

        BddTest().then('it should update the model with the element id', () => {
          expect(wrapper.emitted('update:modelValue')).toBeTruthy()
          expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([props.elements[0].id])
        })

        BddTest().and('the element is clicked again', () => {
          beforeEach(async () => {
            await wrapper.find('a[role="button"]').trigger('click')
          })

          BddTest().then('it should update the model to remove the element id', () => {
            expect(wrapper.emitted('update:modelValue')?.[1][0]).toEqual([])
          })
        })
      })
    })
  })

  BddTest().and('many elements are given', () => {
    const props: SelfKnowledgeElementsSelectorProps = {
      elements: [
        {
          id: '1',
          title: 'Element 1',
          description: 'Description 1',
          category: { type: ESelfKnowledgeCategory.STRENGTHS, mandatory: true }
        },
        {
          id: '2',
          title: 'Element 2',
          description: 'Description 2',
          category: { type: ESelfKnowledgeCategory.STRENGTHS, mandatory: true }
        }
      ],
      categoryType: ESelfKnowledgeCategory.STRENGTHS
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(SelfKnowledgeElementsSelector, { props, global: { stubs } })
      })

      BddTest().then('it should render the elements', () => {
        const cards = wrapper.findAll('[data-testid="compact-card-selector"]')
        expect(cards).toHaveLength(2)
        expect(cards[0].text()).toContain(props.elements[0].title)
        expect(cards[1].text()).toContain(props.elements[1].title)
      })
    })
  })

  BddTest().and('readonly is given', () => {
    const props: SelfKnowledgeElementsSelectorProps = {
      elements: [
        {
          id: '1',
          title: 'Element 1',
          description: 'Description 1',
          category: { type: ESelfKnowledgeCategory.STRENGTHS, mandatory: true }
        }
      ],
      categoryType: ESelfKnowledgeCategory.STRENGTHS,
      readonly: true
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(SelfKnowledgeElementsSelector, { props, global: { stubs } })
      })

      BddTest().then('it should not render the overlay', () => {
        expect(wrapper.find('a[role="button"]').exists()).toBe(false)
      })
    })
  })
})
