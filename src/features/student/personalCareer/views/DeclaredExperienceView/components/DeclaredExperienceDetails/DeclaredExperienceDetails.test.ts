import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import DeclaredExperienceDetails, {
  type DeclaredExperienceDetailedProps,
} from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetails/DeclaredExperienceDetails.vue'
import {
  AvInputStub,
  AvPeriodInputStub,
  BddTest,
} from '@avenirs-esr/avenirs-dsav/test-utils'
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
    AvInput: AvInputStub,
    AvPeriodInput: AvPeriodInputStub,
    CreationUpdateDateDetails: CreationUpdateDateDetailsStub,
  }

  function findAvInputs () {
    return wrapper.findAllComponents({ name: 'AvInput' })
  }

  function findAvSelects () {
    return wrapper.findAllComponents({ name: 'AvSelect' })
  }

  function findPeriodInput () {
    return wrapper.findComponent({ name: 'AvPeriodInput' })
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
        const titleInput = findAvInputs()[0]
        expect(titleInput.exists()).toBe(true)
        expect(titleInput.props('modelValue')).toBe(
          mockedDeclaredExperienceDetails.title
        )
        expect(titleInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the experience type', () => {
        const typeInput = findAvSelects()[0]
        expect(typeInput.exists()).toBe(true)
        expect(typeInput.props('modelValue')).toBe(
          mockedDeclaredExperienceDetails.experienceType
        )
        expect(typeInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the organization', () => {
        const organizationInput = findAvInputs()[1]
        expect(organizationInput.exists()).toBe(true)
        expect(organizationInput.props('modelValue')).toBe(
          mockedDeclaredExperienceDetails.organization
        )
        expect(organizationInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the location', () => {
        const locationInput = findAvInputs()[2]
        expect(locationInput.exists()).toBe(true)
        expect(locationInput.props('modelValue')).toBe(
          mockedDeclaredExperienceDetails.location
        )
        expect(locationInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the activity sector', () => {
        const activitySectorInput = findAvInputs()[3]
        expect(activitySectorInput.exists()).toBe(true)
        expect(activitySectorInput.props('modelValue')).toBe(
          mockedDeclaredExperienceDetails.activitySector
        )
        expect(activitySectorInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the period with AvPeriodInput', () => {
        const period = findPeriodInput()
        expect(period.exists()).toBe(true)

        expect(period.props('startModelValue')).toBe(
          mockedDeclaredExperienceDetails.startDate
        )
        expect(period.props('endModelValue')).toBe(
          mockedDeclaredExperienceDetails.endDate
        )

        expect(period.props('startDateDisabled')).toBe(true)
        expect(period.props('endDateDisabled')).toBe(true)
        expect(period.props('stacked')).toBe(false)
      })

      BddTest().then('it should render the source of information', () => {
        const sourceInput = findAvInputs()[4]
        expect(sourceInput.exists()).toBe(true)
        expect(sourceInput.props('modelValue')).toBe(
          mockedDeclaredExperienceDetails.sourceOfInformation
        )
        expect(sourceInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the external link', () => {
        const linkInput = findAvInputs()[5]
        expect(linkInput.exists()).toBe(true)
        expect(linkInput.props('modelValue')).toBe(
          mockedDeclaredExperienceDetails.externalLink
        )
        expect(linkInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the description textarea', () => {
        const descriptionInput = findAvInputs()[6]
        expect(descriptionInput.exists()).toBe(true)
        expect(descriptionInput.props('modelValue')).toBe(
          mockedDeclaredExperienceDetails.description
        )
        expect(descriptionInput.props('isTextarea')).toBe(true)
        expect(descriptionInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the review textarea', () => {
        const reviewInput = findAvInputs()[7]
        expect(reviewInput.exists()).toBe(true)
        expect(reviewInput.props('modelValue')).toBe(
          mockedDeclaredExperienceDetails.summary
        )
        expect(reviewInput.props('isTextarea')).toBe(true)
        expect(reviewInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render CreationUpdateDateDetails with correct props', () => {
        const details = wrapper.findComponent({
          name: 'CreationUpdateDateDetails',
        })

        expect(details.exists()).toBe(true)
        expect(details.props('createdAt')).toBe(
          mockedDeclaredExperienceDetails.createdAt
        )
        expect(details.props('updatedAt')).toBe(
          mockedDeclaredExperienceDetails.updatedAt
        )
        expect(details.props('createdAtPrefix')).toBe('Expérience')
      })
    })
  })

  BddTest().and('given optional fields are undefined', () => {
    const props: DeclaredExperienceDetailedProps = {
      declaredExperienceDetails:
      mockedDeclaredExperienceDetailsWithUndefinedOptionalFields,
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

      BddTest().then('it should render empty optional values', () => {
        const inputs = findAvInputs()

        expect(inputs[4].props('modelValue')).toBe(undefined)
        expect(inputs[5].props('modelValue')).toBe(undefined)
        expect(inputs[6].props('modelValue')).toBe('')
        expect(inputs[7].props('modelValue')).toBe('')
      })

      BddTest().then(
        'it should pass an empty endModelValue to AvPeriodInput when endDate is undefined',
        () => {
          const period = findPeriodInput()
          expect(period.props('endModelValue')).toBe('')
        }
      )
    })
  })

  BddTest().and('given mobile layout', () => {
    const props: DeclaredExperienceDetailedProps = {
      declaredExperienceDetails: mockedDeclaredExperienceDetails,
    }

    BddTest().when('isMobile is true', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        mockIsMobile.value = true
        wrapper = mount(DeclaredExperienceDetails, {
          props,
          global: { stubs },
        })
      })

      BddTest().then('it should set AvPeriodInput stacked to true', () => {
        const period = findPeriodInput()
        expect(period.exists()).toBe(true)
        expect(period.props('stacked')).toBe(true)
      })
    })
  })
})
