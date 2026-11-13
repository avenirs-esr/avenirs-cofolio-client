import type { VueWrapper } from '@vue/test-utils'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { DetailPageTitleStub, ErrorMessageStub, LoaderStub } from '@avenirs-esr/shared'
import { EAssociationContextType, EErrorCode } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { createMockedDeclaredExperienceAssociationsDTO, mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import {
  declaredExperienceDetailedLoadingHandler,
  declaredExperienceDetailedNotFoundHandler,
  declaredExperiencesHandlers,
} from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { ROUTES } from '@/common/constants'
import { ElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import { DeleteDeclaredExperienceConfirmModalStub } from '@/features/student/personalCareer/components/overlays/DeleteDeclaredExperienceConfirmModal/DeleteDeclaredExperienceConfirmModal.stub'
import { DeclaredExperienceDetailsDropdownStub } from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.stub'
import DeclaredExperienceView from '@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'

const navigateToStudentUpdateDeclaredExperience = vi.fn()
const navigateToStudentDeclaredExperiences = vi.fn()

const route = reactive<{ name: string, params: { id: string } }>({
  name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
  params: {
    id: 'exp-123',
  },
})

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()

  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentUpdateDeclaredExperience,
      navigateToStudentDeclaredExperiences,
    }),
  }
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => route,
  }
})

const DeclaredExperienceDetailsStub = defineComponent({
  name: 'DeclaredExperienceDetails',
  props: ['declaredExperienceDetails'],
  template: '<div data-testid="declared-experience-details" />',
})

const stubs = {
  DetailPageTitle: DetailPageTitleStub,
  ErrorMessage: ErrorMessageStub,
  DeclaredExperienceDetails: DeclaredExperienceDetailsStub,
  ElementAssociations: ElementAssociationsStub,
  Loader: LoaderStub,
  DeclaredExperienceDetailsDropdown: DeclaredExperienceDetailsDropdownStub,
  DeleteDeclaredExperienceConfirmModal: DeleteDeclaredExperienceConfirmModalStub,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub,
}

BddTest().given('a declared experience view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceView>>

  const mockedAssociations = createMockedDeclaredExperienceAssociationsDTO()
  const associationsCount = mockedAssociations.traceAssociations.length
    + mockedAssociations.declaredProgramAssociations.length

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(DeclaredExperienceView, {
      props: { experienceId: route.params.id },
      global: { stubs },
    })
  }

  const getPageTitle = () => wrapper.findComponent(DetailPageTitleStub)
  const getDropdown = () => wrapper.findComponent(DeclaredExperienceDetailsDropdownStub)
  const getTabs = () => wrapper.findComponent(AvTabsStub)
  const getActiveTab = () => wrapper.findComponent(AvTabStub)
  const getDetails = () => wrapper.findComponent(DeclaredExperienceDetailsStub)
  const getAssociations = () => wrapper.findComponent(ElementAssociationsStub)
  const getDeleteModal = () => wrapper.findComponent(DeleteDeclaredExperienceConfirmModalStub)

  beforeEach(() => {
    route.params.id = 'exp-123'
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render DetailPageTitle with the declared experience title', async () => {
      await vi.waitFor(() => {
        expect(getPageTitle().exists()).toBe(true)
        expect(getPageTitle().props('title')).toBe('Développeur Web Full Stack')
      })
    })

    BddTest().then('it should render the trailing link', async () => {
      await vi.waitFor(() => {
        expect(getPageTitle().props('trailingLinks')).toEqual([
          { text: 'Détail Développeur Web Full Stack' },
        ])
      })
    })

    BddTest().then('it should render the dropdown with the declared experience identifier', async () => {
      await vi.waitFor(() => {
        expect(getDropdown().exists()).toBe(true)
        expect(getDropdown().props('declaredExperienceId')).toBe('exp-123')
      })
    })

    BddTest().then('it should render AvTabs', async () => {
      await vi.waitFor(() => {
        expect(getTabs().exists()).toBe(true)
      })
    })

    BddTest().then('it should render the details tab by default', async () => {
      await vi.waitFor(() => {
        expect(getActiveTab().exists()).toBe(true)
        expect(getActiveTab().props('title')).toBe('Mon expérience déclarée')
      })
    })

    BddTest().then('it should render DeclaredExperienceDetails in the details tab', async () => {
      await vi.waitFor(() => {
        expect(getDetails().exists()).toBe(true)
        expect(getDetails().props('declaredExperienceDetails')).toEqual(
          expect.objectContaining({
            title: 'Développeur Web Full Stack',
          }),
        )
      })
    })

    BddTest().then('it should not render ErrorMessage', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(false)
      })
    })

    BddTest().then('it should pass the declared experience identifier to the delete modal', async () => {
      await vi.waitFor(() => {
        expect(getDeleteModal().props('declaredExperienceIds')).toEqual(['exp-123'])
        expect(getDeleteModal().props('opened')).toBe(false)
      })
    })
  })

  BddTest().when('the component is mounted and data is loading', () => {
    beforeEach(async () => {
      server.use(declaredExperienceDetailedLoadingHandler)
      await mountComponentWithDefaults()
    })

    BddTest().then('it should show the loader', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="loader-stub"]').exists()).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted and data is loaded', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesHandlers[2])
      await mountComponentWithDefaults()
      await flushPromises()
    })

    BddTest().then('it should not show the loader', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="loader-stub"]').exists()).toBe(false)
      })
    })

    BddTest().then('it should render DeclaredExperienceDetails', async () => {
      await vi.waitFor(() => {
        expect(getDetails().exists()).toBe(true)
      })
    })

    BddTest().and('the user selects to update the declared experience', () => {
      beforeEach(async () => {
        await getDropdown().vm.$emit('update')
      })

      BddTest().then('it should navigate to the update declared experience view', () => {
        expect(navigateToStudentUpdateDeclaredExperience).toHaveBeenCalledWith({})
      })
    })

    BddTest().and('the user selects to delete the declared experience', () => {
      beforeEach(async () => {
        await getDropdown().vm.$emit('delete')
      })

      BddTest().then('it should open the delete confirmation modal', () => {
        expect(getDeleteModal().props('opened')).toBe(true)
        expect(getDeleteModal().props('declaredExperienceIds')).toEqual(['exp-123'])
      })

      BddTest().and('the modal emits close', () => {
        beforeEach(async () => {
          await getDeleteModal().vm.$emit('close')
        })

        BddTest().then('it should close the delete confirmation modal', () => {
          expect(getDeleteModal().props('opened')).toBe(false)
        })
      })

      BddTest().and('the modal emits confirm', () => {
        beforeEach(async () => {
          await getDeleteModal().vm.$emit('confirm')
        })

        BddTest().then('it should close the delete confirmation modal', () => {
          expect(getDeleteModal().props('opened')).toBe(false)
        })

        BddTest().then('it should navigate to the declared experiences page', () => {
          expect(navigateToStudentDeclaredExperiences).toHaveBeenCalledWith({ replace: true })
        })
      })
    })

    BddTest().and('the user selects the associations tab', () => {
      beforeEach(async () => {
        await getTabs().vm.$emit('update:modelValue', 1)
        await flushPromises()
      })

      BddTest().then('it should render ElementAssociations with the declared experience context', () => {
        expect(getAssociations().exists()).toBe(true)
        expect(getAssociations().props('contextType')).toBe(EAssociationContextType.DECLARED_EXPERIENCE)
        expect(getAssociations().props('elementId')).toBe('exp-123')
      })

      BddTest().then('it should pass the associations data to ElementAssociations', () => {
        expect(getAssociations().props('associations')).toEqual(mockedAssociations)
        expect(getAssociations().props('error')).toBeNull()
      })

      BddTest().then('it should display the association count in the tab title', () => {
        expect(getActiveTab().props('title')).toBe(`Mes associations (${associationsCount})`)
      })
    })
  })

  BddTest().when('the query fails with DECLARED_EXPERIENCE_NOT_FOUND', () => {
    beforeEach(async () => {
      server.use(declaredExperienceDetailedNotFoundHandler)
      await mountComponentWithDefaults()
      await flushPromises()
    })

    BddTest().then('it should render the not found error message', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
        expect(wrapper.findComponent(ErrorMessageStub).props('title')).toBe('Expérience déclarée introuvable')
        expect(wrapper.findComponent(ErrorMessageStub).props('description')).toBe(
          'L\'expérience déclarée que vous recherchez n\'existe pas ou n\'est pas accessible.',
        )
      })
    })

    BddTest().then('it should not render DeclaredExperienceDetails', () => {
      expect(getDetails().exists()).toBe(false)
    })

    BddTest().then('it should not render the dropdown', () => {
      expect(getDropdown().exists()).toBe(false)
    })

    BddTest().then('it should still render DetailPageTitle', () => {
      expect(getPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should not render AvTabs', () => {
      expect(getTabs().exists()).toBe(false)
    })

    BddTest().then('it should not render ElementAssociations', () => {
      expect(getAssociations().exists()).toBe(false)
    })
  })

  BddTest().when('the associations query returns empty data', () => {
    beforeEach(async () => {
      route.params.id = 'EXP_WITHOUT_ASSOCIATIONS'
      await mountComponentWithDefaults()
      await flushPromises()
    })

    BddTest().then('it should render ElementAssociations with empty associations', async () => {
      await getTabs().vm.$emit('update:modelValue', 1)
      await flushPromises()

      expect(getAssociations().exists()).toBe(true)
      expect(getAssociations().props('contextType')).toBe(EAssociationContextType.DECLARED_EXPERIENCE)
      expect(getAssociations().props('elementId')).toBe('EXP_WITHOUT_ASSOCIATIONS')
      expect(getAssociations().props('associations')).toEqual(mockedEmptyAssociations)
      expect(getAssociations().props('error')).toBeNull()
    })

    BddTest().then('it should display a zero association count', async () => {
      await getTabs().vm.$emit('update:modelValue', 1)
      await flushPromises()

      expect(getActiveTab().props('title')).toBe('Mes associations (0)')
    })
  })

  BddTest().when('the associations query fails', () => {
    beforeEach(async () => {
      route.params.id = 'INVALID_EXPERIENCE_ID'
      await mountComponentWithDefaults()
      await flushPromises()
    })

    BddTest().then('it should pass the associations error to ElementAssociations', async () => {
      await getTabs().vm.$emit('update:modelValue', 1)
      await flushPromises()

      expect(getAssociations().exists()).toBe(true)
      expect(getAssociations().props('error')).toEqual(
        expect.objectContaining({
          code: EErrorCode.DECLARED_EXPERIENCE_NOT_FOUND,
        }),
      )
      expect(getAssociations().props('associations')).toBeUndefined()
    })

    BddTest().then('it should display a zero association count', async () => {
      await getTabs().vm.$emit('update:modelValue', 1)
      await flushPromises()

      expect(getActiveTab().props('title')).toBe('Mes associations (0)')
    })
  })
})
