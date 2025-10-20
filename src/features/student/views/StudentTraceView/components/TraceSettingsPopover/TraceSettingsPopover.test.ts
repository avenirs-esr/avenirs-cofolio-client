import TraceSettingsPopover from '@/features/student/views/StudentTraceView/components/TraceSettingsPopover/TraceSettingsPopover.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a setting popover', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceSettingsPopover>>

  const stubs = {
    AvButton: {
      name: 'AvButton',
      props: ['icon', 'variant', 'size', 'theme', 'label', 'iconScale', 'disabled', 'noRadius', 'onClick'],
      emits: ['click'],
      template: `<button class="av-button" @click="$emit('click')"><slot>{{ label }}</slot></button>`
    },
    AvPopover: {
      name: 'AvPopOver',
      template: `
        <div>
          <slot name="trigger" :toggle="() => {}"></slot>
          <slot name="popover" :close="() => {}"></slot>
        </div>
      `
    },
  }

  beforeEach(() => {
    wrapper = mount(TraceSettingsPopover, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the menu items', () => {
      expect(wrapper.findAll('.menu-item')).toHaveLength(3)
    })
  })

  BddTest().when('the delete button is clicked', () => {
    BddTest().then('it should emit the deleteSelected event', async () => {
      const button = wrapper.findAll('.menu-item')[0]
      await button.trigger('click')
      expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the assign button is clicked', () => {
    BddTest().then('it should emit the assignSelected event', async () => {
      const button = wrapper.findAll('.menu-item')[1]
      await button.trigger('click')
      expect(wrapper.emitted('associateSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the updateSelected event', async () => {
      const button = wrapper.findAll('.menu-item')[2]
      await button.trigger('click')
      expect(wrapper.emitted('updateSelected')).toHaveLength(1)
    })
  })
})
