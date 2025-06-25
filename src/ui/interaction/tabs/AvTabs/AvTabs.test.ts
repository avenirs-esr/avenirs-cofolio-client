import AvTabs from '@/ui/interaction/tabs/AvTabs/AvTabs.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

describe('avTabs', () => {
  const tabSlots = [
    '<AvTab title="Tab 1" icon="icon-1">Content 1</AvTab>',
    '<AvTab title="Tab 2" icon="icon-2">Content 2</AvTab>',
    '<AvTab title="Tab 3" icon="icon-3">Content 3</AvTab>',
  ]

  const props = { modelValue: 0 }
  const slots = { default: tabSlots.join('') }
  const stubs = {
    AvTab: {
      name: 'AvTab',
      template: '<div />'
    }
  }

  describe('given a tab switcher with multiple tabs', () => {
    let wrapper: ReturnType<typeof mount<typeof AvTabs>>

    beforeEach(() => {
      wrapper = mount(AvTabs, { props, slots, global: { stubs } })
    })

    describe('when the tab switcher is mounted', () => {
      it('then it should render all tabs', () => {
        const tabs = wrapper.findAll('.fr-tabs__tab')
        expect(tabs.length).toBe(3)
      })
    })

    describe('when selecting the next tab', () => {
      it('then it should update the active tab', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[0].vm.$emit('next')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(1)
      })
    })

    describe('when selecting the next tab on the last tab', async () => {
      beforeEach(() => {
        wrapper = mount(AvTabs, { props: { modelValue: 2 }, slots, global: { stubs } })
      })

      it('then it should update the active tab to the first tab', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[2].vm.$emit('next')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(0)
      })
    })

    describe('when selecting the previous tab', () => {
      beforeEach(() => {
        wrapper = mount(AvTabs, { props: { modelValue: 1 }, slots, global: { stubs } })
      })

      it('then it should update the active tab', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[1].vm.$emit('previous')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(0)
      })
    })

    describe('when selecting the previous tab on the first tab', () => {
      it('then it should update the active tab to the last tab', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[0].vm.$emit('previous')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(2)
      })
    })

    describe('when selecting the first tab', () => {
      beforeEach(() => {
        wrapper = mount(AvTabs, { props: { modelValue: 1 }, slots, global: { stubs } })
      })

      it('then it should set the active tab to index 0', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[1].vm.$emit('first')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(0)
      })
    })

    describe('when selecting the last tab', () => {
      it('then it should set the active tab to the last index', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[0].vm.$emit('last')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(2)
      })
    })

    describe('when clicking on a specific tab', () => {
      it('then it should set the active tab to the clicked tab', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[2].vm.$emit('click')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(2)
      })
    })
  })

  describe('given no slot provided', () => {
    let wrapper: ReturnType<typeof mount<typeof AvTabs>>

    beforeEach(() => {
      wrapper = mount(AvTabs, { props })
    })

    describe('when the tab switcher is mounted', () => {
      it('then it should not render any tab', () => {
        const tabs = wrapper.findAll('.fr-tabs__tab')
        expect(tabs.length).toBe(0)
      })
    })
  })

  describe('given a modelValue change from the parent', () => {
    let wrapper: ReturnType<typeof mount<typeof AvTabs>>

    beforeEach(() => {
      wrapper = mount(AvTabs, { props, slots, global: { stubs } })
    })

    describe('when the parent updates modelValue', () => {
      it('then it should update the activeTab accordingly', async () => {
        await wrapper.setProps({ modelValue: 1 })
        expect(wrapper.vm.activeTab).toBe(1)
      })
    })
  })
})
