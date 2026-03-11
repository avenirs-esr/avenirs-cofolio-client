import type { VueWrapper } from '@vue/test-utils'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import FinishDeclaredActivity from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/FinishDeclaredActivity/FinishDeclaredActivity.vue'
import { FinishDeclaredActivityConfirmModalStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/FinishDeclaredActivityConfirmModal/FinishDeclaredActivityConfirmModal.stub'
import { AvBadgeStub, AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a FinishDeclaredActivity component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FinishDeclaredActivity>>
  const stubs = {
    AvButton: AvButtonStub,
    AvBadge: AvBadgeStub,
    FinishDeclaredActivityConfirmModal: FinishDeclaredActivityConfirmModalStub,
  }

  BddTest().when('the component is mounted without completed status', () => {
    beforeEach(() => {
      wrapper = mountComponent(FinishDeclaredActivity, {
        props: {
          status: EDeclaredActivityStatus.IN_PROGRESS,
        },
        global: {
          stubs,
        },
      })
    })

    BddTest().then('it should render the finish declared activity block', () => {
      expect(wrapper.find('[data-testid="finish-declared-activity"]').exists()).toBe(true)
    })

    BddTest().then('it should render the finish button with correct props', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(true)
      expect(button.props('label')).toBe('Terminer l\'activité')
      expect(button.props('variant')).toBe('FLAT')
      expect(button.props('icon')).toBeDefined()
    })

    BddTest().then('it should not render the completed badge', () => {
      expect(wrapper.find('[data-testid="av-badge-stub"]').exists()).toBe(false)
    })

    BddTest().then('it should render the confirmation modal closed by default', () => {
      const confirmModal = wrapper.findComponent(FinishDeclaredActivityConfirmModalStub)
      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
    })

    BddTest().and('the user clicks on the finish button', () => {
      beforeEach(async () => {
        const button = wrapper.findComponent(AvButtonStub)
        button.vm.$emit('click')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should open the confirmation modal', () => {
        const confirmModal = wrapper.findComponent(FinishDeclaredActivityConfirmModalStub)
        expect(confirmModal.props('show')).toBe(true)
      })
    })

    BddTest().and('the user closes the confirmation modal', () => {
      beforeEach(async () => {
        const button = wrapper.findComponent(AvButtonStub)
        button.vm.$emit('click')
        await wrapper.vm.$nextTick()

        const confirmModal = wrapper.findComponent(FinishDeclaredActivityConfirmModalStub)
        confirmModal.vm.$emit('close')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should close the confirmation modal', () => {
        const confirmModal = wrapper.findComponent(FinishDeclaredActivityConfirmModalStub)
        expect(confirmModal.props('show')).toBe(false)
      })
    })

    BddTest().and('the user confirms the finish action', () => {
      beforeEach(async () => {
        const button = wrapper.findComponent(AvButtonStub)
        button.vm.$emit('click')
        await wrapper.vm.$nextTick()

        const confirmModal = wrapper.findComponent(FinishDeclaredActivityConfirmModalStub)
        confirmModal.vm.$emit('confirm')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should close the confirmation modal', () => {
        const confirmModal = wrapper.findComponent(FinishDeclaredActivityConfirmModalStub)
        expect(confirmModal.props('show')).toBe(false)
      })

      BddTest().then('it should emit the finished event', () => {
        expect(wrapper.emitted('finished')).toBeTruthy()
      })
    })
  })

  BddTest().when('the component is mounted with completed status', () => {
    beforeEach(() => {
      wrapper = mountComponent(FinishDeclaredActivity, {
        props: {
          status: EDeclaredActivityStatus.COMPLETED,
          finishedAt: '2026-03-11T09:36:56.918632Z',
        },
        global: {
          stubs,
        },
      })
    })

    BddTest().then('it should render the finish declared activity block', () => {
      expect(wrapper.find('[data-testid="finish-declared-activity"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the finish button', () => {
      expect(wrapper.findComponent(AvButtonStub).exists()).toBe(false)
    })

    BddTest().then('it should render the completed badge with correct props', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Terminée')
      expect(badge.props('icon')).toBeDefined()
    })

    BddTest().then('it should render the finished date formatted in french format', () => {
      expect(wrapper.text()).toContain('Terminée le 11/03/2026')
    })

    BddTest().then('it should render the confirmation modal closed by default', () => {
      const confirmModal = wrapper.findComponent(FinishDeclaredActivityConfirmModalStub)
      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
    })
  })

  BddTest().when('the component is mounted with completed status and without finishedAt', () => {
    beforeEach(() => {
      wrapper = mountComponent(FinishDeclaredActivity, {
        props: {
          status: EDeclaredActivityStatus.COMPLETED,
        },
        global: {
          stubs,
        },
      })
    })

    BddTest().then('it should render the completed badge', () => {
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(true)
    })

    BddTest().then('it should not render the finished date text', () => {
      expect(wrapper.text()).not.toContain('Terminée le')
      expect(wrapper.find('[data-testid="finish-declared-activity-date"]').exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted without status', () => {
    beforeEach(() => {
      wrapper = mountComponent(FinishDeclaredActivity, {
        global: {
          stubs,
        },
      })
    })

    BddTest().then('it should render the finish declared activity block', () => {
      expect(wrapper.find('[data-testid="finish-declared-activity"]').exists()).toBe(true)
    })

    BddTest().then('it should render the finish button', () => {
      expect(wrapper.findComponent(AvButtonStub).exists()).toBe(true)
    })

    BddTest().then('it should not render the completed badge', () => {
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(false)
    })

    BddTest().then('it should render the confirmation modal closed by default', () => {
      const confirmModal = wrapper.findComponent(FinishDeclaredActivityConfirmModalStub)
      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
    })
  })
})
