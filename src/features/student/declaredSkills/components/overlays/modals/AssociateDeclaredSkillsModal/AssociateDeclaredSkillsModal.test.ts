import type { VueWrapper } from '@vue/test-utils'
import { EExternalSkillType } from '@/api/avenir-esr'
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
  }

  const skills = [
    { id: 'skill-1', title: 'Gestion de projet agile', type: EExternalSkillType.ROME4, disabled: false },
    { id: 'skill-2', title: 'Communication interpersonnelle', type: EExternalSkillType.XXI, disabled: false },
    { id: 'skill-3', title: 'Analyse de données', type: EExternalSkillType.ROME4, disabled: true },
  ]

  const props: AssociateDeclaredSkillsModalProps = {
    show: true,
    skills,
  }

  const selectedOptions = [
    { label: 'Gestion de projet agile', value: 'skill-1', type: EExternalSkillType.ROME4 },
    { label: 'Communication interpersonnelle', value: 'skill-2', type: EExternalSkillType.XXI },
  ]

  const expectedSelectedAssociations = [
    { id: 'skill-1', title: 'Gestion de projet agile', type: EExternalSkillType.ROME4 },
    { id: 'skill-2', title: 'Communication interpersonnelle', type: EExternalSkillType.XXI },
  ]

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

    BddTest().then('it should pass only enabled skills as options to the layout', () => {
      const options = layout.props('options')
      expect(options).toHaveLength(2)
      expect(options).toEqual([
        { label: 'Gestion de projet agile', value: 'skill-1', type: EExternalSkillType.ROME4 },
        { label: 'Communication interpersonnelle', value: 'skill-2', type: EExternalSkillType.XXI },
      ])
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
          layout.vm.$emit('delete', 'skill-2')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should remove the deleted skill from items', () => {
          expect(layout.props('items')).toEqual([
            { id: 'skill-1', title: 'Gestion de projet agile', type: EExternalSkillType.ROME4 },
          ])
        })

        BddTest().then('it should update the confirm modal items', () => {
          expect(confirmModal.props('items')).toEqual([
            { id: 'skill-1', title: 'Gestion de projet agile', type: EExternalSkillType.ROME4 },
          ])
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
            expect(wrapper.emitted('associate')?.[0]).toEqual([['skill-1', 'skill-2']])
          })
        })
      })
    })

    BddTest().and('the layout emits search event', () => {
      beforeEach(async () => {
        layout.vm.$emit('search', 'gestion')
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

  BddTest().when('the modal is rendered with one disabled skill', () => {
    const [firstSkill, ...rest] = skills
    const skillsWithOneDisabled = [{ ...firstSkill, disabled: true }, ...rest]

    beforeEach(() => {
      wrapper = mountComponent(AssociateDeclaredSkillsModal, {
        props: { ...props, skills: skillsWithOneDisabled },
        global: { stubs },
      })
    })

    BddTest().then('it should exclude disabled skills from the layout options', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub) as VueWrapper<InstanceType<typeof SearchAssociationLayoutStub>>
      const options = layout.props('options')
      expect(options).toHaveLength(1)
      expect(options.every((o: { value: string }) => o.value !== 'skill-1')).toBe(true)
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

  BddTest().when('the modal is rendered with isPending true', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociateDeclaredSkillsModal, {
        props: { ...props, isPending: true },
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
