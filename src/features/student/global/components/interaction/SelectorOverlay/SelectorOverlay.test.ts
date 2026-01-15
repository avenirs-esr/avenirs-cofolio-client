import SelectorOverlay from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a SelectorOverlay component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelectorOverlay>>

  BddTest().when('the selector overlay is mounted with selectable elements', () => {
    beforeEach(() => {
      wrapper = mount(SelectorOverlay, {
        props: {
          selectableElements: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ],
        },
        slots: {
          default: '<div class="custom-element">{{ label }}</div>',
        },
      })
    })

    BddTest().then('it should render the selectable elements', () => {
      const elements = wrapper.findAll('.selector-overlay__element')
      expect(elements).toHaveLength(3)
      expect(elements[0].text()).toBe('Option 1')
      expect(elements[1].text()).toBe('Option 2')
      expect(elements[2].text()).toBe('Option 3')
    })

    BddTest().and('the user selects an element', () => {
      beforeEach(async () => {
        const elements = wrapper.findAll('.selector-overlay__checkbox')
        await elements[1].trigger('click')
      })

      BddTest().then('the selected element should be updated', () => {
        expect(wrapper.emitted('update:selectedElements')).toBeTruthy()
        const emittedValues = wrapper.emitted('update:selectedElements') as unknown[][]
        expect(emittedValues[0][0]).toEqual(['option2'])
      })

      BddTest().and('the user selects another element by pressing space', () => {
        beforeEach(async () => {
          const elements = wrapper.findAll('.selector-overlay__checkbox')
          await elements[0].trigger('keydown.space')
        })

        BddTest().then('the selected elements should be updated accordingly', () => {
          const emittedValues = wrapper.emitted('update:selectedElements') as unknown[][]
          expect(emittedValues[1][0]).toEqual(['option2', 'option1'])
        })

        BddTest().and('the user deselects an element by pressing enter', () => {
          beforeEach(async () => {
            const elements = wrapper.findAll('.selector-overlay__checkbox')
            await elements[1].trigger('keydown.enter')
          })

          BddTest().then('the selected elements should reflect the deselection', () => {
            const emittedValues = wrapper.emitted('update:selectedElements') as unknown[][]
            expect(emittedValues[2][0]).toEqual(['option1'])
          })
        })
      })
    })
  })
})
