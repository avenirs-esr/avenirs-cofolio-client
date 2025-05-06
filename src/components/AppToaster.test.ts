import AppToaster from '@/components/AppToaster.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

const messages = [
  { id: '1', title: 'Title 1', description: 'Desc 1', severity: 'info' },
  { id: '2', title: 'Title 2', description: 'Desc 2', severity: 'error' },
]

describe('toaster.vue', () => {
  it('renders all messages as DsfrAlert components', () => {
    const wrapper = mount(AppToaster, {
      props: {
        messages,
      },
      global: {
        stubs: {
          DsfrAlert: {
            template: '<div class="dsfr-alert" @click="$emit(\'close\')">{{ title }}</div>',
            props: ['title'],
          },
        },
      },
    })

    const alerts = wrapper.findAll('.dsfr-alert')
    expect(alerts).toHaveLength(messages.length)
  })

  it('emits closeMessage with correct id when DsfrAlert emits close', async () => {
    const wrapper = mount(AppToaster, {
      props: {
        messages,
      },
      global: {
        stubs: {
          DsfrAlert: {
            template: `<div class="dsfr-alert" @click="$emit('close')">{{ title }}</div>`,
            props: ['title'],
          },
        },
      },
    })

    const alerts = wrapper.findAll('.dsfr-alert')

    await alerts[0].trigger('click')
    expect(wrapper.emitted('closeMessage')).toBeTruthy()
    expect(wrapper.emitted('closeMessage')![0]).toEqual(['1'])
  })
})
