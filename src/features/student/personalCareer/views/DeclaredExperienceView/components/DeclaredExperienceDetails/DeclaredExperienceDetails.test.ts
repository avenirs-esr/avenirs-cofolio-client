import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { CreationUpdateDateDetailsStub } from '@/common/components/CreationUpdateDateDetails/CreationUpdateDateDetails.stub'
import { DatePeriodPickerStub } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.stub'
import { DeclaredExperienceActivitySectorInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceActivitySectorInput/DeclaredExperienceActivitySectorInput.stub'
import { DeclaredExperienceDescriptionTextareaStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceDescriptionTextarea/DeclaredExperienceDescriptionTextarea.stub'
import { DeclaredExperienceExternalLinkInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceExternalLinkInput/DeclaredExperienceExternalLinkInput.stub'
import { DeclaredExperienceLocationInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceLocationInput/DeclaredExperienceLocationInput.stub'
import { DeclaredExperienceOrganizationInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceOrganizationInput/DeclaredExperienceOrganizationInput.stub'
import { DeclaredExperienceResultInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceResultInput/DeclaredExperienceResultInput.stub'
import { DeclaredExperienceSourceOfInformationInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSourceOfInformationInput/DeclaredExperienceSourceOfInformationInput.stub'
import { DeclaredExperienceSummaryTextareaStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSummaryTextarea/DeclaredExperienceSummaryTextarea.stub'
import { DeclaredExperienceTitleInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTitleInput/DeclaredExperienceTitleInput.stub'
import { DeclaredExperienceTypeSelectStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTypeSelect/DeclaredExperienceTypeSelect.stub'
import DeclaredExperienceDetails, {
  type DeclaredExperienceDetailedProps,
} from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetails/DeclaredExperienceDetails.vue'
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
  result: 'validation',
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

const mockedDeclaredExperienceDetailsValorized: DeclaredExperienceViewDTO = {
  ...mockedDeclaredExperienceDetails,
  valorized: true
}

const mockedDeclaredExperienceDetailsUnvalorized: DeclaredExperienceViewDTO = {
  ...mockedDeclaredExperienceDetails,
  valorized: false
}

const mockedDeclaredExperienceDetailsWithUndefinedOptionalFields: DeclaredExperienceViewDTO = {
  ...mockedDeclaredExperienceDetails,
  description: undefined,
  summary: undefined,
  result: undefined,
  sourceOfInformation: undefined,
  externalLink: undefined,
  endDate: undefined,
}

BddTest().given('the DeclaredExperienceDetails component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceDetails>>

  const stubs = {
    CreationUpdateDateDetails: CreationUpdateDateDetailsStub,
    DatePeriodPicker: DatePeriodPickerStub,
    DeclaredExperienceActivitySectorInput: DeclaredExperienceActivitySectorInputStub,
    DeclaredExperienceDescriptionTextarea: DeclaredExperienceDescriptionTextareaStub,
    DeclaredExperienceExternalLinkInput: DeclaredExperienceExternalLinkInputStub,
    DeclaredExperienceLocationInput: DeclaredExperienceLocationInputStub,
    DeclaredExperienceOrganizationInput: DeclaredExperienceOrganizationInputStub,
    DeclaredExperienceResultInput: DeclaredExperienceResultInputStub,
    DeclaredExperienceSourceOfInformationInput: DeclaredExperienceSourceOfInformationInputStub,
    DeclaredExperienceSummaryTextarea: DeclaredExperienceSummaryTextareaStub,
    DeclaredExperienceTitleInput: DeclaredExperienceTitleInputStub,
    DeclaredExperienceTypeSelect: DeclaredExperienceTypeSelectStub,
    ValorizedBadge: ValorizedBadgeStub,
  }

  const mountWith = (props: Partial<DeclaredExperienceDetailedProps> = {}, isMobile: boolean = false) => {
    vi.clearAllMocks()
    mockIsMobile.value = isMobile
    wrapper = mount(DeclaredExperienceDetails, {
      props: {
        declaredExperienceDetails: mockedDeclaredExperienceDetails,
        ...props
      },
      global: { stubs },
    })
  }

  const getActivitySectorInput = () => wrapper.findComponent(DeclaredExperienceActivitySectorInputStub)
  const getCreationUpdateDateDetails = () => wrapper.findComponent(CreationUpdateDateDetailsStub)
  const getDatePeriodPicker = () => wrapper.findComponent(DatePeriodPickerStub)
  const getDescriptionTextarea = () => wrapper.findComponent(DeclaredExperienceDescriptionTextareaStub)
  const getExternalLinkInput = () => wrapper.findComponent(DeclaredExperienceExternalLinkInputStub)
  const getLayout = () => wrapper.find('[data-testid="layout-declared-experience-detailed"]')
  const getLayoutMain = () => wrapper.find('[data-testid="layout-declared-experience-detailed__main"]')
  const getLayoutMainWrapper = () => wrapper.find('[data-testid="layout-declared-experience-detailed__main-wrapper"]')
  const getLayoutSide = () => wrapper.find('[data-testid="layout-declared-experience-detailed__side"]')
  const getLocationInput = () => wrapper.findComponent(DeclaredExperienceLocationInputStub)
  const getOrganizationInput = () => wrapper.findComponent(DeclaredExperienceOrganizationInputStub)
  const getResultInput = () => wrapper.findComponent(DeclaredExperienceResultInputStub)
  const getSourceOfInformationInput = () => wrapper.findComponent(DeclaredExperienceSourceOfInformationInputStub)
  const getSummaryTextarea = () => wrapper.findComponent(DeclaredExperienceSummaryTextareaStub)
  const getTitleInput = () => wrapper.findComponent(DeclaredExperienceTitleInputStub)
  const getTypeSelect = () => wrapper.findComponent(DeclaredExperienceTypeSelectStub)
  const getValorizedBadge = () => wrapper.findComponent(ValorizedBadgeStub)

  BddTest().and('given a declared experience details dto', () => {
    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        mountWith()
      })

      BddTest().then('it should render the layout containers', () => {
        expect(getLayout().exists()).toBe(true)
        expect(getLayoutMain().exists()).toBe(true)
        expect(getLayoutSide().exists()).toBe(true)
      })

      BddTest().then('it should render the title', () => {
        const component = getTitleInput()
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.title)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the experience type', () => {
        const component = getTypeSelect()
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toEqual({ itemId: mockedDeclaredExperienceDetails.experienceType })
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the organization', () => {
        const component = getOrganizationInput()
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.organization)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the activity sector', () => {
        const component = getActivitySectorInput()
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.activitySector)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the location', () => {
        const component = getLocationInput()
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.location)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the period with DatePeriodPicker', () => {
        const datePeriodPicker = getDatePeriodPicker()
        expect(datePeriodPicker.exists()).toBe(true)
        expect(datePeriodPicker.props('startDate')).toBe(mockedDeclaredExperienceDetails.startDate)
        expect(datePeriodPicker.props('endDate')).toBe(mockedDeclaredExperienceDetails.endDate)
        expect(datePeriodPicker.props('isOngoing')).toBe(false)
        expect(datePeriodPicker.props('disabled')).toBe(true)
        expect(datePeriodPicker.props('type')).toBe('month')
      })

      BddTest().then('it should render the source of information', () => {
        const component = getSourceOfInformationInput()
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.sourceOfInformation)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the external link', () => {
        const component = getExternalLinkInput()
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.externalLink)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the description textarea', () => {
        const component = getDescriptionTextarea()
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.description)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the summary textarea', () => {
        const component = getSummaryTextarea()
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.summary)
        expect(component.props('disabled')).toBe(true)
      })

      BddTest().then('it should render CreationUpdateDateDetails with correct props', () => {
        const details = getCreationUpdateDateDetails()
        expect(details.exists()).toBe(true)
        expect(details.props('createdAt')).toBe(mockedDeclaredExperienceDetails.createdAt)
        expect(details.props('updatedAt')).toBe(mockedDeclaredExperienceDetails.updatedAt)
        expect(details.props('createdAtPrefix')).toBe('Expérience')
      })

      BddTest().then('it should render the result', () => {
        const component = getResultInput()
        expect(component.exists()).toBe(true)
        expect(component.props('modelValue')).toBe(mockedDeclaredExperienceDetails.result)
        expect(component.props('disabled')).toBe(true)
      })
    })
  })

  BddTest().and('given a valorized experience', () => {
    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        mountWith({ declaredExperienceDetails: mockedDeclaredExperienceDetailsValorized })
      })

      BddTest().then('it should render ValorizedBadge with valorized true', () => {
        const badge = getValorizedBadge()
        expect(badge.exists()).toBe(true)
        expect(badge.props('valorized')).toBe(true)
      })
    })
  })

  BddTest().and('given a non valorized experience', () => {
    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        mountWith({ declaredExperienceDetails: mockedDeclaredExperienceDetailsUnvalorized })
      })

      BddTest().then('it should render ValorizedBadge with valorized false', () => {
        const badge = getValorizedBadge()
        expect(badge.exists()).toBe(true)
        expect(badge.props('valorized')).toBe(false)
      })
    })
  })

  BddTest().and('given optional fields are undefined', () => {
    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        mountWith({ declaredExperienceDetails: mockedDeclaredExperienceDetailsWithUndefinedOptionalFields })
      })

      BddTest().then('it should pass empty strings for undefined optional values', () => {
        expect(getSourceOfInformationInput().props('modelValue')).toBe(undefined)
        expect(getExternalLinkInput().props('modelValue')).toBe(undefined)
        expect(getResultInput().props('modelValue')).toBe(undefined)

        expect(getDescriptionTextarea().props('modelValue')).toBe('')
        expect(getSummaryTextarea().props('modelValue')).toBe('')
      })

      BddTest().then('it should pass an undefined endDate and ongoing mode when endDate is undefined', () => {
        const period = getDatePeriodPicker()
        expect(period.exists()).toBe(true)
        expect(period.props('endDate')).toBeUndefined()
        expect(period.props('isOngoing')).toBe(true)
      })
    })
  })

  BddTest().and('the layout row and valorized badge are disabled', () => {
    beforeEach(() => {
      mountWith({ hideValorizedBadge: true, disableRowLayout: true })
    })

    BddTest().then('it should hide the valorized badge', () => {
      expect(getValorizedBadge().exists()).toBe(false)
    })

    BddTest().then('it should disable the row layout', () => {
      expect(getLayoutMainWrapper().classes()).not.toContain('av-row--md')
    })
  })
})
