import type { VueWrapper } from '@vue/test-utils'
import { findAvButtonByTestId, getAvButtonByTestId } from '#shared/test-utils/unit/index'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'

enableAutoUnmount(afterEach)

const Buttons = defineComponent({
  setup () {
    return () => h('section', [
      h('span', { 'data-testid': 'save' }, 'Not a button'),
      h(AvButtonStub, { 'label': 'Cancel', 'data-testid': 'cancel' }),
      h(AvButtonStub, { 'label': 'First save', 'data-testid': 'save' }),
      h(AvButtonStub, { 'label': 'Second save', 'data-testid': 'save' }),
      h(AvButtonStub, { label: 'Without test id' }),
    ])
  },
})

BddTest().given('multiple actual DSAV button stubs with inherited test ids', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(Buttons)
  })

  BddTest().when('an existing button is found by its inherited test id', () => {
    let found: ReturnType<typeof findAvButtonByTestId>
    let required: ReturnType<typeof getAvButtonByTestId>

    beforeEach(() => {
      found = findAvButtonByTestId(wrapper, 'cancel')
      required = getAvButtonByTestId(wrapper, 'cancel')
    })

    BddTest().then('both helpers return the matching component wrapper among the buttons', () => {
      expect(found?.props('label')).toBe('Cancel')
      expect(found?.vm.$attrs['data-testid']).toBe('cancel')
      expect(required.vm).toBe(found?.vm)
      expect(required.vm.$options.name).toBe(AvButtonStub.name)
    })
  })

  BddTest().when('multiple buttons share the requested test id', () => {
    let found: ReturnType<typeof findAvButtonByTestId>
    let required: ReturnType<typeof getAvButtonByTestId>

    beforeEach(() => {
      found = findAvButtonByTestId(wrapper, 'save')
      required = getAvButtonByTestId(wrapper, 'save')
    })

    BddTest().then('both helpers return the first matching button rather than another element or later match', () => {
      expect(found?.props('label')).toBe('First save')
      expect(required.props('label')).toBe('First save')
      expect(required.vm).toBe(found?.vm)
      expect(required.vm.$attrs['data-testid']).toBe('save')
    })
  })

  BddTest().when('no button has the requested test id', () => {
    let found: ReturnType<typeof findAvButtonByTestId>
    const getMissing = vi.fn(() => getAvButtonByTestId(wrapper, 'missing-button'))

    beforeEach(() => {
      getMissing.mockClear()
      found = findAvButtonByTestId(wrapper, 'missing-button')
      try {
        getMissing()
      }
      catch {}
    })

    BddTest().then('the optional helper returns undefined and the required helper throws the exact error', () => {
      expect(found).toBeUndefined()
      expect(getMissing).toHaveBeenCalledOnce()
      expect(getMissing.mock.results[0].type).toBe('throw')
      expect(getMissing.mock.results[0].value).toBeInstanceOf(Error)
      expect(getMissing.mock.results[0].value.message).toBe('Button with test id missing-button not found')
    })
  })

  BddTest().when('only the stub default DOM test id matches the request', () => {
    let found: ReturnType<typeof findAvButtonByTestId>

    beforeEach(() => {
      found = findAvButtonByTestId(wrapper, 'av-button-stub')
    })

    BddTest().then('it does not match a DOM-only test id absent from the component inherited attributes', () => {
      expect(wrapper.find('[data-testid="av-button-stub"]').exists()).toBe(true)
      expect(found).toBeUndefined()
    })
  })
})
