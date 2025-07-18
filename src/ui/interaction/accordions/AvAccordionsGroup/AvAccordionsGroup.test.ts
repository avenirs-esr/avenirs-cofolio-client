import AvAccordionsGroup from '@/ui/interaction/accordions/AvAccordionsGroup/AvAccordionsGroup.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

describe('avAccordionsGroup', () => {
  const accordionSlots = [
    '<AvAccordion title="Accordion 1" icon="icon-1">Content 1</AvAccordion>',
    '<AvAccordion title="Accordion 2" icon="icon-2">Content 2</AvAccordion>',
    '<AvAccordion title="Accordion 3" icon="icon-3">Content 3</AvAccordion>',
  ]

  const slots = { default: accordionSlots.join('') }

  const stubs = {
    AvAccordion: {
      name: 'AvAccordion',
      props: ['title', 'icon'],
      template: '<div><slot /></div>',
    },
  }

  describe('given multiple accordions inside the group', () => {
    let wrapper: ReturnType<typeof mount<typeof AvAccordionsGroup>>

    beforeEach(() => {
      wrapper = mount(AvAccordionsGroup, {
        slots,
        global: { stubs },
      })
    })

    describe('when the accordions group is mounted', () => {
      it('then it should render all accordions', () => {
        const accordions = wrapper.findAll('.fr-accordion')
        expect(accordions.length).toBe(3)
      })

      it('then it should render icons and titles for each accordion', () => {
        const icons = wrapper.findAllComponents({ name: 'AvVIcon' })
        const titles = wrapper.findAll('h6')

        expect(icons.length).toBe(3)
        expect(titles[0].text()).toBe('Accordion 1')
        expect(titles[1].text()).toBe('Accordion 2')
        expect(titles[2].text()).toBe('Accordion 3')
      })
    })

    describe('when clicking on an accordion', () => {
      it('then it should update the active accordion', async () => {
        const buttons = wrapper.findAll('.fr-accordion__btn')
        expect(buttons.length).toBeGreaterThan(0)
      })

      it('then it should update the v-model value', async () => {
        const accordions = wrapper.findAll('.fr-accordion__btn')
        await accordions[1].trigger('click')
        expect(wrapper.vm.activeAccordion).toBe(1)
      })
    })
  })
})
