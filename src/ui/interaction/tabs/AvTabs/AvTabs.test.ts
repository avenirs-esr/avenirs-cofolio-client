import AvTabs from '@/ui/interaction/tabs/AvTabs/AvTabs.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a tab switcher ', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvTabs>>

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

  BddTest().and('with multiple tabs', () => {
    beforeEach(() => {
      wrapper = mount(AvTabs, { props, slots, global: { stubs } })
    })

    BddTest().when('the tab switcher is mounted', () => {
      BddTest().then('it should render all tabs', () => {
        const tabs = wrapper.findAll('.fr-tabs__tab')
        expect(tabs.length).toBe(3)
      })
    })

    BddTest().when('selecting the next tab', () => {
      BddTest().then('it should update the active tab', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[0].vm.$emit('next')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(1)
      })
    })

    BddTest().when('selecting the next tab on the last tab', async () => {
      beforeEach(() => {
        wrapper = mount(AvTabs, { props: { modelValue: 2 }, slots, global: { stubs } })
      })

      BddTest().then('it should update the active tab to the first tab', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[2].vm.$emit('next')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(0)
      })
    })

    BddTest().when('selecting the previous tab', () => {
      beforeEach(() => {
        wrapper = mount(AvTabs, { props: { modelValue: 1 }, slots, global: { stubs } })
      })

      BddTest().then('it should update the active tab', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[1].vm.$emit('previous')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(0)
      })
    })

    BddTest().when('selecting the previous tab on the first tab', () => {
      BddTest().then('it should update the active tab to the last tab', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[0].vm.$emit('previous')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(2)
      })
    })

    BddTest().when('selecting the first tab', () => {
      beforeEach(() => {
        wrapper = mount(AvTabs, { props: { modelValue: 1 }, slots, global: { stubs } })
      })

      BddTest().then('it should set the active tab to index 0', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[1].vm.$emit('first')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(0)
      })
    })

    BddTest().when('selecting the last tab', () => {
      BddTest().then('it should set the active tab to the last index', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[0].vm.$emit('last')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(2)
      })
    })

    BddTest().when('clicking on a specific tab', () => {
      BddTest().then('it should set the active tab to the clicked tab', async () => {
        await wrapper.findAllComponents({ name: 'DsfrTabItem' })[2].vm.$emit('click')
        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(2)
      })
    })
  })

  BddTest().and('with no slot provided', () => {
    beforeEach(() => {
      wrapper = mount(AvTabs, { props })
    })

    BddTest().when('the tab switcher is mounted', () => {
      BddTest().then('it should not render any tab', () => {
        const tabs = wrapper.findAll('.fr-tabs__tab')
        expect(tabs.length).toBe(0)
      })
    })
  })

  BddTest().and('with a modelValue change from the parent', () => {
    beforeEach(() => {
      wrapper = mount(AvTabs, { props, slots, global: { stubs } })
    })

    BddTest().when('the parent updates modelValue', () => {
      BddTest().then('it should update the activeTab accordingly', async () => {
        await wrapper.setProps({ modelValue: 1 })
        expect(wrapper.vm.activeTab).toBe(1)
      })
    })
  })
})
