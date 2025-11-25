import { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import { SelfKnowledgeElementCompactCardStub } from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeElementCompactCard/SelfKnowledgeElementCompactCard.stub'
import SelfKnowledgeElementsSelector, { type SelfKnowledgeElementsSelectorProps } from '@/features/student/selfKnowledge/components/pickers/SelfKnowledgeElementsSelector/SelfKnowledgeElementsSelector.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a self knowledge element selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementsSelector>>

  const stubs = {
    SelfKnowledgeElementCompactCard: SelfKnowledgeElementCompactCardStub,
    AvIcon: AvIconStub
  }

  BddTest().and('no elements are given', () => {
    const props: SelfKnowledgeElementsSelectorProps = {
      elements: [],
      categoryType: ESelfKnowledgeCategoryType.STRENGTHS
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(SelfKnowledgeElementsSelector, { props, global: { stubs } })
      })

      BddTest().then('it should render no elements', () => {
        const cards = wrapper.findAllComponents(SelfKnowledgeElementCompactCardStub)
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
          description: 'Description 1'
        }
      ],
      categoryType: ESelfKnowledgeCategoryType.STRENGTHS
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(SelfKnowledgeElementsSelector, { props, global: { stubs } })
      })

      BddTest().then('it should render the element', () => {
        const card = wrapper.findComponent(SelfKnowledgeElementCompactCardStub)
        expect(card.exists()).toBe(true)
        expect(card.props('title')).toEqual(props.elements[0].title)
      })

      BddTest().and('the element is clicked', () => {
        beforeEach(async () => {
          await wrapper.find('div[role="button"]').trigger('click')
        })

        BddTest().then('it should update the model with the element id', () => {
          expect(wrapper.emitted('update:modelValue')).toBeTruthy()
          expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([props.elements[0].id])
        })

        BddTest().and('the element is clicked again', () => {
          beforeEach(async () => {
            await wrapper.find('div[role="button"]').trigger('click')
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
          description: 'Description 1'
        },
        {
          id: '2',
          title: 'Element 2',
          description: 'Description 2'
        }
      ],
      categoryType: ESelfKnowledgeCategoryType.STRENGTHS
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(SelfKnowledgeElementsSelector, { props, global: { stubs } })
      })

      BddTest().then('it should render the elements', () => {
        const cards = wrapper.findAllComponents(SelfKnowledgeElementCompactCardStub)
        expect(cards).toHaveLength(2)
        expect(cards[0].props('title')).toEqual(props.elements[0].title)
        expect(cards[1].props('title')).toEqual(props.elements[1].title)
      })
    })
  })

  BddTest().and('readonly is given', () => {
    const props: SelfKnowledgeElementsSelectorProps = {
      elements: [
        {
          id: '1',
          title: 'Element 1',
          description: 'Description 1'
        }
      ],
      categoryType: ESelfKnowledgeCategoryType.STRENGTHS,
      readonly: true
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(SelfKnowledgeElementsSelector, { props, global: { stubs } })
      })

      BddTest().then('it should not render the overlay', () => {
        expect(wrapper.find('div[role="button"]').exists()).toBe(false)
      })
    })
  })
})
