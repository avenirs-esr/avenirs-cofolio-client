import { CardStub } from '@/common/components/cards/Card/Card.stub'
import HomeWidget, { type HomeWidgetProps } from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const AvIconTextStub = defineComponent({
  name: 'AvIconText',
  template: `<div class="av-icon-text" />`,
  props: ['icon', 'text', 'iconColor', 'textColor', 'typographyClass']
})

BddTest().given('a home widget', () => {
  let wrapper: VueWrapper<InstanceType<typeof HomeWidget>>

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub,
    AvButton: AvButtonStub
  }

  BddTest().when('the component is mounted with displayWidget as true', () => {
    const props: HomeWidgetProps = {
      title: 'Test Widget',
      titleIcon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
      seeAllLabel: 'See All',
      displayWidget: true,
      type: 'main',
      to: '/test-route'
    }

    beforeEach(() => {
      wrapper = mount(HomeWidget, { props, global: { stubs } })
    })

    BddTest().then('it should render the component', () => {
      expect(wrapper.findComponent(CardStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvIconTextStub).props('icon')).toBe(MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE)
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe('Test Widget')
      expect(wrapper.findComponent(AvButtonStub).props('label')).toBe('See All')
    })

    BddTest().then('it should render the seeAllButton with the correct to prop', () => {
      const seeAllButton = wrapper.findComponent(AvButtonStub)
      expect(seeAllButton.props('to')).toBe('/test-route')
    })
  })

  BddTest().when('the component is mounted with displayWidget as false', () => {
    const props: HomeWidgetProps = {
      title: 'Test Widget',
      titleIcon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
      seeAllLabel: 'See All',
      displayWidget: false,
      type: 'main'
    }

    beforeEach(() => {
      wrapper = mount(HomeWidget, { props, global: { stubs } })
    })

    BddTest().then('it should not render the component', () => {
      expect(wrapper.findComponent(CardStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with main type', () => {
    const props: HomeWidgetProps = {
      title: 'Main Widget',
      titleIcon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
      seeAllLabel: 'See All Main',
      displayWidget: true,
      type: 'main'
    }

    beforeEach(() => {
      wrapper = mount(HomeWidget, { props, global: { stubs } })
    })

    BddTest().then('it should have the correct class for main type', () => {
      expect(wrapper.classes()).toContain('home-main-widget')
    })

    BddTest().then('it should render the correct AvIconText', () => {
      const iconText = wrapper.findComponent(AvIconTextStub)
      expect(iconText.props('textColor')).toBe('var(--title)')
      expect(iconText.props('typographyClass')).toBe('n5')
    })
  })

  BddTest().when('the component is mounted with side type', () => {
    const props: HomeWidgetProps = {
      title: 'Side Widget',
      titleIcon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
      seeAllLabel: 'See All Side',
      displayWidget: true,
      type: 'side'
    }

    beforeEach(() => {
      wrapper = mount(HomeWidget, { props, global: { stubs } })
    })

    BddTest().then('it should have the correct class for side type', () => {
      expect(wrapper.classes()).toContain('home-side-widget')
    })

    BddTest().then('it should render the correct AvIconText', () => {
      const iconText = wrapper.findComponent(AvIconTextStub)
      expect(iconText.props('textColor')).toBe('var(--text1)')
      expect(iconText.props('typographyClass')).toBe('s1-bold')
    })
  })
})
