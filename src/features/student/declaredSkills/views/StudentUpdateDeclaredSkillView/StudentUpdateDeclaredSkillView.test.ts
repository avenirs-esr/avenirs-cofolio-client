import type { VueWrapper } from '@vue/test-utils'
import { ROUTES } from '@/common/constants'
import StudentUpdateDeclaredSkillView from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/StudentUpdateDeclaredSkillView.vue'
import { UpdateInProgressBadgeStub } from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentDeclaredSkill = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentDeclaredSkill,
    }),
  }
})

const AvTabsStub = {
  name: 'AvTabs',
  props: ['modelValue'],
  emits: ['update:modelValue'],
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

const UpdateDeclaredSkillFormStub = {
  name: 'UpdateDeclaredSkillForm',
  props: ['declaredSkillProgressDetails', 'onSkillUpdated'],
  emits: ['dirty-change'],
  template: '<div class="update-form-stub" />',
}

const UpdateDeclaredSkillAssociationsStub = {
  name: 'UpdateDeclaredSkillAssociations',
  props: ['traceAssociations', 'declaredSkillId'],
  template: '<div class="update-associations-stub" />'
}

const stubs = {
  PageTitle: PageTitleStubWithBack,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub,
  UpdateDeclaredSkillForm: UpdateDeclaredSkillFormStub,
  UpdateDeclaredSkillAssociations: UpdateDeclaredSkillAssociationsStub,
  UpdateInProgressBadge: UpdateInProgressBadgeStub
}

BddTest().given('a student update declared skill view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentUpdateDeclaredSkillView>>

  beforeEach(() => {
    vi.clearAllMocks()

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
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Modifier ma compétence déclarée')
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

    BddTest().then('it should render the skill title', async () => {
      await vi.waitFor(() => {
        const title = wrapper.find('[data-testid="update-declared-skill-view__title"] .n4')
        expect(title.exists()).toBe(true)
        expect(title.text()).toBe('Conduire un projet de bout en bout')
      })
    })

    BddTest().then('it should render AvTabs', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(tabs.exists()).toBe(true)
    })

    BddTest().then('it should render UpdateDeclaredSkillForm with correct props', async () => {
      await vi.waitFor(() => {
        const form = wrapper.findComponent(UpdateDeclaredSkillFormStub)
        expect(form.exists()).toBe(true)
        expect(typeof form.props('onSkillUpdated')).toBe('function')
        expect(form.props('declaredSkillProgressDetails')).toMatchObject({
          id: '123',
          title: 'Conduire un projet de bout en bout'
        })
      })
    })

    BddTest().then('it should not show the update in progress badge initially', () => {
      const badge = wrapper.find('[data-testid="update-in-progress-badge"]')
      expect(badge.exists()).toBe(false)
    })

    BddTest().then('it should render UpdateDeclaredSkillAssociations with correct props', async () => {
      await vi.waitFor(() => {
        const associations = wrapper.findComponent(UpdateDeclaredSkillAssociationsStub)
        expect(associations.exists()).toBe(true)
        expect(associations.props('declaredSkillId')).toBe('123')
      })
    })
  })

  BddTest().when('the form triggers onSkillUpdated', () => {
    BddTest().then('it should navigate using useNavigation.navigateToStudentDeclaredSkill', async () => {
      await vi.waitFor(() => {
        const form = wrapper.findComponent({ name: 'UpdateDeclaredSkillForm' })
        expect(form.exists()).toBe(true)
      })
      const form = wrapper.findComponent({ name: 'UpdateDeclaredSkillForm' })
      await form.vm.$props.onSkillUpdated()
      expect(navigateToStudentDeclaredSkill).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('the form emits dirty-change event', () => {
    BddTest().then('it should show the update in progress badge when dirty is true', async () => {
      await vi.waitFor(() => {
        const form = wrapper.findComponent({ name: 'UpdateDeclaredSkillForm' })
        expect(form.exists()).toBe(true)
      })
      const form = wrapper.findComponent({ name: 'UpdateDeclaredSkillForm' })
      await form.vm.$emit('dirty-change', true)
      await wrapper.vm.$nextTick()

      const badge = wrapper.find('[data-testid="update-in-progress-badge"]')
      expect(badge.exists()).toBe(true)
    })

    BddTest().then('it should hide the update in progress badge when dirty is false', async () => {
      await vi.waitFor(() => {
        const form = wrapper.findComponent({ name: 'UpdateDeclaredSkillForm' })
        expect(form.exists()).toBe(true)
      })
      const form = wrapper.findComponent({ name: 'UpdateDeclaredSkillForm' })
      await form.vm.$emit('dirty-change', true)
      await wrapper.vm.$nextTick()

      let badge = wrapper.find('[data-testid="update-in-progress-badge"]')
      expect(badge.exists()).toBe(true)

      await form.vm.$emit('dirty-change', false)
      await wrapper.vm.$nextTick()

      badge = wrapper.find('[data-testid="update-in-progress-badge"]')
      expect(badge.exists()).toBe(false)
    })
  })
})
