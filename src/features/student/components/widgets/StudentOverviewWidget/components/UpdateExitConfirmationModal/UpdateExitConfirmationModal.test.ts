import UpdateExitConfirmationModal from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateExitConfirmationModal/UpdateExitConfirmationModal.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, type Mock, vi } from 'vitest'
import { nextTick } from 'vue'

BddTest().given('an update exit confirmation modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateExitConfirmationModal>>

  const stubs = {
    AvButton: {
      name: 'AvButton',
      props: ['label', 'onClick'],
      template: `<button class="av-button" @click="onClick" />`
    },
    AvModal: {
      name: 'AvModal',
      props: ['opened'],
      template: `
        <div class="av-modal">
          <slot />
          <slot name="footer"></slot>
        </div>
      `
    }
  }

  BddTest().and('the modal is visible', () => {
    let onCancel: Mock
    let onConfirm: Mock

    beforeEach(() => {
      onCancel = vi.fn()
      onConfirm = vi.fn()

      wrapper = mount(UpdateExitConfirmationModal, {
        props: {
          showModal: true,
          isLoading: false,
          onCancel,
          onConfirm,
        },
        global: { stubs }
      })
    })

    BddTest().when('rendering the modal', () => {
      BddTest().then('it should show the title, subtitle and buttons with translations', () => {
        expect(wrapper.text()).toContain('Êtes-vous sûr de vouloir quitter ?')
        expect(wrapper.text()).toContain('Toutes les modifications non enregistrées seront perdues.')

        const avButton = wrapper.findComponent({ name: 'AvButton' })
        expect(avButton.exists()).toBe(true)
        expect(avButton.props('label')).toBe('Confirmer')

        const avModal = wrapper.findComponent({ name: 'AvModal' })
        expect(avModal.exists()).toBe(true)
        expect(avModal.props('opened')).toBe(true)
      })
    })

    BddTest().when('clicking confirm button', () => {
      BddTest().then('it should emit onConfirm', async () => {
        const button = wrapper.find('button')
        await button.trigger('click')

        expect(onConfirm).toHaveBeenCalled()
      })
    })

    BddTest().when('clicking close button', () => {
      BddTest().then('it should call onCancel', async () => {
        await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
        await nextTick()

        expect(onCancel).toHaveBeenCalled()
      })
    })
  })

  BddTest().and('the modal is hidden', () => {
    beforeEach(() => {
      wrapper = mount(UpdateExitConfirmationModal, {
        props: {
          showModal: false,
          isLoading: false,
          onCancel: vi.fn(),
          onConfirm: vi.fn(),
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not display the modal', () => {
      const modal = wrapper.findComponent({ name: 'AvModal' })
      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
    })
  })
})
