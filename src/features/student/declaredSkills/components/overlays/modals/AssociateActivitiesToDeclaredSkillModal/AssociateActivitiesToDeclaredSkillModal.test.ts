import type { AssociationActivity } from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import type { VueWrapper } from '@vue/test-utils'
import { searchDeclaredActivitiesForAssociationErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { associateDeclaredSkillWithDeclaredActivityErrorHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import AssociateActivitiesToDeclaredSkillModal, {
  type AssociateActivitiesToDeclaredSkillModalProps
} from '@/features/student/declaredSkills/components/overlays/modals/AssociateActivitiesToDeclaredSkillModal/AssociateActivitiesToDeclaredSkillModal.vue'
import { AssociateActivitiesModalStub } from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.stub'
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

BddTest().given('an associate activities to declared skill modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateActivitiesToDeclaredSkillModal>>

  const stubs = {
    AssociateActivitiesModal: AssociateActivitiesModalStub
  }

  const props: AssociateActivitiesToDeclaredSkillModalProps = {
    show: true,
    declaredSkillId: 'test-skill-id-123'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is rendered', () => {
    let modal: VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>

    beforeEach(async () => {
      wrapper = mountComponent(AssociateActivitiesToDeclaredSkillModal, {
        props,
        global: { stubs }
      })
      await flushPromises()
      modal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
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

    BddTest().then('it should load activities from the query and pass them to the modal', async () => {
      await vi.waitFor(() => {
        const updatedModal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
        expect(updatedModal.props('activities').length).toBeGreaterThan(0)
      })
    })

    BddTest().and('the inner modal emits search event', () => {
      let initialActivities: AssociationActivity[]

      beforeEach(async () => {
        initialActivities = modal.props('activities') as AssociationActivity[]
        modal.vm.$emit('search', 'valeurs')
        await flushPromises()
      })

      BddTest().then('it should update activities after search', async () => {
        await vi.waitFor(() => {
          const updatedModal = wrapper.findComponent(AssociateActivitiesModalStub)
          expect(updatedModal.props('activities')).not.toEqual(initialActivities)
        })
      })
    })

    BddTest().and('the inner modal emits associate event successfully', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const updatedModal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
          expect(updatedModal.props('activities').length).toBeGreaterThan(0)
        })

        modal.vm.$emit('associate', ['activity-search-1', 'activity-search-2'])
        await vi.waitFor(() => {
          expect(wrapper.emitted('associated')).toBeTruthy()
        })
      })

      BddTest().then('it should emit associated event', () => {
        expect(wrapper.emitted('associated')).toHaveLength(1)
      })

      BddTest().then('it should show a success toaster with the correct count', () => {
        expect(mockAddSuccessMessage).toHaveBeenCalledWith({
          timeout: 2000,
          description: expect.stringContaining('2')
        })
      })

      BddTest().then('it should not show an error toaster', () => {
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the inner modal emits cancel event', () => {
      beforeEach(() => {
        modal.vm.$emit('cancel')
      })

      BddTest().then('it should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the show prop is false', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociateActivitiesToDeclaredSkillModal, {
        props: { ...props, show: false },
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should pass show as false to the inner modal', () => {
      const modal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
      expect(modal.props('show')).toBe(false)
    })
  })

  BddTest().when('loading activities fails', () => {
    beforeEach(async () => {
      server.use(searchDeclaredActivitiesForAssociationErrorHandler)

      wrapper = mountComponent(AssociateActivitiesToDeclaredSkillModal, {
        props,
        global: { stubs }
      })
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

    BddTest().then('it should pass empty activities to the inner modal', () => {
      const modal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
      expect(modal.props('activities')).toEqual([])
    })
  })

  BddTest().when('associating activities fails', () => {
    beforeEach(async () => {
      server.use(associateDeclaredSkillWithDeclaredActivityErrorHandler)

      wrapper = mountComponent(AssociateActivitiesToDeclaredSkillModal, {
        props,
        global: { stubs }
      })

      await vi.waitFor(() => {
        const modal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
        expect(modal.props('activities').length).toBeGreaterThan(0)
      })
    })

    BddTest().and('the user confirms the association', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(AssociateActivitiesModalStub) as VueWrapper<InstanceType<typeof AssociateActivitiesModalStub>>
        modal.vm.$emit('associate', ['activity-search-1'])
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
