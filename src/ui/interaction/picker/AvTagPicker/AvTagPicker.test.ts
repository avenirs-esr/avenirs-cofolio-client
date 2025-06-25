import AvTagPicker from '@/ui/interaction/picker/AvTagPicker/AvTagPicker.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('avButton', () => {
  const stubs = {
    DsfrTag: {
      name: 'DsfrTag',
      props: ['label', 'icon', 'selected', 'disabled'],
      template: `<button @click="$emit('select')"><slot /></button>`
    }
  }

  it('should not render label if not given', () => {
    const props = {
      options: [],
      handleSelectChange: vi.fn()
    }

    const wrapper = mount(AvTagPicker, {
      props
    })
    const label = wrapper.find('.av-select-label')
    expect(label.exists()).toBe(false)
  })

  it('should render given label', () => {
    const props = {
      label: 'Test',
      options: [],
      handleSelectChange: vi.fn()
    }

    const wrapper = mount(AvTagPicker, {
      props
    })
    const label = wrapper.find('.av-select-label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toContain(props.label)
  })

  it('should select an option', async () => {
    const props = {
      options: [4, 8, 12],
      handleSelectChange: vi.fn(),
    }

    const wrapper = mount(AvTagPicker, {
      props,
      global: { stubs }
    })

    const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
    expect(tags).toHaveLength(3)

    await tags[1].trigger('select')
    await wrapper.vm.$nextTick()
    expect(props.handleSelectChange).toHaveBeenCalledWith(props.options[1])
    expect(tags[0].attributes('style')).toContain('/assets/icons/check-circle.svg')
    expect(tags[0].classes()).not.toContain('fr-tag--selected')
    expect(tags[0].classes()).not.toContain('fr-tag--disabled')
    expect(tags[1].attributes('style')).toContain('/assets/icons/check-circle.svg')
    expect(tags[1].classes()).toContain('fr-tag--selected')
    expect(tags[1].classes()).toContain('fr-tag--disabled')
    expect(tags[2].attributes('style')).toContain('/assets/icons/check-circle.svg')
    expect(tags[2].classes()).not.toContain('fr-tag--selected')
    expect(tags[2].classes()).not.toContain('fr-tag--disabled')
  })

  it('should deselect the previous selected option when multiple = false', async () => {
    const props = {
      options: [4, 8, 12],
      handleSelectChange: vi.fn(),
      multiple: false
    }

    const wrapper = mount(AvTagPicker, {
      props,
      global: { stubs }
    })

    const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
    expect(tags).toHaveLength(3)

    await tags[0].trigger('select')
    await wrapper.vm.$nextTick()

    expect(props.handleSelectChange).toHaveBeenLastCalledWith(props.options[0])
    expect(tags[0].classes()).toContain('fr-tag--selected')
    expect(tags[0].classes()).toContain('fr-tag--disabled')
    expect(tags[1].classes()).not.toContain('fr-tag--selected')

    await tags[1].trigger('select')
    await wrapper.vm.$nextTick()

    expect(props.handleSelectChange).toHaveBeenLastCalledWith(props.options[1])
    expect(tags[0].classes()).not.toContain('fr-tag--selected')
    expect(tags[0].classes()).not.toContain('fr-tag--disabled')
    expect(tags[1].classes()).toContain('fr-tag--selected')
    expect(tags[1].classes()).toContain('fr-tag--disabled')
  })

  it('should keep selected the previous selected option when multiple = true', async () => {
    const props = {
      options: [4, 8, 12],
      handleSelectChange: vi.fn(),
      multiple: true
    }

    const wrapper = mount(AvTagPicker, {
      props,
      global: { stubs }
    })

    const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
    expect(tags).toHaveLength(3)

    await tags[0].trigger('select')
    await wrapper.vm.$nextTick()

    expect(props.handleSelectChange).toHaveBeenLastCalledWith([props.options[0]])
    expect(tags[0].classes()).toContain('fr-tag--selected')
    expect(tags[0].classes()).not.toContain('fr-tag--disabled')
    expect(tags[1].classes()).not.toContain('fr-tag--selected')

    await tags[1].trigger('select')
    await wrapper.vm.$nextTick()

    expect(props.handleSelectChange).toHaveBeenLastCalledWith([props.options[0], props.options[1]])
    expect(tags[0].classes()).toContain('fr-tag--selected')
    expect(tags[0].classes()).not.toContain('fr-tag--disabled')
    expect(tags[1].classes()).toContain('fr-tag--selected')
    expect(tags[1].classes()).not.toContain('fr-tag--disabled')
  })

  it('should deselect option when clicking it again when multiple = true', async () => {
    const props = {
      options: [4, 8, 12],
      handleSelectChange: vi.fn(),
      multiple: true
    }

    const wrapper = mount(AvTagPicker, {
      props,
      global: { stubs }
    })

    const tags = wrapper.findAllComponents({ name: 'DsfrTag' })
    expect(tags).toHaveLength(3)

    await tags[0].trigger('select')
    await wrapper.vm.$nextTick()

    expect(props.handleSelectChange).toHaveBeenLastCalledWith([props.options[0]])
    expect(tags[0].classes()).toContain('fr-tag--selected')
    expect(tags[0].classes()).not.toContain('fr-tag--disabled')
    expect(tags[1].classes()).not.toContain('fr-tag--selected')

    await tags[1].trigger('select')
    await wrapper.vm.$nextTick()

    expect(props.handleSelectChange).toHaveBeenLastCalledWith([props.options[0], props.options[1]])
    expect(tags[0].classes()).toContain('fr-tag--selected')
    expect(tags[0].classes()).not.toContain('fr-tag--disabled')
    expect(tags[1].classes()).toContain('fr-tag--selected')
    expect(tags[1].classes()).not.toContain('fr-tag--disabled')

    await tags[1].trigger('select')
    await wrapper.vm.$nextTick()

    expect(props.handleSelectChange).toHaveBeenLastCalledWith([props.options[0]])
    expect(tags[0].classes()).toContain('fr-tag--selected')
    expect(tags[0].classes()).not.toContain('fr-tag--disabled')
    expect(tags[1].classes()).not.toContain('fr-tag--selected')
    expect(tags[1].classes()).not.toContain('fr-tag--disabled')
  })

  it('should handle string selected prop by wrapping it in an array', async () => {
    const props = {
      options: ['4', '8', '12'],
      selected: '4',
      handleSelectChange: vi.fn()
    }

    const wrapper = mount(AvTagPicker, {
      props,
      global: { stubs }
    })

    const tags = wrapper.findAllComponents({ name: 'DsfrTag' })

    expect(tags[0].classes()).toContain('fr-tag--selected')
    expect(tags[1].classes()).not.toContain('fr-tag--selected')
  })
})
