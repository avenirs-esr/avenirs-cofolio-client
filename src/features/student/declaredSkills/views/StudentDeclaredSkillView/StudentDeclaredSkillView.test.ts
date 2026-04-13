import type { VueWrapper } from '@vue/test-utils'
import { detailedSkillProgressNotFoundErrorHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { ErrorMessageStub } from '@/common/components/feedback/ErrorMessage/ErrorMessage.stub'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { DeleteDeclaredSkillConfirmModalStub } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeleteDeclaredSkillConfirmModal/DeleteDeclaredSkillConfirmModal.stub'
import { StudentDeclaredSkillAssociationsStub } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/StudentDeclaredSkillAssociations/StudentDeclaredSkillAssociations.stub'
import StudentDeclaredSkillView from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentUpdateDeclaredSkill = vi.fn()
const navigateToStudentProjectSkills = vi.fn()

vi.mock('@/common/composables', async () => {
  const actual = await vi.importActual('@/common/composables')
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentUpdateDeclaredSkill,
      navigateToStudentProjectSkills
    })
  }
})

const stubs = {
  PageTitle: PageTitleStub,
  ErrorMessage: ErrorMessageStub,
  DeleteDeclaredSkillConfirmModal: DeleteDeclaredSkillConfirmModalStub,
  StudentDeclaredSkillAssociations: StudentDeclaredSkillAssociationsStub,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub,
  DeclaredSkillDetails: {
    name: 'DeclaredSkillDetails',
    props: ['declaredSkillProgressDetails'],
    template: '<div class="declared-skill-details-stub" />'
  },
  DeclaredSkillSettingDropdown: {
    name: 'DeclaredSkillSettingDropdown',
    template: '<div class="declared-skill-setting-dropdown-stub" />'
  }
}

BddTest().given('a student declared skill view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDeclaredSkillView>>
  const skillId = 'declared-skill-progress-1'

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mountComponent(StudentDeclaredSkillView, {
      props: { skillId },
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Détail de ma compétence déclarée')
      expect(pageTitle.props('back')).toBe(ROUTES.STUDENT.PROJECT_SKILLS)

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbLinks).toHaveLength(4)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: ROUTES.STUDENT.HOME
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Toutes mes compétences',
        to: ROUTES.STUDENT.PROJECT_SKILLS
      })
      expect(breadcrumbLinks[3]).toEqual({
        text: 'Mes autres compétences et certifications déclarées'
      })
    })

    BddTest().then('it should render the skill title from query data', async () => {
      await vi.waitFor(() => {
        const title = wrapper.find('[data-testid="student-declared-skill-view__title"] .n4')
        expect(title.exists()).toBe(true)
        expect(title.text()).toBe('Conduire un projet de bout en bout')
      })
    })

    BddTest().then('it should render DeclaredSkillSettingDropdown', () => {
      const settingDropdown = wrapper.findComponent({ name: 'DeclaredSkillSettingDropdown' })
      expect(settingDropdown.exists()).toBe(true)
    })

    BddTest().then('it should render AvTabs', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(tabs.exists()).toBe(true)
    })

    BddTest().then('it should render the details tab by default', async () => {
      await vi.waitFor(() => {
        const activeTab = wrapper.findComponent(AvTabStub)
        expect(activeTab.exists()).toBe(true)
        expect(activeTab.props('title')).toBe('Ma compétence déclarée')
      })
    })

    BddTest().then('it should render DeclaredSkillDetails component with correct props', async () => {
      await vi.waitFor(() => {
        const detailsComponent = wrapper.findComponent({ name: 'DeclaredSkillDetails' })
        expect(detailsComponent.exists()).toBe(true)
        expect(detailsComponent.props('declaredSkillProgressDetails')).toBeDefined()
        expect(detailsComponent.props('declaredSkillProgressDetails').title).toBe('Conduire un projet de bout en bout')
      })
    })

    BddTest().then('it should render StudentDeclaredSkillAssociations component with correct props when associations tab is active', async () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      await tabs.vm.$emit('update:modelValue', 1)

      await vi.waitFor(() => {
        const activeTab = wrapper.findComponent(AvTabStub)
        expect(activeTab.exists()).toBe(true)
        expect(String(activeTab.props('title'))).toContain('3')

        const associationsComponent = wrapper.findComponent(StudentDeclaredSkillAssociationsStub)
        expect(associationsComponent.exists()).toBe(true)
        expect(associationsComponent.props('declaredSkillId')).toBe('declared-skill-progress-1')
        expect(associationsComponent.props('associatedTraces')).toEqual([])
        expect(associationsComponent.props('associatedDeclaredActivities')).toEqual([])
      })
    })

    BddTest().then('it should display the correct count of associations in associations tab title when associations tab is active', async () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      await tabs.vm.$emit('update:modelValue', 1)

      await vi.waitFor(() => {
        const activeTab = wrapper.findComponent(AvTabStub)
        expect(activeTab.exists()).toBe(true)
        expect(String(activeTab.props('title'))).toContain('3')
      })
    })

    BddTest().then('it should not render ErrorMessage', async () => {
      await vi.waitFor(() => {
        const errorMessage = wrapper.findComponent({ name: 'ErrorMessage' })
        expect(errorMessage.exists()).toBe(false)
      })
    })
  })

  BddTest().when('the update selected event is emitted', () => {
    BddTest().then('it should handle the event', async () => {
      const settingDropdown = wrapper.findComponent({ name: 'DeclaredSkillSettingDropdown' })
      await settingDropdown.vm.$emit('updateSelected')
      expect(navigateToStudentUpdateDeclaredSkill).toHaveBeenCalled()
    })
  })

  BddTest().when('the delete selected event is emitted', () => {
    beforeEach(async () => {
      const settingDropdown = wrapper.findComponent({ name: 'DeclaredSkillSettingDropdown' })
      await settingDropdown.vm.$emit('deleteSelected')
    })

    BddTest().then('it should show the delete confirmation modal', async () => {
      await vi.waitFor(() => {
        const deleteModal = wrapper.findComponent({ name: 'DeleteDeclaredSkillConfirmModal' })
        expect(deleteModal.exists()).toBe(true)
        expect(deleteModal.props('show')).toBe(true)
      })
    })

    BddTest().and('the modal emits the close event', () => {
      beforeEach(async () => {
        const deleteModal = wrapper.findComponent({ name: 'DeleteDeclaredSkillConfirmModal' })
        await deleteModal.vm.$emit('close')
      })

      BddTest().then('it should hide the delete confirmation modal', async () => {
        await vi.waitFor(() => {
          const deleteModal = wrapper.findComponent({ name: 'DeleteDeclaredSkillConfirmModal' })
          expect(deleteModal.exists()).toBe(true)
          expect(deleteModal.props('show')).toBe(false)
        })
      })
    })

    BddTest().and('the modal emits the skill deleted event', () => {
      beforeEach(async () => {
        const deleteModal = wrapper.findComponent({ name: 'DeleteDeclaredSkillConfirmModal' })
        await deleteModal.vm.$emit('skillDeleted')
      })

      BddTest().then('it should hide the delete confirmation modal', async () => {
        await vi.waitFor(() => {
          const deleteModal = wrapper.findComponent({ name: 'DeleteDeclaredSkillConfirmModal' })
          expect(deleteModal.exists()).toBe(true)
          expect(deleteModal.props('show')).toBe(false)
        })
      })

      BddTest().then('it should navigate to skills page', async () => {
        await vi.waitFor(() => {
          expect(navigateToStudentProjectSkills).toHaveBeenCalledWith({ replace: true })
        })
      })
    })
  })

  BddTest().when('the query fails with DECLARED_SKILL_PROGRESS_NOT_FOUND', () => {
    beforeEach(() => {
      server.use(detailedSkillProgressNotFoundErrorHandler)

      wrapper = mountComponent(StudentDeclaredSkillView, {
        props: { skillId },
        global: { stubs }
      })
    })

    BddTest().then('it should render ErrorMessage with not found title and description', async () => {
      await vi.waitFor(() => {
        const errorMessage = wrapper.findComponent({ name: 'ErrorMessage' })
        expect(errorMessage.exists()).toBe(true)
        expect(errorMessage.props('title')).toBe('Compétence déclarée introuvable')
        expect(errorMessage.props('description')).toBe('La compétence que vous recherchez n\'existe pas ou n\'est pas accessible.')
      })
    })
  })
})
