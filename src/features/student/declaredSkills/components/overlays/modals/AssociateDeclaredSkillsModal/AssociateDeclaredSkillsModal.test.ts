import type { VueWrapper } from '@vue/test-utils'
import { mockedSkillSearchResults } from '@/__mocks__/fixtures/student/traces.fixtures'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import AssociateDeclaredSkillsModal, {
  type AssociateDeclaredSkillsModalProps
} from '@/features/student/declaredSkills/components/overlays/modals/AssociateDeclaredSkillsModal/AssociateDeclaredSkillsModal.vue'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { SearchAssociationLayoutStub } from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.stub'
import { ConfirmAssociateModalStub } from '@/features/student/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.stub'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an associate declared skills modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateDeclaredSkillsModal>>

  const stubs = {
    AvModal: AvModalStub,
    SearchAssociationLayout: SearchAssociationLayoutStub,
    ConfirmAssociateModal: ConfirmAssociateModalStub,
    FloatingIconCard: FloatingIconCardStub,
    ConfirmationModal: ConfirmationModalStub
  }

  const skills = mockedSkillSearchResults

  const props: AssociateDeclaredSkillsModalProps = {
    show: true,
    skills,
  }

  const selectedOptions = skills.slice(0, 2).map(s => ({ label: s.title, value: s.id, type: s.type }))

  const expectedSelectedAssociations = selectedOptions.map(o => ({ id: String(o.value), title: o.label, type: o.type }))

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is rendered', () => {
    let modal: VueWrapper<InstanceType<typeof AvModalStub>>
    let layout: VueWrapper<InstanceType<typeof SearchAssociationLayoutStub>>
    let confirmModal: VueWrapper<InstanceType<typeof ConfirmAssociateModalStub>>

    beforeEach(() => {
      wrapper = mountComponent(AssociateDeclaredSkillsModal, {
        props,
        global: { stubs },
      })
      modal = wrapper.findComponent(AvModalStub) as VueWrapper<InstanceType<typeof AvModalStub>>
      layout = wrapper.findComponent(SearchAssociationLayoutStub) as VueWrapper<InstanceType<typeof SearchAssociationLayoutStub>>
      confirmModal = wrapper.findComponent(ConfirmAssociateModalStub) as VueWrapper<InstanceType<typeof ConfirmAssociateModalStub>>
    })

    BddTest().then('it should render the modal as opened', () => {
      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(true)
    })

    BddTest().then('it should display the correct title', () => {
      const header = wrapper.find('[data-testid="header"]')
      expect(header.exists()).toBe(true)
      expect(header.text()).toContain('Quelle(s) compétence(s) déclarée(s) souhaitez-vous associer ?')
    })

    BddTest().then('it should render the search association layout', () => {
      expect(layout.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct input options to the layout', () => {
      expect(layout.props('inputOptions')).toEqual({
        placeholder: 'Entrer le nom d\'une compétence déclarée',
      })
    })

    BddTest().then('it should pass empty items to the layout initially', () => {
      expect(layout.props('items')).toEqual([])
    })

    BddTest().then('it should pass empty modelValue to the layout initially', () => {
      expect(layout.props('modelValue')).toEqual([])
    })

    BddTest().then('it should render the confirm modal hidden by default', () => {
      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
      expect(confirmModal.props('items')).toEqual([])
    })

    BddTest().then('it should render the cancel confirmation modal hidden by default', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(false)
    })

    BddTest().and('the user selects skills in the layout', () => {
      beforeEach(async () => {
        layout.vm.$emit('update:modelValue', selectedOptions)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update items passed to the layout', () => {
        expect(layout.props('items')).toEqual(expectedSelectedAssociations)
      })

      BddTest().then('it should update items passed to the confirm modal', () => {
        expect(confirmModal.props('items')).toEqual(expectedSelectedAssociations)
      })

      BddTest().and('the layout emits a delete event', () => {
        beforeEach(async () => {
          layout.vm.$emit('delete', skills[1].id)
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should remove the deleted skill from items', () => {
          expect(layout.props('items')).toEqual([expectedSelectedAssociations[0]])
        })

        BddTest().then('it should update the confirm modal items', () => {
          expect(confirmModal.props('items')).toEqual([expectedSelectedAssociations[0]])
        })
      })

      BddTest().and('the modal emits confirm event', () => {
        beforeEach(async () => {
          modal.vm.$emit('confirm')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should show the confirm modal', () => {
          expect(confirmModal.props('show')).toBe(true)
        })

        BddTest().and('the confirm modal emits cancel event', () => {
          beforeEach(async () => {
            confirmModal.vm.$emit('cancel')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the confirm modal', () => {
            expect(confirmModal.props('show')).toBe(false)
          })

          BddTest().then('it should not emit associate event', () => {
            expect(wrapper.emitted('associate')).toBeFalsy()
          })
        })

        BddTest().and('the confirm modal emits confirm event', () => {
          beforeEach(async () => {
            confirmModal.vm.$emit('confirm')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should emit associate event with selected ids', () => {
            expect(wrapper.emitted('associate')).toBeTruthy()
            expect(wrapper.emitted('associate')?.[0]).toEqual([[skills[0].id, skills[1].id]])
          })
        })
      })

      BddTest().and('the modal emits close event', () => {
        beforeEach(async () => {
          modal.vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should show the cancel confirmation modal', () => {
          const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

          expect(confirmationModal.props('show')).toBe(true)
        })

        BddTest().then('it should not emit cancel event immediately', () => {
          expect(wrapper.emitted('cancel')).toBeFalsy()
        })

        BddTest().and('the cancel confirmation modal emits close event', () => {
          beforeEach(async () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
            confirmationModal.vm.$emit('close')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the cancel confirmation modal', () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

            expect(confirmationModal.props('show')).toBe(false)
          })

          BddTest().then('it should not emit cancel event', () => {
            expect(wrapper.emitted('cancel')).toBeFalsy()
          })
        })

        BddTest().and('the cancel confirmation modal emits confirm event', () => {
          beforeEach(async () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
            confirmationModal.vm.$emit('confirm')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the cancel confirmation modal', () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

            expect(confirmationModal.props('show')).toBe(false)
          })

          BddTest().then('it should emit cancel event', () => {
            expect(wrapper.emitted('cancel')).toBeTruthy()
          })
        })
      })
    })

    BddTest().and('the layout emits update:search event', () => {
      beforeEach(async () => {
        layout.vm.$emit('update:search', 'gestion')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should emit search event with the query', () => {
        expect(wrapper.emitted('search')).toBeTruthy()
        expect(wrapper.emitted('search')?.[0]).toEqual(['gestion'])
      })
    })

    BddTest().and('the modal emits close event', () => {
      beforeEach(async () => {
        modal.vm.$emit('close')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should emit cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })
  })

  BddTest().when('the show prop is false', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociateDeclaredSkillsModal, {
        props: { ...props, show: false },
        global: { stubs },
      })
    })

    BddTest().then('it should pass opened as false to the modal', () => {
      const modal = wrapper.findComponent(AvModalStub) as VueWrapper<InstanceType<typeof AvModalStub>>
      expect(modal.props('opened')).toBe(false)
    })
  })

  BddTest().when('the show prop changes from true to false', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateDeclaredSkillsModal, {
        props,
        global: { stubs },
      })

      const layout = wrapper.findComponent(SearchAssociationLayoutStub) as VueWrapper<InstanceType<typeof SearchAssociationLayoutStub>>
      layout.vm.$emit('update:modelValue', selectedOptions)
      await wrapper.vm.$nextTick()

      const modal = wrapper.findComponent(AvModalStub) as VueWrapper<InstanceType<typeof AvModalStub>>
      modal.vm.$emit('confirm')
      await wrapper.vm.$nextTick()

      await wrapper.setProps({ show: false })
      await flushPromises()
    })

    BddTest().then('it should hide the confirm modal', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub) as VueWrapper<InstanceType<typeof ConfirmAssociateModalStub>>
      expect(confirmModal.props('show')).toBe(false)
    })

    BddTest().then('it should clear the selected skills', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub) as VueWrapper<InstanceType<typeof SearchAssociationLayoutStub>>
      expect(layout.props('modelValue')).toEqual([])
    })
  })

  BddTest().when('the modal is rendered with isLoading true', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociateDeclaredSkillsModal, {
        props: { ...props, isLoading: true },
        global: { stubs },
      })
    })

    BddTest().then('it should render the search association layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub) as VueWrapper<InstanceType<typeof SearchAssociationLayoutStub>>
      expect(layout.exists()).toBe(true)
    })
  })

  BddTest().when('the modal is rendered with isLoading true during mutation', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociateDeclaredSkillsModal, {
        props: { ...props, isLoading: true },
        global: { stubs },
      })
    })

    BddTest().and('a skill is selected', () => {
      beforeEach(async () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub) as VueWrapper<InstanceType<typeof SearchAssociationLayoutStub>>
        layout.vm.$emit('update:modelValue', [selectedOptions[0]])
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should not emit associate when confirm modal confirms', async () => {
        const modal = wrapper.findComponent(AvModalStub) as VueWrapper<InstanceType<typeof AvModalStub>>
        modal.vm.$emit('confirm')
        await wrapper.vm.$nextTick()
        const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub) as VueWrapper<InstanceType<typeof ConfirmAssociateModalStub>>
        expect(confirmModal.props('show')).toBe(true)
      })
    })
  })
})
