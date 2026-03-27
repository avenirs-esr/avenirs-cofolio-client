import type { VueWrapper } from '@vue/test-utils'
import {
  ConfirmAssociateModalStub
} from '@/features/student/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.stub'
import AssociateDeclaredSkillsModal, {
  type AssociateDeclaredSkillsModalProps
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredSkillsModal/AssociateDeclaredSkillsModal.vue'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associate declared skills modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateDeclaredSkillsModal>>

  const stubs = {
    AvModal: AvModalStub,
    ConfirmAssociateModal: ConfirmAssociateModalStub
  }

  const props: AssociateDeclaredSkillsModalProps = {
    show: true
  }

  BddTest().when('the modal is rendered', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociateDeclaredSkillsModal, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the modal with correct props', () => {
      const modal = wrapper.findComponent(AvModalStub)

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(true)
    })

    BddTest().then('it should display the correct title', () => {
      const header = wrapper.find('[data-testid="header"]')

      expect(header.exists()).toBe(true)
      expect(header.text()).toContain('Quelle(s) compétence(s) déclarée(s) souhaitez-vous associer ?')
    })

    BddTest().then('it should render the confirm associate modal hidden by default', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)

      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
      expect(confirmModal.props('items')).toEqual([])
    })

    BddTest().and('the modal emits confirm event', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('confirm')

        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should show the confirm associate modal', () => {
        const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)

        expect(confirmModal.props('show')).toBe(true)
      })

      BddTest().and('the confirm associate modal emits cancel event', () => {
        beforeEach(async () => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
          confirmModal.vm.$emit('cancel')

          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should hide the confirm associate modal', () => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)

          expect(confirmModal.props('show')).toBe(false)
        })

        BddTest().then('it should not emit associated event', () => {
          expect(wrapper.emitted('associated')).toBeFalsy()
        })
      })

      BddTest().and('the confirm associate modal emits confirm event', () => {
        beforeEach(async () => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
          confirmModal.vm.$emit('confirm')

          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should emit associated event', () => {
          expect(wrapper.emitted('associated')).toBeTruthy()
        })
      })
    })

    BddTest().and('the modal emits close event', () => {
      beforeEach(() => {
        const modal = wrapper.findComponent(AvModalStub)
        modal.vm.$emit('close')
      })

      BddTest().then('it should emit cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })
  })
})
