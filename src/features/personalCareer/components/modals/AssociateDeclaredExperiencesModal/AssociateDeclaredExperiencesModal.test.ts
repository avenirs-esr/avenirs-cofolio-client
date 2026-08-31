import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import { EExperienceType } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { SearchAssociationLayoutStub } from '@/features/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.stub'
import { ConfirmAssociateModalStub } from '@/features/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.stub'
import { DeclaredExperienceCompactCardStub } from '@/features/personalCareer/components/cards/DeclaredExperienceCompactCard/DeclaredExperienceCompactCard.stub'
import AssociateDeclaredExperiencesModal, {
  type AssociateDeclaredExperiencesModalProps,
  type AssociationDeclaredExperiences
} from '@/features/personalCareer/components/modals/AssociateDeclaredExperiencesModal/AssociateDeclaredExperiencesModal.vue'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associate declared experiences modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateDeclaredExperiencesModal>>

  const stubs = {
    AvModal: AvModalStub,
    SearchAssociationLayout: SearchAssociationLayoutStub,
    ConfirmAssociateModal: ConfirmAssociateModalStub,
    DeclaredExperienceCompactCard: DeclaredExperienceCompactCardStub,
    ConfirmationModal: ConfirmationModalStub
  }

  const experiences = [
    {
      id: 'experience-search-1',
      title: 'Définir ses valeurs',
      experienceType: EExperienceType.PERSONAL,
      disabled: false
    },
    {
      id: 'experience-search-2',
      title: 'Explorer ses pistes d\'orientation',
      experienceType: EExperienceType.PROFESSIONAL,
      disabled: false
    },
    {
      id: 'experience-search-3',
      title: 'Développeur Web Full Stack',
      experienceType: EExperienceType.PROFESSIONAL,
      disabled: true
    }

  ]

  const props: AssociateDeclaredExperiencesModalProps = {
    show: true,
    experiences,
    isLoading: false
  }

  const selectedDeclaredExperiencesOptions: AvAutocompleteOption[] = [
    {
      label: 'Définir ses valeurs',
      value: 'experience-search-1'
    },
    {
      label: 'Explorer ses pistes d\'orientation',
      value: 'experience-search-2'
    }
  ]

  const expectedSelectedAssociations: AssociationDeclaredExperiences[] = [
    {
      id: 'experience-search-1',
      title: 'Définir ses valeurs',
      experienceType: EExperienceType.PERSONAL,
      disabled: false
    },
    {
      id: 'experience-search-2',
      title: 'Explorer ses pistes d\'orientation',
      experienceType: EExperienceType.PROFESSIONAL,
      disabled: false
    }
  ]

  BddTest().when('the modal is rendered', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateDeclaredExperiencesModal, {
        props,
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should render the modal with correct opened prop', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(true)
    })

    BddTest().then('it should display the correct title', () => {
      const header = wrapper.find('[data-testid="header"]')
      expect(header.exists()).toBe(true)
      expect(header.text()).toContain('Quelle(s) expérience(s) souhaitez-vous associer ?')
    })

    BddTest().then('it should render the search association layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.exists()).toBe(true)
    })

    BddTest().then('it should render the confirm associate modal hidden by default', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
      expect(confirmModal.exists()).toBe(true)
      expect(confirmModal.props('show')).toBe(false)
      expect(confirmModal.props('items')).toEqual([])
    })

    BddTest().then('it should render the cancel confirmation modal hidden by default', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(false)
    })

    BddTest().then('it should pass all declared experiences to the layout options with disabled fields', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.props('options')).toEqual([
        {
          label: 'Définir ses valeurs',
          value: 'experience-search-1',
          description: 'Expérience personnelle',
          disabled: false
        },
        {
          label: 'Explorer ses pistes d\'orientation',
          value: 'experience-search-2',
          description: 'Expérience professionnelle',
          disabled: false
        },
        {
          label: 'Développeur Web Full Stack',
          value: 'experience-search-3',
          description: 'Expérience professionnelle',
          disabled: true
        },
      ])
    })

    BddTest().then('it should pass the correct initial props to the search association layout', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.props('modelValue')).toEqual([])
      expect(layout.props('items')).toEqual([])
      expect(layout.props('inputOptions')).toEqual({
        placeholder: 'Entrer le nom d\'une expérience déclarée',
      })
      expect(layout.props('getOptionKey')).toBeTypeOf('function')
      expect(layout.props('getOptionLabel')).toBeTypeOf('function')
    })

    BddTest().then('it should pass isLoading to the modal', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.props('isLoading')).toBe(false)
    })

    BddTest().and('the user searches in the search association layout', () => {
      beforeEach(async () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        layout.vm.$emit('update:search', 'valeurs')
        await flushPromises()
      })

      BddTest().then('it should emit search', () => {
        expect(wrapper.emitted('search')).toEqual([['valeurs']])
      })
    })

    BddTest().and('the user selects declared experiences in the search association layout', () => {
      beforeEach(async () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        layout.vm.$emit('update:modelValue', selectedDeclaredExperiencesOptions)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the selected items passed to the layout', () => {
        const layout = wrapper.findComponent(SearchAssociationLayoutStub)
        expect(layout.props('items')).toEqual(expectedSelectedAssociations)
      })

      BddTest().then('it should update the confirm associate modal items', () => {
        const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
        expect(confirmModal.props('items')).toEqual(expectedSelectedAssociations)
      })

      BddTest().then('it should enable the confirm button', () => {
        const modal = wrapper.findComponent(AvModalStub)
        expect(modal.props('confirmButtonDisabled')).toBe(false)
      })

      BddTest().and('the search association layout emits delete event', () => {
        beforeEach(async () => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          layout.vm.$emit('delete', 'experience-search-2')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should remove the deleted experience from the selected items', () => {
          const layout = wrapper.findComponent(SearchAssociationLayoutStub)
          expect(layout.props('items')).toEqual([
            {
              id: 'experience-search-1',
              title: 'Définir ses valeurs',
              experienceType: EExperienceType.PERSONAL,
              disabled: false
            }
          ])
        })

        BddTest().then('it should update the confirm modal items', () => {
          const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
          expect(confirmModal.props('items')).toEqual([
            {
              id: 'experience-search-1',
              title: 'Définir ses valeurs',
              experienceType: EExperienceType.PERSONAL,
              disabled: false
            }
          ])
        })
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

        BddTest().and('the confirm modal emits cancel event', () => {
          beforeEach(async () => {
            const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
            confirmModal.vm.$emit('cancel')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the confirm modal', () => {
            const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
            expect(confirmModal.props('show')).toBe(false)
          })

          BddTest().then('it should not emit associate', () => {
            expect(wrapper.emitted('associate')).toBeFalsy()
          })
        })

        BddTest().and('the confirm modal emits confirm event', () => {
          beforeEach(async () => {
            const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
            confirmModal.vm.$emit('confirm')
            await flushPromises()
          })

          BddTest().then('it should emit associate with selected ids', () => {
            expect(wrapper.emitted('associate')).toEqual([[
              ['experience-search-1', 'experience-search-2']
            ]])
          })
        })
      })

      BddTest().and('the modal emits close event', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent(AvModalStub)
          modal.vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should show the cancel confirmation modal', () => {
          const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

          expect(confirmationModal.props('show')).toBe(true)
        })

        BddTest().then('it should not emit cancel immediately', () => {
          expect(wrapper.emitted('cancel')).toBeFalsy()
        })

        BddTest().and('the confirmation modal emits close event', () => {
          beforeEach(async () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
            confirmationModal.vm.$emit('close')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the cancel confirmation modal', () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

            expect(confirmationModal.props('show')).toBe(false)
          })

          BddTest().then('it should not emit cancel', () => {
            expect(wrapper.emitted('cancel')).toBeFalsy()
          })
        })

        BddTest().and('the confirmation modal emits confirm event', () => {
          beforeEach(async () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
            confirmationModal.vm.$emit('confirm')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should hide the cancel confirmation modal', () => {
            const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

            expect(confirmationModal.props('show')).toBe(false)
          })

          BddTest().then('it should emit cancel', () => {
            expect(wrapper.emitted('cancel')).toBeTruthy()
          })
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

  BddTest().when('the modal is rendered with no selected experience', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateDeclaredExperiencesModal, {
        props,
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should disable the confirm button', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.props('confirmButtonDisabled')).toBe(true)
    })

    BddTest().then('it should pass an empty items array to the confirm modal', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
      expect(confirmModal.props('items')).toEqual([])
    })
  })

  BddTest().when('the show prop becomes false', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateDeclaredExperiencesModal, {
        props,
        global: { stubs }
      })
      await flushPromises()

      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      layout.vm.$emit('update:modelValue', selectedDeclaredExperiencesOptions)
      await wrapper.vm.$nextTick()

      const modal = wrapper.findComponent(AvModalStub)
      modal.vm.$emit('confirm')
      await wrapper.vm.$nextTick()

      await wrapper.setProps({ show: false })
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should reset selected items', () => {
      const layout = wrapper.findComponent(SearchAssociationLayoutStub)
      expect(layout.props('items')).toEqual([])
      expect(layout.props('modelValue')).toEqual([])
    })

    BddTest().then('it should hide the confirm modal', () => {
      const confirmModal = wrapper.findComponent(ConfirmAssociateModalStub)
      expect(confirmModal.props('show')).toBe(false)
    })
  })

  BddTest().when('the modal is rendered with isLoading true', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateDeclaredExperiencesModal, {
        props: {
          ...props,
          isLoading: true
        },
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should pass loading state to modal', () => {
      const modal = wrapper.findComponent(AvModalStub)
      expect(modal.props('isLoading')).toBe(true)
    })
  })
})
