import type { VueWrapper } from '@vue/test-utils'
import { UpdateInProgressBadgeStub } from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { UpdatePageTitleStub } from '@/common/components/UpdatePageTitle/UpdatePageTitle.stub'
import { StudentDeclaredSkillAssociationsStub } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/StudentDeclaredSkillAssociations/StudentDeclaredSkillAssociations.stub'
import { UpdateDeclaredSkillFormStub } from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/UpdateDeclaredSkillForm/UpdateDeclaredSkillForm.stub'
import StudentUpdateDeclaredSkillView from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/StudentUpdateDeclaredSkillView.vue'
import { AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentProjectDeclaredSkill = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentProjectDeclaredSkill,
    }),
  }
})

const mockCanLeave = vi.fn<() => Promise<boolean>>()
const mockConfirm = vi.fn()
const mockCancel = vi.fn()

vi.mock('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard')
  >()
  return {
    ...actual,
    useUnsavedChangesGuard: () => ({
      canLeave: mockCanLeave,
      confirm: mockConfirm,
      cancel: mockCancel
    })
  }
})

const AvTabsStub = {
  name: 'AvTabs',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: '<div class="av-tabs-stub"><slot /></div>'
}

const stubs = {
  UpdatePageTitle: UpdatePageTitleStub,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub,
  UpdateDeclaredSkillForm: UpdateDeclaredSkillFormStub,
  StudentDeclaredSkillAssociations: StudentDeclaredSkillAssociationsStub,
  UpdateInProgressBadge: UpdateInProgressBadgeStub,
  ConfirmationModal: ConfirmationModalStub
}

BddTest().given('a student update declared skill view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentUpdateDeclaredSkillView>>

  beforeEach(() => {
    vi.clearAllMocks()
    mockCanLeave.mockResolvedValue(true)

    wrapper = mountComponent(StudentUpdateDeclaredSkillView, {
      props: {
        skillId: '123'
      },
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render UpdatePageTitle with correct props', async () => {
      const pageTitle = wrapper.findComponent(UpdatePageTitleStub)

      expect(pageTitle.exists()).toBe(true)

      await vi.waitFor(() => {
        expect(pageTitle.props('title')).toBe('Conduire un projet de bout en bout')
      })

      expect(pageTitle.props('trailingLinks')).toHaveLength(2)
    })

    BddTest().then('it should render AvTabs', () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      expect(tabs.exists()).toBe(true)
    })

    BddTest().then('it should render UpdateDeclaredSkillForm with correct props', async () => {
      await vi.waitFor(() => {
        const form = wrapper.findComponent(UpdateDeclaredSkillFormStub)
        expect(form.exists()).toBe(true)
        expect(typeof form.props('onSkillUpdated')).toBe('function')
        expect(typeof form.props('onCancel')).toBe('function')
        expect(form.props('declaredSkillProgressDetails')).toMatchObject({
          id: '123',
          title: 'Conduire un projet de bout en bout'
        })
      })
    })

    BddTest().then('it should always render the update in progress badge', () => {
      const badge = wrapper.find('[data-testid="update-in-progress-badge"]')
      expect(badge.exists()).toBe(true)
    })

    BddTest().then('it should render StudentDeclaredSkillAssociations with correct props', async () => {
      await vi.waitFor(() => {
        const associations = wrapper.findComponent(StudentDeclaredSkillAssociationsStub)
        expect(associations.exists()).toBe(true)
        expect(associations.props('declaredSkillId')).toBe('123')
        expect(associations.props('associatedTraces')).toHaveLength(2)
        expect(associations.props('associatedDeclaredActivities')).toHaveLength(1)
        expect(associations.props('associatedDeclaredExperiences')).toHaveLength(2)
        expect(associations.props('countAssociations')).toBe(5)
        expect(associations.props('disabled')).toBe(true)
        expect(associations.props('showActions')).toBe(false)
      })
    })

    BddTest().then('it should include all association types in the associations tab count', async () => {
      await vi.waitFor(() => {
        const tabs = wrapper.findAllComponents(AvTabStub)
        expect(String(tabs[1].props('title'))).toContain('5')
      })
    })

    BddTest().then('it should render the confirmation modal initially closed', () => {
      const modal = wrapper.findComponent(ConfirmationModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
    })
  })

  BddTest().when('the form triggers onSkillUpdated', () => {
    BddTest().then('it should navigate using useNavigation.navigateToStudentProjectDeclaredSkill', async () => {
      await vi.waitFor(() => {
        const form = wrapper.findComponent(UpdateDeclaredSkillFormStub)
        expect(form.exists()).toBe(true)
      })
      const form = wrapper.findComponent(UpdateDeclaredSkillFormStub)
      await form.vm.$props.onSkillUpdated()
      expect(navigateToStudentProjectDeclaredSkill).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('the form emits dirty-change event', () => {
    BddTest().then('it should keep showing the update in progress badge regardless of dirty state', async () => {
      await vi.waitFor(() => {
        const form = wrapper.findComponent(UpdateDeclaredSkillFormStub)
        expect(form.exists()).toBe(true)
      })
      const form = wrapper.findComponent(UpdateDeclaredSkillFormStub)
      await form.vm.$emit('dirty-change', true)
      await wrapper.vm.$nextTick()

      let badge = wrapper.find('[data-testid="update-in-progress-badge"]')
      expect(badge.exists()).toBe(true)

      await form.vm.$emit('dirty-change', false)
      await wrapper.vm.$nextTick()

      badge = wrapper.find('[data-testid="update-in-progress-badge"]')
      expect(badge.exists()).toBe(true)
    })
  })

  BddTest().when('the cancel action is triggered on the form', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const form = wrapper.findComponent(UpdateDeclaredSkillFormStub)
          expect(form.exists()).toBe(true)
        })
        const form = wrapper.findComponent(UpdateDeclaredSkillFormStub)
        await form.vm.$props.onCancel()
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should navigate to declared skill view', () => {
        expect(navigateToStudentProjectDeclaredSkill).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        await vi.waitFor(() => {
          const form = wrapper.findComponent(UpdateDeclaredSkillFormStub)
          expect(form.exists()).toBe(true)
        })
        const form = wrapper.findComponent(UpdateDeclaredSkillFormStub)
        await form.vm.$props.onCancel()
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should not navigate', () => {
        expect(navigateToStudentProjectDeclaredSkill).not.toHaveBeenCalled()
      })

      BddTest().and('confirming the modal', () => {
        beforeEach(async () => {
          const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
          await confirmationModal.vm.$emit('confirm')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call guard confirm', () => {
          expect(mockConfirm).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('closing the modal', () => {
        beforeEach(async () => {
          const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
          await confirmationModal.vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call guard cancel', () => {
          expect(mockCancel).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
