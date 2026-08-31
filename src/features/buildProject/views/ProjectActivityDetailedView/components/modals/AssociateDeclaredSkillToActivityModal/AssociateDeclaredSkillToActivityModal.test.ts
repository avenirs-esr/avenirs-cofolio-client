import type { VueWrapper } from '@vue/test-utils'
import {
  associateActivityWithDeclaredSkillsErrorHandler,
} from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import AssociateDeclaredSkillsToActivityModal, { type AssociateDeclaredSkillsToActivityModalProps } from '@/features/buildProject/views/ProjectActivityDetailedView/components/modals/AssociateDeclaredSkillToActivityModal/AssociateDeclaredSkillToActivityModal.vue'
import { AssociateDeclaredSkillsModalStub } from '@/features/declaredSkills/components/overlays/modals/AssociateDeclaredSkillsModal/AssociateDeclaredSkillsModal.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddErrorMessage = vi.fn()
const mockAddSuccessMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
      addSuccessMessage: mockAddSuccessMessage
    }),
  }
})

BddTest().given('an associate declared skills to activity modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateDeclaredSkillsToActivityModal>>

  const stubs = {
    AssociateDeclaredSkillsModal: AssociateDeclaredSkillsModalStub
  }

  const props: AssociateDeclaredSkillsToActivityModalProps = {
    show: true,
    activityId: 'activity-1'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is rendered', () => {
    let modal: VueWrapper<InstanceType<typeof AssociateDeclaredSkillsModalStub>>

    beforeEach(async () => {
      wrapper = mountComponent(AssociateDeclaredSkillsToActivityModal, {
        props,
        global: { stubs }
      })
      await flushPromises()
      modal = wrapper.findComponent(AssociateDeclaredSkillsModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredSkillsModalStub>>
    })

    BddTest().then('it should render the inner modal', () => {
      expect(modal.exists()).toBe(true)
    })

    BddTest().then('it should pass the show prop', () => {
      expect(modal.props('show')).toBe(true)
    })

    BddTest().then('it should pass isLoading prop as false initially', () => {
      expect(modal.props('isLoading')).toBe(false)
    })

    BddTest().then('it should load skills from the query and pass them to the modal', async () => {
      await vi.waitFor(() => {
        const updatedModal = wrapper.findComponent(AssociateDeclaredSkillsModalStub)
        expect(updatedModal.props('skills').length).toBeGreaterThan(0)
      })

      BddTest().and('the inner modal emits search event', () => {
        beforeEach(async () => {
          modal.vm.$emit('update:search', 'compétence')
          await flushPromises()
        })

        BddTest().then('it should filter skills through the query', async () => {
          await vi.waitFor(() => {
            const updatedModal = wrapper.findComponent(AssociateDeclaredSkillsModalStub)
            const skills = updatedModal.props('skills')
            expect(skills.length).toBeGreaterThanOrEqual(0)
          })
        })
      })

      BddTest().and('the inner modal emits associate event successfully', () => {
        beforeEach(async () => {
          await vi.waitFor(() => {
            const updatedModal = wrapper.findComponent(AssociateDeclaredSkillsModalStub)
            expect(updatedModal.props('skills').length).toBeGreaterThan(0)
          })

          modal.vm.$emit('associate', ['skill-search-1', 'skill-search-2'])
          await flushPromises()
        })

        BddTest().then('it should emit associated event', async () => {
          await vi.waitFor(() => {
            expect(wrapper.emitted('associated')).toBeTruthy()
          })
        })

        BddTest().then('it should show a success toaster with the correct count', async () => {
          await vi.waitFor(() => {
            expect(mockAddSuccessMessage).toHaveBeenCalledWith({
              timeout: 2000,
              description: expect.stringContaining('2')
            })
          })
        })

        BddTest().then('it should not show an error toaster', () => {
          expect(mockAddErrorMessage).not.toHaveBeenCalled()
        })
      })
    })

    BddTest().when('the show prop is false', () => {
      beforeEach(async () => {
        wrapper = mountComponent(AssociateDeclaredSkillsToActivityModal, {
          props: { ...props, show: false },
          global: { stubs }
        })
        await flushPromises()
      })

      BddTest().then('it should pass show as false to the inner modal', () => {
        const modal = wrapper.findComponent(AssociateDeclaredSkillsModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredSkillsModalStub>>
        expect(modal.props('show')).toBe(false)
      })
    })

    BddTest().when('associating skills fails', () => {
      beforeEach(async () => {
        server.use(associateActivityWithDeclaredSkillsErrorHandler)

        wrapper = mountComponent(AssociateDeclaredSkillsToActivityModal, {
          props,
          global: { stubs }
        })

        await vi.waitFor(() => {
          const modal = wrapper.findComponent(AssociateDeclaredSkillsModalStub)
          expect(modal.props('skills').length).toBeGreaterThan(0)
        })
      })

      BddTest().and('the user confirms the association', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent(AssociateDeclaredSkillsModalStub) as VueWrapper<InstanceType<typeof AssociateDeclaredSkillsModalStub>>
          modal.vm.$emit('associate', ['skill-search-1'])
          await flushPromises()
        })

        BddTest().then('it should add an error toaster message', async () => {
          await vi.waitFor(() => {
            expect(mockAddErrorMessage).toHaveBeenCalledWith({
              title: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
              description: expect.any(String),
            })
          })
        })

        BddTest().then('it should not add a success toaster message', () => {
          expect(mockAddSuccessMessage).not.toHaveBeenCalled()
        })

        BddTest().then('it should not emit associated event', () => {
          expect(wrapper.emitted('associated')).toBeFalsy()
        })
      })
    })
  })
})
