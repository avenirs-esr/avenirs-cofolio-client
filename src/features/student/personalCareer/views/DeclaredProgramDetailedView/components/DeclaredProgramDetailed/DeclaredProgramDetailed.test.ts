import type { DeclaredProgramDetailedDTO } from '@/api/avenir-esr'
import { declaredProgramDetailedDTOFixture } from '@/__mocks__/fixtures/student'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { CreationUpdateDateDetailsStub } from '@/common/components/CreationUpdateDateDetails/CreationUpdateDateDetails.stub'
import { DatePeriodPickerStub } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.stub'
import DeclaredProgramDescriptionTextarea from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramDescriptionTextarea/DeclaredProgramDescriptionTextarea.vue'
import DeclaredProgramOrganizationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramOrganizationInput/DeclaredProgramOrganizationInput.vue'
import DeclaredProgramResultInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramResultInput/DeclaredProgramResultInput.vue'
import DeclaredProgramSourceOfInformationInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramSourceOfInformationInput/DeclaredProgramSourceOfInformationInput.vue'
import DeclaredProgramTitleInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramTitleInput/DeclaredProgramTitleInput.vue'
import DeclaredProgramDetailed, {
  type DeclaredProgramDetailedProps,
} from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const TITLE_LABEL = 'Intitulé de ma formation déclarée'
const RESULT_LABEL = 'Résultat obtenu'
const DESCRIPTION_LABEL = 'Description de ma formation déclarée'

BddTest().given('the DeclaredProgramDetailed component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramDetailed>>

  const stubs = {
    CreationUpdateDateDetails: CreationUpdateDateDetailsStub,
    DatePeriodPicker: DatePeriodPickerStub,
    ValorizedBadge: ValorizedBadgeStub,
  }

  const mountWith = (props: Partial<DeclaredProgramDetailedProps> = {}) => {
    wrapper = mount(DeclaredProgramDetailed, {
      props: {
        declaredProgramDetailed: declaredProgramDetailedDTOFixture,
        ...props,
      },
      global: { stubs }
    })
  }

  const getCreationUpdateDateDetails = () => wrapper.findComponent({ name: 'CreationUpdateDateDetails' })
  const getDatePeriodPicker = () => wrapper.findComponent(DatePeriodPickerStub)
  const getOrganizationInput = () => wrapper.findComponent(DeclaredProgramOrganizationInput)
  const getResultInput = () => wrapper.findComponent(DeclaredProgramResultInput)
  const getSourceOfInformationInput = () => wrapper.findComponent(DeclaredProgramSourceOfInformationInput)
  const getTitleInput = () => wrapper.findComponent(DeclaredProgramTitleInput)
  const getValorizedBadge = () => wrapper.findComponent(ValorizedBadgeStub)
  const getDescriptionInput = () => wrapper.findComponent(DeclaredProgramDescriptionTextarea)

  const getLayout = () => wrapper.find('[data-testid="layout-declared-program-detailed"]')
  const getLayoutMain = () => wrapper.find('[data-testid="layout-declared-program-detailed__main"]')
  const getLayoutSide = () => wrapper.find('[data-testid="layout-declared-program-detailed__side"]')

  BddTest().and('given a declared program detailed dto', () => {
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
        const titleInput = getTitleInput()
        expect(titleInput.exists()).toBe(true)
        expect(titleInput.props('label')).toBe(TITLE_LABEL)
        expect(titleInput.props('modelValue')).toBe(declaredProgramDetailedDTOFixture.title)
        expect(titleInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the organization', () => {
        const organizationInput = getOrganizationInput()
        expect(organizationInput.exists()).toBe(true)
        expect(organizationInput.props('modelValue')).toBe(declaredProgramDetailedDTOFixture.organization)
        expect(organizationInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the period with DatePeriodPicker', () => {
        const period = getDatePeriodPicker()
        expect(period.exists()).toBe(true)
        expect(period.props('labelClass')).toBe('caption-regular')
        expect(period.props('startDate')).toBe(declaredProgramDetailedDTOFixture.startDate)
        expect(period.props('endDate')).toBe(declaredProgramDetailedDTOFixture.endDate)
        expect(period.props('isOngoing')).toBe(false)
        expect(period.props('disabled')).toBe(true)
        expect(period.props('type')).toBe('month')
      })

      BddTest().then('it should render the result', () => {
        const resultInput = getResultInput()
        expect(resultInput.exists()).toBe(true)
        expect(resultInput.props('label')).toBe(RESULT_LABEL)
        expect(resultInput.props('modelValue')).toBe(declaredProgramDetailedDTOFixture.result)
        expect(resultInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the source of information', () => {
        const sourceInput = getSourceOfInformationInput()
        expect(sourceInput.exists()).toBe(true)
        expect(sourceInput.props('modelValue')).toBe(declaredProgramDetailedDTOFixture.sourceOfInformation)
        expect(sourceInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render the description in a textarea', () => {
        const descriptionInput = getDescriptionInput()
        expect(descriptionInput.exists()).toBe(true)
        expect(descriptionInput.props('label')).toBe(DESCRIPTION_LABEL)
        expect(descriptionInput.props('modelValue')).toBe(declaredProgramDetailedDTOFixture.description)
        expect(descriptionInput.props('disabled')).toBe(true)
      })

      BddTest().then('it should render CreationUpdateDateDetails with correct props', () => {
        const details = getCreationUpdateDateDetails()
        expect(details.exists()).toBe(true)
        expect(details.props('createdAt')).toBe(declaredProgramDetailedDTOFixture.createdAt)
        expect(details.props('updatedAt')).toBe(declaredProgramDetailedDTOFixture.updatedAt)
      })
    })
  })

  BddTest().and('given a valorized program', () => {
    BddTest().when('the component is mounted', () => {
      const declaredProgramDetailed: DeclaredProgramDetailedDTO = {
        ...declaredProgramDetailedDTOFixture,
        valorized: true,
      }

      beforeEach(() => {
        mountWith({ declaredProgramDetailed })
      })

      BddTest().then('it should render ValorizedBadge with valorized true', () => {
        const badge = getValorizedBadge()
        expect(badge.exists()).toBe(true)
        expect(badge.props('valorized')).toBe(true)
      })
    })
  })

  BddTest().and('given a non valorized program', () => {
    BddTest().when('the component is mounted', () => {
      const declaredProgramDetailed: DeclaredProgramDetailedDTO = {
        ...declaredProgramDetailedDTOFixture,
        valorized: false,
      }

      beforeEach(() => {
        mountWith({ declaredProgramDetailed })
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
      const declaredProgramDetailed: DeclaredProgramDetailedDTO = {
        ...declaredProgramDetailedDTOFixture,
        description: undefined,
        result: undefined,
        sourceOfInformation: undefined,
        endDate: undefined,
      }

      beforeEach(() => {
        mountWith({ declaredProgramDetailed })
      })

      BddTest().then('it should render empty optional values', () => {
        expect(getDescriptionInput().props('modelValue')).toBe('')
        expect(getResultInput().props('modelValue')).toBe('')
        expect(getSourceOfInformationInput().props('modelValue')).toBe('')
      })

      BddTest().then('it should pass an undefined endDate and ongoing mode when endDate is undefined', () => {
        const period = getDatePeriodPicker()
        expect(period.exists()).toBe(true)
        expect(period.props('startDate')).toBe(declaredProgramDetailed.startDate)
        expect(period.props('endDate')).toBeUndefined()
        expect(period.props('isOngoing')).toBe(true)
      })
    })
  })
})
