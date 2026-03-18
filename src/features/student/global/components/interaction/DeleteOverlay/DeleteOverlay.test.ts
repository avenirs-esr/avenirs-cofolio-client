import type { VueWrapper } from '@vue/test-utils'
import DeleteOverlay, {
  type DeleteOverlayProps
} from '@/features/student/global/components/interaction/DeleteOverlay/DeleteOverlay.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a DeleteOverlay component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteOverlay>>

  const stubs = {
    AvButton: AvButtonStub
  }

  BddTest().when('the delete overlay is mounted without button label', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteOverlay, {
        global: { stubs },
        slots: {
          default: '<div class="custom-content">Content to overlay</div>'
        }
      })
    })

    BddTest().then('it should render the slot content', () => {
      expect(wrapper.find('.custom-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Content to overlay')
    })

    BddTest().then('it should render the delete button', () => {
      const button = wrapper.findComponent(AvButtonStub)

      expect(button.exists()).toBe(true)
    })

    BddTest().then('it should render the delete button as icon only', () => {
      const button = wrapper.findComponent(AvButtonStub)

      expect(button.props('iconOnly')).toBe(true)
    })

    BddTest().then('it should use the translated delete label by default', () => {
      const button = wrapper.findComponent(AvButtonStub)

      expect(button.props('label')).toBe('Supprimer')
    })

    BddTest().and('the user clicks on the delete button', () => {
      beforeEach(async () => {
        const button = wrapper.findComponent(AvButtonStub)
        await button.trigger('click')
      })

      BddTest().then('it should emit delete', () => {
        expect(wrapper.emitted('delete')).toEqual([[]])
      })
    })
  })

  BddTest().when('the delete overlay is mounted with a custom button label', () => {
    const props: DeleteOverlayProps = {
      buttonLabel: 'Retirer'
    }

    beforeEach(() => {
      wrapper = mountComponent(DeleteOverlay, {
        props,
        global: { stubs },
        slots: {
          default: '<div class="custom-content">Content to overlay</div>'
        }
      })
    })

    BddTest().then('it should render the custom button label', () => {
      const button = wrapper.findComponent(AvButtonStub)

      expect(button.props('label')).toBe('Retirer')
    })
  })
})
