import Drawer, { type DrawerProps } from '@/common/components/Drawer/Drawer.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvCancelConfirmButtonsStub, AvDrawerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a Drawer component', () => {
  let wrapper: VueWrapper<InstanceType<typeof Drawer>>

  const stubs = {
    AvDrawer: AvDrawerStub,
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub
  }

  const mountWith = (props: Partial<DrawerProps> = {}, slots: Record<string, string> = {}) => {
    wrapper = mount(Drawer, {
      props: {
        show: true,
        ...props
      },
      slots: {
        default: '<div data-testid="drawer-content">content</div>',
        ...slots
      },
      global: { stubs }
    })
  }

  const getAvDrawer = () => wrapper.findComponent(AvDrawerStub)
  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)

  BddTest().when('the component is mounted with default props', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should pass show to AvDrawer', () => {
      expect(getAvDrawer().props('show')).toBe(true)
    })

    BddTest().then('it should use right position by default', () => {
      expect(getAvDrawer().props('position')).toBe('right')
    })

    BddTest().then('it should use 40rem width by default', () => {
      expect(getAvDrawer().props('width')).toBe('40rem')
    })

    BddTest().then('it should render the default slot', () => {
      expect(wrapper.find('[data-testid="drawer-content"]').exists()).toBe(true)
    })

    BddTest().then('it should render the default footer', () => {
      expect(getCancelConfirmButtons().exists()).toBe(true)
    })

    BddTest().then('it should set default cancel label', () => {
      expect(getCancelConfirmButtons().props('cancelLabel')).toBe('Annuler')
    })

    BddTest().then('it should set default cancel icon', () => {
      expect(getCancelConfirmButtons().props('cancelIcon')).toBe(MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
    })

    BddTest().then('it should not set a confirm label', () => {
      expect(getCancelConfirmButtons().props('confirmLabel')).toBeUndefined()
    })
  })

  BddTest().when('custom position and width are provided', () => {
    beforeEach(() => {
      mountWith({ position: 'left', width: '50rem' })
    })

    BddTest().then('it should pass the custom position to AvDrawer', () => {
      expect(getAvDrawer().props('position')).toBe('left')
    })

    BddTest().then('it should pass the custom width to AvDrawer', () => {
      expect(getAvDrawer().props('width')).toBe('50rem')
    })
  })

  BddTest().when('a confirm label is provided', () => {
    beforeEach(() => {
      mountWith({ confirmLabel: 'Valider' })
    })

    BddTest().then('it should pass the confirm label to the footer buttons', () => {
      expect(getCancelConfirmButtons().props('confirmLabel')).toBe('Valider')
    })

    BddTest().then('it should set default confirm icon', () => {
      expect(getCancelConfirmButtons().props('confirmIcon')).toBe(MDI_ICONS.CONTENT_SAVE_OUTLINE)
    })
  })

  BddTest().when('confirm cancel props are provided', () => {
    beforeEach(() => {
      mountWith({
        confirmLabel: 'Valider',
        confirmCancelProps: {
          cancelLabel: 'Quitter',
          confirmLabel: 'Enregistrer',
          cancelIcon: MDI_ICONS.ARROW_LEFT_THIN
        }
      })
    })

    BddTest().then('it should override the default cancel label', () => {
      expect(getCancelConfirmButtons().props('cancelLabel')).toBe('Quitter')
    })

    BddTest().then('it should override the default cancel icon', () => {
      expect(getCancelConfirmButtons().props('cancelIcon')).toBe(MDI_ICONS.ARROW_LEFT_THIN)
    })

    BddTest().then('it should give priority to the confirm label of confirm cancel props', () => {
      expect(getCancelConfirmButtons().props('confirmLabel')).toBe('Enregistrer')
    })
  })

  BddTest().when('a footer slot is provided', () => {
    beforeEach(() => {
      mountWith({}, { footer: '<div data-testid="custom-footer">footer</div>' })
    })

    BddTest().then('it should render the custom footer', () => {
      expect(wrapper.find('[data-testid="custom-footer"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the default footer', () => {
      expect(getCancelConfirmButtons().exists()).toBe(false)
    })
  })

  BddTest().when('escape is pressed', () => {
    beforeEach(async () => {
      mountWith()
      await getAvDrawer().vm.$emit('escape-pressed')
    })

    BddTest().then('it should emit close', () => {
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  BddTest().when('a click occurs outside the drawer', () => {
    BddTest().and('close on click outside is disabled', () => {
      beforeEach(async () => {
        mountWith()
        await getAvDrawer().vm.$emit('click-outside')
      })

      BddTest().then('it should not emit close', () => {
        expect(wrapper.emitted('close')).toBeUndefined()
      })
    })

    BddTest().and('close on click outside is enabled', () => {
      beforeEach(async () => {
        mountWith({ closeOnClickOutside: true })
        await getAvDrawer().vm.$emit('click-outside')
      })

      BddTest().then('it should emit close', () => {
        expect(wrapper.emitted('close')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the cancel button is clicked', () => {
    beforeEach(async () => {
      mountWith()
      await getCancelConfirmButtons().vm.$emit('cancel')
    })

    BddTest().then('it should emit close', () => {
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  BddTest().when('the confirm button is clicked', () => {
    beforeEach(async () => {
      mountWith({ confirmLabel: 'Valider' })
      await getCancelConfirmButtons().vm.$emit('confirm')
    })

    BddTest().then('it should emit confirm', () => {
      expect(wrapper.emitted('confirm')).toHaveLength(1)
    })
  })
})
