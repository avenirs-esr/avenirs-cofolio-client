import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AvListItem from './AvListItem.vue'

const stubs = {
  AvVIcon: {
    name: 'AvVIcon',
    props: ['name', 'color', 'size'],
    template: '<div class="av-vicon-stub" />'
  }
}

describe('avListItem', () => {
  describe('given an AvListItem component', () => {
    let wrapper: VueWrapper<InstanceType<typeof AvListItem>>

    beforeEach(() => {
      wrapper = mount(AvListItem, {
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render with default props', () => {
        expect(wrapper.find('.av-list-item').exists()).toBe(true)
        expect(wrapper.element.tagName.toLowerCase()).toBe('div')
        expect(wrapper.classes()).not.toContain('av-list-item--clickable')
        expect(wrapper.classes()).not.toContain('av-list-item--disabled')
        expect(wrapper.classes()).not.toContain('av-list-item--selected')
      })

      it('then it should not have tabindex when not clickable', () => {
        expect(wrapper.attributes('tabindex')).toBeUndefined()
      })

      it('then it should not have aria-label when not clickable', () => {
        expect(wrapper.attributes('aria-label')).toBeUndefined()
      })
    })

    describe('when title prop is provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({ title: 'Test Title' })
      })

      it('then it should display the title', () => {
        const titleElement = wrapper.find('.av-list-item__title')
        expect(titleElement.exists()).toBe(true)
        expect(titleElement.text()).toBe('Test Title')
      })
    })

    describe('when description prop is provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({ description: 'Test Description' })
      })

      it('then it should display the description', () => {
        const descriptionElement = wrapper.find('.av-list-item__description')
        expect(descriptionElement.exists()).toBe(true)
        expect(descriptionElement.text()).toBe('Test Description')
      })
    })

    describe('when icon prop is provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({ icon: 'mdi:test-icon' })
      })

      it('then it should render the icon', () => {
        const iconContainer = wrapper.find('.av-list-item__icon')
        const iconComponent = wrapper.findComponent({ name: 'AvVIcon' })

        expect(iconContainer.exists()).toBe(true)
        expect(iconComponent.exists()).toBe(true)
        expect(iconComponent.props('name')).toBe('mdi:test-icon')
      })

      it('then it should pass correct props to icon', () => {
        const iconComponent = wrapper.findComponent({ name: 'AvVIcon' })
        expect(iconComponent.props('color')).toBe('var(--text1)')
        expect(iconComponent.props('size')).toBe(1.3125)
      })
    })

    describe('when clickable prop is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ clickable: true })
      })

      it('then it should apply clickable class', () => {
        expect(wrapper.classes()).toContain('av-list-item--clickable')
      })

      it('then it should use button tag by default', () => {
        expect(wrapper.element.tagName.toLowerCase()).toBe('button')
      })

      it('then it should have tabindex 0', () => {
        expect(wrapper.attributes('tabindex')).toBe('0')
      })

      it('then it should handle click events when clicked', async () => {
        const clickSpy = vi.fn()
        await wrapper.setProps({ onClick: clickSpy })

        await wrapper.trigger('click')
        expect(clickSpy).toHaveBeenCalled()
      })

      it('then it should call onClick prop when clicked', async () => {
        const onClickMock = vi.fn()
        await wrapper.setProps({ onClick: onClickMock })

        await wrapper.trigger('click')
        expect(onClickMock).toHaveBeenCalled()
      })
    })

    describe('when disabled prop is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ disabled: true, clickable: true })
      })

      it('then it should apply disabled class', () => {
        expect(wrapper.classes()).toContain('av-list-item--disabled')
      })

      it('then it should have aria-disabled attribute', () => {
        expect(wrapper.attributes('aria-disabled')).toBe('true')
      })

      it('then it should have disabled attribute when button', () => {
        expect(wrapper.attributes('disabled')).toBe('')
      })

      it('then it should not emit click when clicked', async () => {
        const onClickMock = vi.fn()
        await wrapper.setProps({ onClick: onClickMock })

        await wrapper.trigger('click')
        expect(onClickMock).not.toHaveBeenCalled()
      })
    })

    describe('when selected prop is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ selected: true })
      })

      it('then it should apply selected class', () => {
        expect(wrapper.classes()).toContain('av-list-item--selected')
      })
    })

    describe('when tag prop is set to anchor', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          clickable: true,
          tag: 'a',
          href: 'https://example.com',
          target: '_blank',
          rel: 'noopener'
        })
      })

      it('then it should render as anchor tag', () => {
        expect(wrapper.element.tagName.toLowerCase()).toBe('a')
      })

      it('then it should have href attribute', () => {
        expect(wrapper.attributes('href')).toBe('https://example.com')
      })

      it('then it should have target attribute', () => {
        expect(wrapper.attributes('target')).toBe('_blank')
      })

      it('then it should have rel attribute', () => {
        expect(wrapper.attributes('rel')).toBe('noopener')
      })
    })

    describe('when tag prop is set to div with clickable', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          clickable: true,
          tag: 'div'
        })
      })

      it('then it should render as div tag', () => {
        expect(wrapper.element.tagName.toLowerCase()).toBe('div')
      })

      it('then it should have role button', () => {
        expect(wrapper.attributes('role')).toBe('button')
      })
    })

    describe('when keyboard events are triggered', () => {
      beforeEach(async () => {
        await wrapper.setProps({ clickable: true })
      })

      it('then it should call onClick on Enter key', async () => {
        const onClickMock = vi.fn()
        await wrapper.setProps({ onClick: onClickMock })

        await wrapper.trigger('keydown', { key: 'Enter' })
        expect(onClickMock).toHaveBeenCalled()
      })

      it('then it should call onClick on Space key', async () => {
        const onClickMock = vi.fn()
        await wrapper.setProps({ onClick: onClickMock })

        await wrapper.trigger('keydown', { key: ' ' })
        expect(onClickMock).toHaveBeenCalled()
      })

      it('then it should not call onClick on other keys', async () => {
        const onClickMock = vi.fn()
        await wrapper.setProps({ onClick: onClickMock })

        await wrapper.trigger('keydown', { key: 'Tab' })
        expect(onClickMock).not.toHaveBeenCalled()
      })

      it('then it should not call onClick when disabled', async () => {
        const onClickMock = vi.fn()
        await wrapper.setProps({ onClick: onClickMock, disabled: true })

        await wrapper.trigger('keydown', { key: 'Enter' })
        expect(onClickMock).not.toHaveBeenCalled()
      })
    })

    describe('when aria-label is provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          clickable: true,
          ariaLabel: 'Custom aria label'
        })
      })

      it('then it should use the custom aria-label', () => {
        expect(wrapper.attributes('aria-label')).toBe('Custom aria label')
      })
    })

    describe('when computed aria-label from title and description', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          clickable: true,
          title: 'Test Title',
          description: 'Test Description'
        })
      })

      it('then it should combine title and description for aria-label', () => {
        expect(wrapper.attributes('aria-label')).toBe('Test Title, Test Description')
      })
    })

    describe('when only title is provided for aria-label', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          clickable: true,
          title: 'Test Title'
        })
      })

      it('then it should use title as aria-label', () => {
        expect(wrapper.attributes('aria-label')).toBe('Test Title')
      })
    })

    describe('when ariaDescribedby is provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({ ariaDescribedby: 'description-id' })
      })

      it('then it should have aria-describedby attribute', () => {
        expect(wrapper.attributes('aria-describedby')).toBe('description-id')
      })
    })

    describe('when custom colors are provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          color: '#ff0000',
          descriptionColor: '#00ff00',
          hoverBackgroundColor: '#0000ff',
          colorOnHover: '#ffff00'
        })
      })

      it('then it should accept custom color props', () => {
        expect(wrapper.props('color')).toBe('#ff0000')
        expect(wrapper.props('descriptionColor')).toBe('#00ff00')
        expect(wrapper.props('hoverBackgroundColor')).toBe('#0000ff')
        expect(wrapper.props('colorOnHover')).toBe('#ffff00')
      })
    })

    describe('when slot content is provided', () => {
      beforeEach(() => {
        wrapper = mount(AvListItem, {
          slots: {
            default: '<div class="custom-content">Custom Content</div>'
          },
          global: { stubs }
        })
      })

      it('then it should render the slot content', () => {
        const customContentContainer = wrapper.find('.av-list-item__custom-content')
        const customContent = wrapper.find('.custom-content')

        expect(customContentContainer.exists()).toBe(true)
        expect(customContent.exists()).toBe(true)
        expect(customContent.text()).toBe('Custom Content')
      })
    })

    describe('when iconSize is customized', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          icon: 'mdi:test-icon',
          iconSize: 2.5
        })
      })

      it('then it should pass custom size to icon', () => {
        const iconComponent = wrapper.findComponent({ name: 'AvVIcon' })
        expect(iconComponent.props('size')).toBe(2.5)
      })
    })
  })
})
