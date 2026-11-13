import type { VueWrapper } from '@vue/test-utils'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { DetailPageTitleStub, ErrorMessageStub } from '@avenirs-esr/shared'
import { EAssociationContextType, EErrorCode } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mockedDeclaredSkillAssociations, mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import {
  detailedSkillProgressNotFoundErrorHandler
} from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { ROUTES } from '@/common/constants'
import { ElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import { DeclaredSkillDetailsStub } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillDetails/DeclaredSkillDetails.stub'
import { DeclaredSkillSettingDropdownStub } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillSettingDropdown/DeclaredSkillSettingDropdown.stub'
import { DeleteDeclaredSkillConfirmModalStub } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeleteDeclaredSkillConfirmModal/DeleteDeclaredSkillConfirmModal.stub'
import StudentDeclaredSkillView from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'

const navigateToStudentUpdateDeclaredSkill = vi.fn()
const navigateToStudentSkills = vi.fn()
const navigateToStudentToolsKitUpdateSkill = vi.fn()
const navigateToStudentToolsKitSkills = vi.fn()

const route = reactive<{ name: string }>({ name: ROUTES.STUDENT.DECLARED_SKILL.name })

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return { ...actual, useRoute: () => route }
})

vi.mock('@/common/composables', async () => {
  const actual = await vi.importActual('@/common/composables')
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentUpdateDeclaredSkill,
      navigateToStudentSkills,
      navigateToStudentToolsKitUpdateSkill,
      navigateToStudentToolsKitSkills
    })
  }
})

const stubs = {
  DetailPageTitle: DetailPageTitleStub,
  ErrorMessage: ErrorMessageStub,
  DeleteDeclaredSkillConfirmModal: DeleteDeclaredSkillConfirmModalStub,
  ElementAssociations: ElementAssociationsStub,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub,
  DeclaredSkillDetails: DeclaredSkillDetailsStub,
  DeclaredSkillSettingDropdown: DeclaredSkillSettingDropdownStub
}

BddTest().given('a student declared skill view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDeclaredSkillView>>

  const skillId = 'declared-skill-progress-1'

  const getPageTitle = () => wrapper.findComponent(DetailPageTitleStub)
  const getSettingDropdown = () => wrapper.findComponent(DeclaredSkillSettingDropdownStub)
  const getTabs = () => wrapper.findComponent(AvTabsStub)
  const switchTab = async (index: number) => {
    const tabs = getTabs()
    tabs.vm.$emit('update:modelValue', index)
    await flushPromises()
  }
  const getActiveTab = () => wrapper.findAllComponents(AvTabStub)[0]
  const getDetails = () => wrapper.findComponent(DeclaredSkillDetailsStub)
  const getAssociations = () => wrapper.findComponent(ElementAssociationsStub)
  const getDeleteModal = () => wrapper.findComponent(DeleteDeclaredSkillConfirmModalStub)
  const getErrorMessage = () => wrapper.findComponent(ErrorMessageStub)

  beforeEach(async () => {
    vi.clearAllMocks()
    route.name = ROUTES.STUDENT.DECLARED_SKILL.name

    wrapper = mountComponent(StudentDeclaredSkillView, {
      props: { skillId },
      global: { stubs }
    })

    await flushPromises()
    await nextTick()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render DetailPageTitle with the declared skill title', async () => {
      expect(getPageTitle().exists()).toBe(true)

      await vi.waitFor(() => {
        expect(getPageTitle().props('title')).toBe('Conduire un projet de bout en bout')
      })

      expect(getPageTitle().props('trailingLinks')).toHaveLength(1)
    })

    BddTest().then('it should render DeclaredSkillSettingDropdown with the skill identifier', () => {
      expect(getSettingDropdown().exists()).toBe(true)
      expect(getSettingDropdown().props('declaredSkillId')).toBe(skillId)
    })

    BddTest().then('it should render AvTabs', () => {
      expect(getTabs().exists()).toBe(true)
    })

    BddTest().then('it should render the details tab by default', async () => {
      await vi.waitFor(() => {
        expect(getActiveTab()).toBeDefined()
        expect(getActiveTab().props('title')).toBe('Ma compétence déclarée')
      })
    })

    BddTest().then('it should render DeclaredSkillDetails with the declared skill details', async () => {
      await vi.waitFor(() => {
        expect(getDetails().exists()).toBe(true)
        expect(getDetails().props('declaredSkillProgressDetails')).toBeDefined()
        expect(getDetails().props('declaredSkillProgressDetails').title).toBe('Conduire un projet de bout en bout')
      })
    })

    BddTest().then('it should render the delete confirmation modal closed', () => {
      expect(getDeleteModal().exists()).toBe(true)
      expect(getDeleteModal().props('opened')).toBe(false)
      expect(getDeleteModal().props('skillId')).toBe(skillId)
      expect(getDeleteModal().props('skillTitle')).toBe('Conduire un projet de bout en bout')
    })

    BddTest().then('it should not render ErrorMessage', () => {
      expect(getErrorMessage().exists()).toBe(false)
    })
  })

  BddTest().when('the associations tab is selected', () => {
    beforeEach(async () => {
      await switchTab(1)
    })

    BddTest().then('it should render ElementAssociations with the declared skill associations', async () => {
      await vi.waitFor(() => {
        expect(getAssociations().exists()).toBe(true)
        expect(getAssociations().props('contextType')).toBe(EAssociationContextType.DECLARED_SKILL)
        expect(getAssociations().props('elementId')).toBe('declared-skill-progress-1')
        expect(getAssociations().props('associations')).toEqual(mockedDeclaredSkillAssociations)
        expect(getAssociations().props('error')).toBeNull()
      })
    })

    BddTest().then('it should display the association count in the tab title', () => {
      expect(getActiveTab().props('title')).toBe('Mes associations (7)')
    })
  })

  BddTest().when('the update action is selected', () => {
    BddTest().then('it should navigate to the declared skill update page', async () => {
      await getSettingDropdown().vm.$emit('update')

      expect(navigateToStudentUpdateDeclaredSkill).toHaveBeenCalledTimes(1)
      expect(navigateToStudentToolsKitUpdateSkill).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the delete action is selected', () => {
    beforeEach(async () => {
      await getSettingDropdown().vm.$emit('delete')
    })

    BddTest().then('it should open the delete confirmation modal with the declared skill details', () => {
      expect(getDeleteModal().props('opened')).toBe(true)
      expect(getDeleteModal().props('skillId')).toBe(skillId)
      expect(getDeleteModal().props('skillTitle')).toBe('Conduire un projet de bout en bout')
    })

    BddTest().and('the modal emits the close event', () => {
      beforeEach(async () => {
        await getDeleteModal().vm.$emit('close')
      })

      BddTest().then('it should close the delete confirmation modal', () => {
        expect(getDeleteModal().props('opened')).toBe(false)
      })

      BddTest().then('it should not navigate to the skills page', () => {
        expect(navigateToStudentSkills).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the modal emits the skill deleted event', () => {
      beforeEach(async () => {
        await getDeleteModal().vm.$emit('skillDeleted')
      })

      BddTest().then('it should close the delete confirmation modal', () => {
        expect(getDeleteModal().props('opened')).toBe(false)
      })

      BddTest().then('it should navigate to the skills page', () => {
        expect(navigateToStudentSkills).toHaveBeenCalledWith({ replace: true })
      })
    })
  })

  BddTest().when('the view is mounted from the tools kit', () => {
    beforeEach(async () => {
      route.name = ROUTES.STUDENT.TOOLS_KIT_SKILL.name

      wrapper = mountComponent(StudentDeclaredSkillView, {
        props: { skillId },
        global: { stubs }
      })

      await flushPromises()
      await nextTick()
    })

    BddTest().and('the update action is selected', () => {
      beforeEach(async () => {
        await getSettingDropdown().vm.$emit('update')
      })

      BddTest().then('it should navigate to the tools kit update page', () => {
        expect(navigateToStudentToolsKitUpdateSkill).toHaveBeenCalledTimes(1)
        expect(navigateToStudentUpdateDeclaredSkill).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the skill is deleted', () => {
      beforeEach(async () => {
        await getSettingDropdown().vm.$emit('delete')
        await getDeleteModal().vm.$emit('skillDeleted')
      })

      BddTest().then('it should navigate back to the tools kit skills list', () => {
        expect(navigateToStudentToolsKitSkills).toHaveBeenCalledWith({ replace: true })
        expect(navigateToStudentSkills).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the query fails with SKILL_PROGRESS_NOT_FOUND', () => {
    beforeEach(async () => {
      server.use(detailedSkillProgressNotFoundErrorHandler)

      wrapper = mountComponent(StudentDeclaredSkillView, {
        props: { skillId },
        global: { stubs }
      })

      await flushPromises()
    })

    BddTest().then('it should render ErrorMessage with the not found title and description', async () => {
      await vi.waitFor(() => {
        expect(getErrorMessage().exists()).toBe(true)
        expect(getErrorMessage().props('title')).toBe('Compétence déclarée introuvable')
        expect(getErrorMessage().props('description')).toBe('La compétence que vous recherchez n\'existe pas ou n\'est pas accessible.')
      })
    })

    BddTest().then('it should not render DeclaredSkillDetails', () => {
      expect(getDetails().exists()).toBe(false)
    })

    BddTest().then('it should not render ElementAssociations when the associations tab is selected', async () => {
      await switchTab(1)

      expect(getAssociations().exists()).toBe(false)
      expect(getActiveTab().props('title')).toBe('Mes associations (0)')
    })
  })

  BddTest().when('the associations query returns empty data', () => {
    beforeEach(async () => {
      wrapper = mountComponent(StudentDeclaredSkillView, {
        props: { skillId: 'SKILL_WITHOUT_ASSOCIATIONS' },
        global: { stubs }
      })

      await flushPromises()
      await getTabs().vm.$emit('update:modelValue', 1)
      await flushPromises()
    })

    BddTest().then('it should render ElementAssociations with empty associations', async () => {
      await vi.waitFor(() => {
        expect(getAssociations().exists()).toBe(true)
        expect(getAssociations().props('associations')).toEqual(mockedEmptyAssociations)
        expect(getAssociations().props('error')).toBeNull()
      })
    })

    BddTest().then('it should display a zero association count in the tab title', () => {
      expect(getActiveTab().props('title')).toBe('Mes associations (0)')
    })
  })

  BddTest().when('the associations query fails', () => {
    beforeEach(async () => {
      wrapper = mountComponent(StudentDeclaredSkillView, {
        props: { skillId: 'INVALID_DECLARED_SKILL_ID' },
        global: { stubs }
      })

      await flushPromises()
      await getTabs().vm.$emit('update:modelValue', 1)
      await flushPromises()
    })

    BddTest().then('it should pass the associations error to ElementAssociations', async () => {
      await vi.waitFor(() => {
        expect(getAssociations().exists()).toBe(true)
        expect(getAssociations().props('error')).toEqual(
          expect.objectContaining({ code: EErrorCode.SKILL_PROGRESS_NOT_FOUND })
        )
        expect(getAssociations().props('associations')).toBeUndefined()
      })
    })
  })
})
