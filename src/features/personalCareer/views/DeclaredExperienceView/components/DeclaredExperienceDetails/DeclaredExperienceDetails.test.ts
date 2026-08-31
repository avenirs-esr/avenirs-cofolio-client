import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import DeclaredExperienceActivitySectorInput from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceActivitySectorInput/DeclaredExperienceActivitySectorInput.vue'
import DeclaredExperienceDescriptionTextarea from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceDescriptionTextarea/DeclaredExperienceDescriptionTextarea.vue'
import DeclaredExperienceExternalLinkInput from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceExternalLinkInput/DeclaredExperienceExternalLinkInput.vue'
import DeclaredExperienceLocationInput from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceLocationInput/DeclaredExperienceLocationInput.vue'
import DeclaredExperienceOrganizationInput from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceOrganizationInput/DeclaredExperienceOrganizationInput.vue'
import DeclaredExperiencePeriodInput from '@/features/personalCareer/components/interactions/inputs/DeclaredExperiencePeriodInput/DeclaredExperiencePeriodInput.vue'
import DeclaredExperienceSourceOfInformationInput from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceSourceOfInformationInput/DeclaredExperienceSourceOfInformationInput.vue'
import DeclaredExperienceSummaryTextarea from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceSummaryTextarea/DeclaredExperienceSummaryTextarea.vue'
import DeclaredExperienceTitleInput from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceTitleInput/DeclaredExperienceTitleInput.vue'
import DeclaredExperienceTypeSelect from '@/features/personalCareer/components/interactions/inputs/DeclaredExperienceTypeSelect/DeclaredExperienceTypeSelect.vue'
import DeclaredExperienceDetails, {
  type DeclaredExperienceDetailedProps,
} from '@/features/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetails/DeclaredExperienceDetails.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    }),
  }
})

const mockedDeclaredExperienceDetails: DeclaredExperienceViewDTO = {
  id: 'experience-1',
  title: 'My experience title',
  experienceType: 'PROFESSIONAL' as any,
  organization: 'My organization',
  activitySector: 'IT',
  location: 'Paris',
  description: 'My experience description',
  summary: 'My experience summary',
  sourceOfInformation: 'My source',
  externalLink: 'https://example.com',
  startDate: '2026-01-10',
  endDate: '2026-01-20',
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-02T10:00:00Z',
  declaredExperienceAssociationCountDTO: {
    traceAssociationsCount: 3,
    declaredSkillAssociationsCount: 1
  }
}

const mockedDeclaredExperienceDetailsWithUndefinedOptionalFields: DeclaredExperienceViewDTO = {
  ...mockedDeclaredExperienceDetails,
  description: undefined,
  summary: undefined,
  sourceOfInformation: undefined,
  externalLink: undefined,
  endDate: undefined,
}

const CreationUpdateDateDetailsStub = {
  name: 'CreationUpdateDateDetails',
  props: ['createdAt', 'createdAtPrefix', 'updatedAt'],
  template: `<div class="creation-update-date-details" />`,
}

BddTest().given('the DeclaredExperienceDetails component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceDetails>>
  const stubs = {
    CreationUpdateDateDetails: CreationUpdateDateDetailsStub,
    ValorizedBadge: ValorizedBadgeStub,
  }

  BddTest().and('given a declared experience details dto', () => {
    const props: DeclaredExperienceDetailedProps = {
      declaredExperienceDetails: mockedDeclaredExperienceDetails,
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        mockIsMobile.value = false
        wrapper = mount(DeclaredExperienceDetails, {
          props,
          global: { stubs },
        })
      })

      BddTest().then('it should render the layout containers', () => {
        expect(
          wrapper.find('[data-testid="layout-declared-experience-detailed"]').exists()
        ).toBe(true)

        expect(
          wrapper.find('[data-testid="layout-declared-experience-detailed__main"]').exists()
        ).toBe(true)

        expect(
          wrapper.find('[data-testid="layout-declared-experience-detailed__side"]').exists()
        ).toBe(true)
      })

      BddTest().then('it should render the title', () => {
        const component = wrapper.findComponent(DeclaredExperienceTitleInput)
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.title)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the experience type', () => {
        const component = wrapper.findComponent(DeclaredExperienceTypeSelect)
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toEqual({ itemId: mockedDeclaredExperienceDetails.experienceType })
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the organization', () => {
        const component = wrapper.findComponent(DeclaredExperienceOrganizationInput)
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.organization)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the activity sector', () => {
        const component = wrapper.findComponent(DeclaredExperienceActivitySectorInput)
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.activitySector)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the location', () => {
        const component = wrapper.findComponent(DeclaredExperienceLocationInput)
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.location)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the period input', () => {
        const component = wrapper.findComponent(DeclaredExperiencePeriodInput)
        expect(component.exists()).toBe(true)
        expect(component.props('startModelValue')).toBe(mockedDeclaredExperienceDetails.startDate)
        expect(component.props('endModelValue')).toBe(mockedDeclaredExperienceDetails.endDate)
        expect(component.props('startDateDisabled')).toBe(true)
        expect(component.props('endDateDisabled')).toBe(true)
        expect(component.props('labelVisible')).toBe(true)
      })

      BddTest().then('it should render the source of information', () => {
        const component = wrapper.findComponent(DeclaredExperienceSourceOfInformationInput)
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.sourceOfInformation)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the external link', () => {
        const component = wrapper.findComponent(DeclaredExperienceExternalLinkInput)
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.externalLink)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the description textarea', () => {
        const component = wrapper.findComponent(DeclaredExperienceDescriptionTextarea)
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.description)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the summary textarea', () => {
        const component = wrapper.findComponent(DeclaredExperienceSummaryTextarea)
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.summary)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render CreationUpdateDateDetails with correct props', () => {
        const details = wrapper.findComponent({ name: 'CreationUpdateDateDetails' })
        expect(details.exists()).toBe(true)
        expect(details.props('createdAt')).toBe(mockedDeclaredExperienceDetails.createdAt)
        expect(details.props('updatedAt')).toBe(mockedDeclaredExperienceDetails.updatedAt)
        expect(details.props('createdAtPrefix')).toBe('Expérience')
      })
    })
  })

  BddTest().and('given a valorized experience', () => {
    const props: DeclaredExperienceDetailedProps = {
      declaredExperienceDetails: { ...mockedDeclaredExperienceDetails, valorized: true },
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        mockIsMobile.value = false
        wrapper = mount(DeclaredExperienceDetails, {
          props,
          global: { stubs },
        })
      })

      BddTest().then('it should render ValorizedBadge with valorized true', () => {
        const badge = wrapper.findComponent(ValorizedBadgeStub)
        expect(badge.exists()).toBe(true)
        expect(badge.props('valorized')).toBe(true)
      })
    })
  })

  BddTest().and('given a non valorized experience', () => {
    const props: DeclaredExperienceDetailedProps = {
      declaredExperienceDetails: { ...mockedDeclaredExperienceDetails, valorized: false },
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        mockIsMobile.value = false
        wrapper = mount(DeclaredExperienceDetails, {
          props,
          global: { stubs },
        })
      })

      BddTest().then('it should render ValorizedBadge with valorized false', () => {
        const badge = wrapper.findComponent(ValorizedBadgeStub)
        expect(badge.exists()).toBe(true)
        expect(badge.props('valorized')).toBe(false)
      })
    })
  })

  BddTest().and('given optional fields are undefined', () => {
    const props: DeclaredExperienceDetailedProps = {
      declaredExperienceDetails: mockedDeclaredExperienceDetailsWithUndefinedOptionalFields,
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        mockIsMobile.value = false
        wrapper = mount(DeclaredExperienceDetails, {
          props,
          global: { stubs },
        })
      })

      BddTest().then('it should pass empty strings for undefined optional values', () => {
        expect(wrapper.findComponent(DeclaredExperienceSourceOfInformationInput).props('modelValue')).toBe(undefined)
        expect(wrapper.findComponent(DeclaredExperienceExternalLinkInput).props('modelValue')).toBe(undefined)

        expect(wrapper.findComponent(DeclaredExperienceDescriptionTextarea).props('modelValue')).toBe('')
        expect(wrapper.findComponent(DeclaredExperienceSummaryTextarea).props('modelValue')).toBe('')
      })

      BddTest().then(
        'it should pass an empty endModelValue to PeriodInput when endDate is undefined',
        () => {
          const period = wrapper.findComponent(DeclaredExperiencePeriodInput)
          expect(period.props('endModelValue')).toBe('')
        }
      )
    })
  })
})
