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
import { ElementAssociationsCardsStub } from '@/features/student/associations/components/cards/ElementAssociationsCards/ElementAssociationsCards.stub'
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
  ElementAssociationsCards: ElementAssociationsCardsStub,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub,
  DeclaredSkillDetails: DeclaredSkillDetailsStub,
  DeclaredSkillSettingDropdown: DeclaredSkillSettingDropdownStub,
}

BddTest().given('a student declared skill view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDeclaredSkillView>>
  const getDetailedDropdown = () => wrapper.findComponent(DeclaredSkillSettingDropdownStub)

  const skillId = 'declared-skill-progress-1'

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
    BddTest().then('it should render DetailPageTitle with correct props', async () => {
      const pageTitle = wrapper.findComponent(DetailPageTitleStub)

      expect(pageTitle.exists()).toBe(true)

      await vi.waitFor(() => {
        expect(pageTitle.props('title')).toBe('Conduire un projet de bout en bout')
      })

      expect(pageTitle.props('trailingLinks')).toHaveLength(1)
    })

    BddTest().then('it should pass the element id to the detailed dropdown', () => {
      expect(getDetailedDropdown().props('elementId')).toBe('declared-skill-progress-1')
    })

    BddTest().then('it should pass has-associations to the detailed dropdown', () => {
      expect(getDetailedDropdown().props('hasAssociations')).toBe(true)
    })

    BddTest().then('it should render DeclaredSkillSettingDropdown', () => {
      const settingDropdown = wrapper.findComponent(DeclaredSkillSettingDropdownStub)
      expect(settingDropdown.exists()).toBe(true)
    })

    BddTest().then('it should render AvTabs', () => {
      const tabs = wrapper.findComponent(AvTabsStub)
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
        const detailsComponent = wrapper.findComponent(DeclaredSkillDetailsStub)
        expect(detailsComponent.exists()).toBe(true)
        expect(detailsComponent.props('declaredSkillProgressDetails')).toBeDefined()
        expect(detailsComponent.props('declaredSkillProgressDetails').title).toBe('Conduire un projet de bout en bout')
      })
    })

    BddTest().then('it should render ElementAssociations component with correct props when associations tab is active', async () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      await tabs.vm.$emit('update:modelValue', 1)

      await vi.waitFor(() => {
        const elementAssociations = wrapper.findComponent(ElementAssociationsCardsStub)
        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('contextType')).toBe(EAssociationContextType.DECLARED_SKILL)
        expect(elementAssociations.props('associations')).toEqual(mockedDeclaredSkillAssociations)
        expect(elementAssociations.props('error')).toBeNull()
      })
    })

    BddTest().then('it should display the correct count of associations in associations tab title when associations tab is active', async () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      await tabs.vm.$emit('update:modelValue', 1)

      await vi.waitFor(() => {
        const activeTab = wrapper.findComponent(AvTabStub)
        expect(activeTab.exists()).toBe(true)
        expect(activeTab.props('title')).toBe('Mes associations (7)')
      })
    })

    BddTest().then('it should not render ErrorMessage', async () => {
      await vi.waitFor(() => {
        const errorMessage = wrapper.findComponent(ErrorMessageStub)
        expect(errorMessage.exists()).toBe(false)
      })
    })
  })

  BddTest().when('the update selected event is emitted', () => {
    BddTest().then('it should handle the event', async () => {
      const settingDropdown = wrapper.findComponent(DeclaredSkillSettingDropdownStub)
      await settingDropdown.vm.$emit('update')
      expect(navigateToStudentUpdateDeclaredSkill).toHaveBeenCalled()
    })
  })

  BddTest().when('the delete selected event is emitted', () => {
    beforeEach(async () => {
      const settingDropdown = wrapper.findComponent(DeclaredSkillSettingDropdownStub)
      await settingDropdown.vm.$emit('delete')
    })

    BddTest().then('it should open the delete confirmation modal', async () => {
      await vi.waitFor(() => {
        const deleteModal = wrapper.findComponent(DeleteDeclaredSkillConfirmModalStub)
        expect(deleteModal.exists()).toBe(true)
        expect(deleteModal.props('opened')).toBe(true)
      })
    })

    BddTest().and('the modal emits the close event', () => {
      beforeEach(async () => {
        const deleteModal = wrapper.findComponent(DeleteDeclaredSkillConfirmModalStub)
        await deleteModal.vm.$emit('close')
      })

      BddTest().then('it should close the delete confirmation modal', async () => {
        await vi.waitFor(() => {
          const deleteModal = wrapper.findComponent(DeleteDeclaredSkillConfirmModalStub)
          expect(deleteModal.exists()).toBe(true)
          expect(deleteModal.props('opened')).toBe(false)
        })
      })
    })

    BddTest().and('the modal emits the skill deleted event', () => {
      beforeEach(async () => {
        const deleteModal = wrapper.findComponent(DeleteDeclaredSkillConfirmModalStub)
        await deleteModal.vm.$emit('skillDeleted')
      })

      BddTest().then('it should close the delete confirmation modal', async () => {
        await vi.waitFor(() => {
          const deleteModal = wrapper.findComponent(DeleteDeclaredSkillConfirmModalStub)
          expect(deleteModal.exists()).toBe(true)
          expect(deleteModal.props('opened')).toBe(false)
        })
      })

      BddTest().then('it should navigate to skills page', async () => {
        await vi.waitFor(() => {
          expect(navigateToStudentSkills).toHaveBeenCalledWith({ replace: true })
        })
      })
    })
  })

  BddTest().when('the view is mounted from the tools kit', () => {
    beforeEach(() => {
      route.name = ROUTES.STUDENT.TOOLS_KIT_SKILL.name
      wrapper = mountComponent(StudentDeclaredSkillView, {
        props: { skillId },
        global: { stubs }
      })
    })

    BddTest().and('the update action is selected', () => {
      beforeEach(async () => {
        await vi.waitFor(() =>
          expect(wrapper.findComponent(DeclaredSkillSettingDropdownStub).exists()).toBe(true)
        )
        await wrapper.findComponent(DeclaredSkillSettingDropdownStub).vm.$emit('update')
      })

      BddTest().then('it should navigate to the tools kit update route', () => {
        expect(navigateToStudentToolsKitUpdateSkill).toHaveBeenCalledTimes(1)
        expect(navigateToStudentUpdateDeclaredSkill).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the skill is deleted', () => {
      beforeEach(async () => {
        await vi.waitFor(() =>
          expect(wrapper.findComponent(DeclaredSkillSettingDropdownStub).exists()).toBe(true)
        )
        await wrapper.findComponent(DeclaredSkillSettingDropdownStub).vm.$emit('delete')
        await wrapper.findComponent(DeleteDeclaredSkillConfirmModalStub).vm.$emit('skillDeleted')
      })

      BddTest().then('it should navigate back to the tools kit skills list', () => {
        expect(navigateToStudentToolsKitSkills).toHaveBeenCalledWith({ replace: true })
        expect(navigateToStudentSkills).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the query fails with SKILL_PROGRESS_NOT_FOUND', () => {
    beforeEach(() => {
      server.use(detailedSkillProgressNotFoundErrorHandler)

      wrapper = mountComponent(StudentDeclaredSkillView, {
        props: { skillId },
        global: { stubs }
      })
    })

    BddTest().then('it should render ErrorMessage with not found title and description', async () => {
      await vi.waitFor(() => {
        const errorMessage = wrapper.findComponent(ErrorMessageStub)
        expect(errorMessage.exists()).toBe(true)
        expect(errorMessage.props('title')).toBe('Compétence déclarée introuvable')
        expect(errorMessage.props('description')).toBe('La compétence que vous recherchez n\'existe pas ou n\'est pas accessible.')
      })
    })

    BddTest().then('it should not render ElementAssociations when the associations tab is active', async () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      await tabs.vm.$emit('update:modelValue', 1)

      await vi.waitFor(() => {
        expect(wrapper.findComponent(ErrorMessageStub).exists()).toBe(true)
      })

      expect(wrapper.findComponent(ElementAssociationsCardsStub).exists()).toBe(false)
      expect(wrapper.findComponent(AvTabStub).props('title')).toBe('Mes associations (0)')
    })
  })

  BddTest().when('the associations query returns empty data', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentDeclaredSkillView, {
        props: { skillId: 'SKILL_WITHOUT_ASSOCIATIONS' },
        global: { stubs }
      })
    })

    BddTest().then('it should render ElementAssociations with empty associations', async () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      await tabs.vm.$emit('update:modelValue', 1)

      await vi.waitFor(() => {
        const elementAssociations = wrapper.findComponent(ElementAssociationsCardsStub)
        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('associations')).toEqual(mockedEmptyAssociations)
        expect(elementAssociations.props('error')).toBeNull()
      })
    })

    BddTest().then('it should display a zero associations count in the associations tab title', async () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      await tabs.vm.$emit('update:modelValue', 1)

      await vi.waitFor(() => {
        expect(wrapper.findComponent(ElementAssociationsCardsStub).props('associations')).toEqual(mockedEmptyAssociations)
      })

      expect(wrapper.findComponent(AvTabStub).props('title')).toBe('Mes associations (0)')
    })
  })

  BddTest().when('the associations query fails', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentDeclaredSkillView, {
        props: { skillId: 'INVALID_DECLARED_SKILL_ID' },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the associations error to ElementAssociations', async () => {
      const tabs = wrapper.findComponent(AvTabsStub)
      await tabs.vm.$emit('update:modelValue', 1)

      await vi.waitFor(() => {
        const elementAssociations = wrapper.findComponent(ElementAssociationsCardsStub)
        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('error')).toEqual(expect.objectContaining({ code: EErrorCode.SKILL_PROGRESS_NOT_FOUND }))
        expect(elementAssociations.props('associations')).toBeUndefined()
      })
    })
  })
})
