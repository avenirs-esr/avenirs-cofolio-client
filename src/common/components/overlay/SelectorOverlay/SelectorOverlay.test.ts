import SelectorOverlay from '@/common/components/overlay/SelectorOverlay/SelectorOverlay.vue'
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

    BddTest().then('it should render selectable anchors', () => {
      const anchors = wrapper.findAll('a[role="button"]')

      expect(anchors).toHaveLength(3)
      expect(anchors[0].attributes('aria-disabled')).toBeUndefined()
      expect(anchors[1].attributes('aria-disabled')).toBeUndefined()
      expect(anchors[2].attributes('aria-disabled')).toBeUndefined()
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
          await wrapper.setProps({
            selectedElements: ['option2']
          })

          const elements = wrapper.findAll('.selector-overlay__checkbox')
          await elements[0].trigger('keydown.space')
        })

        BddTest().then('the selected elements should be updated accordingly', () => {
          const emittedValues = wrapper.emitted('update:selectedElements') as unknown[][]

          expect(emittedValues[1][0]).toEqual(['option2', 'option1'])
        })

        BddTest().and('the user deselects an element by pressing enter', () => {
          beforeEach(async () => {
            await wrapper.setProps({
              selectedElements: ['option2', 'option1']
            })

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

  BddTest().when('the selector overlay is mounted with disabled elements', () => {
    beforeEach(() => {
      wrapper = mount(SelectorOverlay, {
        props: {
          selectableElements: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2', disabled: true },
          ],
        },
        slots: {
          default: '<div class="custom-element">{{ label }}</div>',
        },
      })
    })

    BddTest().then('it should render disabled element with disabled class', () => {
      const elements = wrapper.findAll('.selector-overlay__element')

      expect(elements[0].classes()).not.toContain('selector-overlay__element--disabled')
      expect(elements[1].classes()).toContain('selector-overlay__element--disabled')
    })

    BddTest().then('it should render disabled anchor with aria-disabled true', () => {
      const anchors = wrapper.findAll('a[role="button"]')

      expect(anchors[0].attributes('aria-disabled')).toBeUndefined()
      expect(anchors[1].attributes('aria-disabled')).toBe('true')
    })

    BddTest().then('clicking disabled element should not emit update:selectedElements', async () => {
      const anchors = wrapper.findAll('a[role="button"]')

      await anchors[1].trigger('click')

      expect(wrapper.emitted('update:selectedElements')).toBeUndefined()
    })

    BddTest().then('pressing enter on disabled element should not emit update:selectedElements', async () => {
      const anchors = wrapper.findAll('a[role="button"]')

      await anchors[1].trigger('keydown.enter')

      expect(wrapper.emitted('update:selectedElements')).toBeUndefined()
    })

    BddTest().then('pressing space on disabled element should not emit update:selectedElements', async () => {
      const anchors = wrapper.findAll('a[role="button"]')

      await anchors[1].trigger('keydown.space')

      expect(wrapper.emitted('update:selectedElements')).toBeUndefined()
    })
  })

  BddTest().when('the selector overlay is mounted in readonly mode', () => {
    beforeEach(() => {
      wrapper = mount(SelectorOverlay, {
        props: {
          selectableElements: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
          ],
          selectedElements: ['option1'],
          readonly: true,
        },
        slots: {
          default: '<div class="custom-element">{{ label }}</div>',
        },
      })
    })

    BddTest().then('it should render the elements', () => {
      const elements = wrapper.findAll('.selector-overlay__element')

      expect(elements).toHaveLength(2)
      expect(elements[0].text()).toBe('Option 1')
      expect(elements[1].text()).toBe('Option 2')
    })

    BddTest().then('it should not render selectable anchors', () => {
      const anchors = wrapper.findAll('a[role="button"]')

      expect(anchors).toHaveLength(0)
    })
  })
})
