import type { DeclaredProgramDetailedDTO } from '@/api/avenir-esr'
import DeclaredProgramDescriptionTextarea from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramDescriptionTextarea/DeclaredProgramDescriptionTextarea.vue'
import DeclaredProgramOrganizationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramOrganizationInput/DeclaredProgramOrganizationInput.vue'
import DeclaredProgramResultInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramResultInput/DeclaredProgramResultInput.vue'
import DeclaredProgramSourceOfInformationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramSourceOfInformationInput/DeclaredProgramSourceOfInformationInput.vue'
import DeclaredProgramTitleInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramTitleInput/DeclaredProgramTitleInput.vue'
import DeclaredProgramDetailed, { type DeclaredProgramDetailedProps } from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.vue'
import { AvPeriodInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    })
  }
})

const mockedDeclaredProgramDetailed: DeclaredProgramDetailedDTO = {
  id: 'program-1',
  status: undefined,
  title: 'My program title',
  description: 'My program description',
  organization: 'My organization',
  result: 'My result',
  sourceOfInformation: 'My source',
  link: undefined,
  startDate: '2026-01-10',
  endDate: '2026-01-20',
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-02T10:00:00Z',
}

const mockedDeclaredProgramDetailedWithUndefinedOptionalFields: DeclaredProgramDetailedDTO = {
  ...mockedDeclaredProgramDetailed,
  description: undefined,
  result: undefined,
  sourceOfInformation: undefined,
  endDate: undefined,
}

const CreationUpdateDateDetailsStub = {
  name: 'CreationUpdateDateDetails',
  props: ['createdAt', 'createdAtPrefix', 'updatedAt'],
  template: `<div class="creation-update-date-details" />`,
}

BddTest().given('the DeclaredProgramDetailed component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramDetailed>>

  const stubs = {
    AvPeriodInput: AvPeriodInputStub,
    CreationUpdateDateDetails: CreationUpdateDateDetailsStub,
  }

  function findPeriodInput () {
    return wrapper.findComponent({ name: 'AvPeriodInput' })
  }

  BddTest().and('given a declared program detailed dto', () => {
    const props: DeclaredProgramDetailedProps = {
      declaredProgramDetailed: mockedDeclaredProgramDetailed
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        mockIsMobile.value = false
        wrapper = mount(DeclaredProgramDetailed, { props, global: { stubs } })
      })

      BddTest().then('it should render the layout containers', () => {
        expect(wrapper.find('[data-testid="layout-declared-program-detailed"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="layout-declared-program-detailed__main"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="layout-declared-program-detailed__side"]').exists()).toBe(true)
      })

      BddTest().then('it should render the title', () => {
        const titleInput = wrapper.findComponent(DeclaredProgramTitleInput)
        expect(titleInput.exists()).toBe(true)
        expect(titleInput.props('label')).toBe('Intitulé de ma formation déclarée')
        expect(titleInput.props('modelValue')).toBe(mockedDeclaredProgramDetailed.title)
        expect(titleInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the organization', () => {
        const organizationInput = wrapper.findComponent(DeclaredProgramOrganizationInput)
        expect(organizationInput.exists()).toBe(true)
        expect(organizationInput.props('modelValue')).toBe(mockedDeclaredProgramDetailed.organization)
        expect(organizationInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the period with AvPeriodInput', () => {
        const period = findPeriodInput()
        expect(period.exists()).toBe(true)

        expect(period.props('label')).toBe('Période')
        expect(period.props('labelClass')).toBe('caption-regular')

        expect(period.props('startLabel')).toBe('Start date')
        expect(period.props('endLabel')).toBe('End date')

        expect(period.props('startModelValue')).toBe(mockedDeclaredProgramDetailed.startDate)
        expect(period.props('endModelValue')).toBe(mockedDeclaredProgramDetailed.endDate)

        expect(period.props('startDateDisabled')).toBe(true)
        expect(period.props('endDateDisabled')).toBe(true)
        expect(period.props('stacked')).toBe(false)
        expect(period.props('separatorSpacing')).toBe('var(--spacing-sm)')
      })

      BddTest().then('it should render the result', () => {
        const resultInput = wrapper.findComponent(DeclaredProgramResultInput)
        expect(resultInput.exists()).toBe(true)
        expect(resultInput.props('label')).toBe('Résultat obtenu')
        expect(resultInput.props('modelValue')).toBe(mockedDeclaredProgramDetailed.result)
        expect(resultInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the source of information', () => {
        const sourceInput = wrapper.findComponent(DeclaredProgramSourceOfInformationInput)
        expect(sourceInput.exists()).toBe(true)
        expect(sourceInput.props('modelValue')).toBe(mockedDeclaredProgramDetailed.sourceOfInformation)
        expect(sourceInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the description in a textarea', () => {
        const descriptionInput = wrapper.findComponent(DeclaredProgramDescriptionTextarea)
        expect(descriptionInput.exists()).toBe(true)
        expect(descriptionInput.props('label')).toBe('Description de ma formation déclarée')
        expect(descriptionInput.props('modelValue')).toBe(mockedDeclaredProgramDetailed.description)
        expect(descriptionInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render CreationUpdateDateDetails with correct props', () => {
        const details = wrapper.findComponent({ name: 'CreationUpdateDateDetails' })
        expect(details.exists()).toBe(true)
        expect(details.props('createdAt')).toBe(mockedDeclaredProgramDetailed.createdAt)
        expect(details.props('updatedAt')).toBe(mockedDeclaredProgramDetailed.updatedAt)

        expect(details.props('createdAtPrefix')).toBe(
          'Formation'
        )
      })
    })
  })

  BddTest().and('given optional fields are undefined', () => {
    const props: DeclaredProgramDetailedProps = {
      declaredProgramDetailed: mockedDeclaredProgramDetailedWithUndefinedOptionalFields
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        mockIsMobile.value = false
        wrapper = mount(DeclaredProgramDetailed, { props, global: { stubs } })
      })

      BddTest().then('it should render empty optional values', () => {
        expect(wrapper.findComponent(DeclaredProgramDescriptionTextarea).props('modelValue')).toBe('')
        expect(wrapper.findComponent(DeclaredProgramResultInput).props('modelValue')).toBe('')
        expect(wrapper.findComponent(DeclaredProgramSourceOfInformationInput).props('modelValue')).toBe('')
      })

      BddTest().then('it should pass an empty endModelValue to AvPeriodInput when endDate is undefined', () => {
        const period = wrapper.findComponent({ name: 'AvPeriodInput' })
        expect(period.exists()).toBe(true)
        expect(period.props('startModelValue')).toBe(props.declaredProgramDetailed.startDate)
        expect(period.props('endModelValue')).toBe('')
      })
    })
  })

  BddTest().and('given mobile layout', () => {
    const props: DeclaredProgramDetailedProps = {
      declaredProgramDetailed: mockedDeclaredProgramDetailed
    }

    BddTest().when('isMobile is true', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        mockIsMobile.value = true
        wrapper = mount(DeclaredProgramDetailed, { props, global: { stubs } })
      })

      BddTest().then('it should set AvPeriodInput stacked to true', () => {
        const period = wrapper.findComponent({ name: 'AvPeriodInput' })
        expect(period.exists()).toBe(true)
        expect(period.props('stacked')).toBe(true)
      })
    })
  })
})
