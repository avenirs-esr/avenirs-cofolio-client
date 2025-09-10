import AvNotice from '@/ui/base/AvNotice/AvNotice.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { expect } from 'vitest'

BddTest().given('an AvNotice', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvNotice>>

  const props = {
    title: 'Titre test',
    text: 'Texte sans mise en forme',
    type: 'info'
  } as const

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should display title correctly', () => {
      wrapper = mount(AvNotice, { props })
      expect(wrapper.text()).toContain('Titre test')
    })

    BddTest().and('type is warning', () => {
      BddTest().then('it should manage the type of notice', () => {
        wrapper = mount(AvNotice, { props: { ...props, type: 'warning' } })
        expect(wrapper.find('.fr-notice--warning').exists()).toBe(true)
      })
    })

    BddTest().and('text with underlines is passed', () => {
      BddTest().then('it should format text between __ in span.text-underline', () => {
        wrapper = mount(AvNotice, { props: { ...props, text: 'Voici un texte avec __partie soulignée__ ici.' } })
        const span = wrapper.find('.text-underline')
        expect(span.exists()).toBe(true)
        expect(span.text()).toBe('partie soulignée')
      })
    })

    BddTest().and('there is no __ in the text', () => {
      BddTest().then('it should not create span.text-underline', () => {
        wrapper = mount(AvNotice, { props })
        expect(wrapper.find('.text-underline').exists()).toBe(false)
      })
    })
  })
})
