import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import FloatingPanel, { type FloatingPanelProps } from '@/common/components/overlay/FloatingPanel/FloatingPanel.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvFloatingPanelStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const COLLAPSE_LABEL = 'Réduire'
const EXPAND_LABEL = 'Développer'

const defaultProps: FloatingPanelProps = {
  title: 'Floating panel',
}

BddTest().given('a FloatingPanel', () => {
  let wrapper: VueWrapper<InstanceType<typeof FloatingPanel>>

  const stubs = {
    AvFloatingPanel: AvFloatingPanelStub,
  }

  const mountWith = (
    props: Partial<FloatingPanelProps> = {},
    attrs?: ComponentMountingOptions<typeof FloatingPanel>['attrs'],
    slots?: ComponentMountingOptions<typeof FloatingPanel>['slots']
  ) => {
    wrapper = mountComponent(FloatingPanel, {
      props: {
        ...defaultProps,
        ...props,
      },
      attrs,
      slots,
      global: {
        stubs,
        mocks: { MDI_ICONS }
      },
    })
  }

  const getPanel = () => wrapper.findComponent(AvFloatingPanelStub)

  BddTest().when('it is mounted with default props', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the floating panel with the correct props', () => {
      const panel = getPanel()
      expect(panel.exists()).toBe(true)
      expect(panel.props('title')).toBe(defaultProps.title)
      expect(panel.props('width')).toBe('35rem')
      expect(panel.props('defaultCollapsed')).toBe(true)
      expect(panel.props('collapseLabel')).toBe(COLLAPSE_LABEL)
      expect(panel.props('expandLabel')).toBe(EXPAND_LABEL)
    })

    BddTest().then('it should be collapsed by default', () => {
      expect(getPanel().attributes('data-collapsed')).toBe('true')
    })
  })

  BddTest().when('it is mounted with a custom width', () => {
    const props: Partial<FloatingPanelProps> = {
      width: '42rem',
    }

    beforeEach(() => {
      mountWith(props)
    })

    BddTest().then('it should forward the provided width', () => {
      expect(getPanel().props()).toMatchObject(props)
    })
  })

  BddTest().when('it is mounted with a subtitle and an icon', () => {
    const props: Partial<FloatingPanelProps> = {
      subtitle: 'Panel subtitle',
      icon: 'panel-icon',
    }

    beforeEach(() => {
      mountWith(props)
    })

    BddTest().then('it should forward the subtitle and icon', () => {
      expect(getPanel().props()).toMatchObject(props)
    })
  })

  BddTest().when('it is mounted with defaultCollapsed set to false', () => {
    const props: Partial<FloatingPanelProps> = {
      defaultCollapsed: false,
    }

    beforeEach(() => {
      mountWith(props)
    })

    BddTest().then('it should render the panel expanded', () => {
      const panel = getPanel()
      expect(panel.props()).toMatchObject(props)
      expect(panel.attributes('data-collapsed')).toBe('false')
    })
  })

  BddTest().when('togglePanel is called', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should toggle the floating panel collapsed state', async () => {
      const panel = getPanel()

      expect(panel.attributes('data-collapsed')).toBe('true')

      wrapper.vm.togglePanel()
      await wrapper.vm.$nextTick()

      expect(panel.attributes('data-collapsed')).toBe('false')

      wrapper.vm.togglePanel()
      await wrapper.vm.$nextTick()

      expect(panel.attributes('data-collapsed')).toBe('true')
    })
  })

  BddTest().when('content is provided in the default slot', () => {
    beforeEach(() => {
      mountWith({}, {}, {
        default: '<div data-testid="panel-content">Panel content</div>',
      })
    })

    BddTest().then('it should render the slot content', () => {
      expect(wrapper.get('[data-testid="panel-content"]').text()).toBe('Panel content')
    })
  })

  BddTest().when('additional attrs are provided', () => {
    beforeEach(() => {
      mountWith({}, {
        'data-testid': 'floating-panel',
      })
    })

    BddTest().then('it should forward the attrs to the floating panel', () => {
      expect(getPanel().attributes('data-testid')).toBe('floating-panel')
    })
  })
})
