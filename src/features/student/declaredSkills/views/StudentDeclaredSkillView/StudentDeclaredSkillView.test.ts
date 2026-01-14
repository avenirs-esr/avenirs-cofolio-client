import type { VueWrapper } from '@vue/test-utils'
import { ROUTES } from '@/common/constants'
import StudentDeclaredSkillView from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentUpdateDeclaredSkill = vi.fn()

vi.mock('@/common/composables/use-navigation/use-navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/use-navigation/use-navigation')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentUpdateDeclaredSkill,
    }),
  }
})

const DeclaredSkillSettingDropdownStub = {
  name: 'DeclaredSkillSettingDropdown',
  emits: ['updateSelected', 'deleteAssociationSelected', 'deleteSelected'],
  template: '<div class="declared-skill-setting-popover-stub" />'
}

const AvTabsStub = {
  name: 'AvTabs',
  props: ['modelValue'],
  template: '<div class="av-tabs-stub"><slot /></div>'
}

const AvTabStub = {
  name: 'AvTab',
  props: ['title', 'icon'],
  template: '<div class="av-tab-stub"><slot /></div>'
}

const PageTitleStubWithBack = {
  name: 'PageTitle',
  template: '<div />',
  props: ['title', 'breadcrumbLinks', 'back']
}

const DeclaredSkillDetailsStub = {
  name: 'DeclaredSkillDetails',
  props: ['declaredSkillProgressDetails'],
  template: '<div class="declared-skill-details-stub" />'
}

const StudentDeclaredSkillAssociationsStub = {
  name: 'StudentDeclaredSkillAssociations',
  props: ['traceAssociations'],
  template: '<div class="student-declared-skill-associations-stub" />'
}

const stubs = {
  PageTitle: PageTitleStubWithBack,
  DeclaredSkillSettingDropdown: DeclaredSkillSettingDropdownStub,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub,
  DeclaredSkillDetails: DeclaredSkillDetailsStub,
  StudentDeclaredSkillAssociations: StudentDeclaredSkillAssociationsStub
}

BddTest().given('a student declared skill view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDeclaredSkillView>>

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mountComponent(StudentDeclaredSkillView, {
      props: {
        skillId: '123'
      },
      global: {
        stubs
      }
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
      const settingPopover = wrapper.findComponent({ name: 'DeclaredSkillSettingDropdown' })
      expect(settingPopover.exists()).toBe(true)
    })

    BddTest().then('it should render AvTabs with two tabs', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(tabs.exists()).toBe(true)

      const tabComponents = wrapper.findAllComponents({ name: 'AvTab' })
      expect(tabComponents).toHaveLength(2)
    })

    BddTest().then('it should render DeclaredSkillDetails component with correct props', async () => {
      await vi.waitFor(() => {
        const detailsComponent = wrapper.findComponent({ name: 'DeclaredSkillDetails' })
        expect(detailsComponent.exists()).toBe(true)
        expect(detailsComponent.props('declaredSkillProgressDetails')).toBeDefined()
        expect(detailsComponent.props('declaredSkillProgressDetails').title).toBe('Conduire un projet de bout en bout')
      })
    })

    BddTest().then('it should render StudentDeclaredSkillAssociations component with correct props', async () => {
      await vi.waitFor(() => {
        const associationsComponent = wrapper.findComponent({ name: 'StudentDeclaredSkillAssociations' })
        expect(associationsComponent.exists()).toBe(true)
        expect(associationsComponent.props('traceAssociations')).toBeDefined()
        expect(associationsComponent.props('traceAssociations')).toHaveLength(3)
      })
    })

    BddTest().then('it should display the correct count of associations in tab title', async () => {
      await vi.waitFor(() => {
        const tabComponents = wrapper.findAllComponents({ name: 'AvTab' })
        const associationsTab = tabComponents[1]
        expect(associationsTab.props('title')).toContain('0')
      })
    })
  })

  BddTest().when('the update selected event is emitted', () => {
    BddTest().then('it should handle the event', async () => {
      const settingPopover = wrapper.findComponent({ name: 'DeclaredSkillSettingDropdown' })
      await settingPopover.vm.$emit('updateSelected')
      expect(navigateToStudentUpdateDeclaredSkill).toHaveBeenCalled()
    })
  })

  BddTest().when('the delete association selected event is emitted', () => {
    BddTest().then('it should handle the event', async () => {
      const settingPopover = wrapper.findComponent({ name: 'DeclaredSkillSettingDropdown' })
      await settingPopover.vm.$emit('deleteAssociationSelected')
    })
  })

  BddTest().when('the delete selected event is emitted', () => {
    BddTest().then('it should handle the event', async () => {
      const settingPopover = wrapper.findComponent({ name: 'DeclaredSkillSettingDropdown' })
      await settingPopover.vm.$emit('deleteSelected')
    })
  })
})
