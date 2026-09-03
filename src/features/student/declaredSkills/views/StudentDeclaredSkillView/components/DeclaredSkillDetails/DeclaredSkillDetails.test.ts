import { createMockedDeclaredSkillProgressDetailsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import {
  type DeclaredSkillProgressDetailsDTO,
  EExternalSkillType
} from '@/api/avenir-esr'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { CreationUpdateDateDetailsStub } from '@/common/components/CreationUpdateDateDetails/CreationUpdateDateDetails.stub'
import { DeclaredSkillRefCardStub } from '@/features/student/declaredSkills/components/cards/DeclaredSkillRefCard/DeclaredSkillRefCard.stub'
import { DECLARED_SKILL_REFLECTION_MAX_LENGTH } from '@/features/student/declaredSkills/config'
import DeclaredSkillDetails, { type DeclaredSkillDetailsProps } from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillDetails/DeclaredSkillDetails.vue'
import { AvBadgeStub, AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { vi } from 'vitest'

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

const mockedDeclaredSkillProgressDetails: DeclaredSkillProgressDetailsDTO = createMockedDeclaredSkillProgressDetailsDTO('declared-skill1')

const mockedDeclaredSkillProgressDetailsWithUndefinedDescription: DeclaredSkillProgressDetailsDTO = {
  ...mockedDeclaredSkillProgressDetails,
  reflection: undefined
}

const AvInputStub = {
  name: 'AvInput',
  props: ['modelValue', 'label', 'placeholder', 'maxlength', 'isTextarea', 'isValid', 'labelVisible', 'disabled', 'required', 'errorMessage'],
  emits: ['update:modelValue'],
  template: `
    <div>
      <label v-if="labelVisible">{{ label }}</label>
      <textarea
        v-if="isTextarea"
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <input
        v-else
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <slot name="maxLengthCaption" :current-value="modelValue" :maxlength="maxlength" />
    </div>
  `
}

const DeclaredSkillLevelBadgeStub = {
  name: 'DeclaredSkillLevelBadge',
  props: ['level'],
  template: '<div class="declared-skill-level-badge" />'
}

BddTest().given('the DeclaredSkillDetails component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredSkillDetails>>

  const props: DeclaredSkillDetailsProps = {
    declaredSkillProgressDetails: mockedDeclaredSkillProgressDetails
  }

  const stubs = {
    AvBadge: AvBadgeStub,
    Card: CardStub,
    AvIcon: AvIconStub,
    AvInput: AvInputStub,
    DeclaredSkillLevelBadge: DeclaredSkillLevelBadgeStub,
    ValorizedBadge: ValorizedBadgeStub,
    DeclaredSkillRefCard: DeclaredSkillRefCardStub,
    CreationUpdateDateDetails: CreationUpdateDateDetailsStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredSkillDetails, { props, global: { stubs } })
    })

    BddTest().then('it should render the declared skill title', () => {
      const titleInput = wrapper.findAllComponents({ name: 'AvInput' })[0]
      expect(titleInput.exists()).toBe(true)
      expect(titleInput.props('modelValue')).toBe(mockedDeclaredSkillProgressDetails.title)
    })

    BddTest().then('it should render the declared skill path segments', () => {
      const pathSegments = wrapper.findAll('[data-testid="declared-skill-ref-card-path-segments"]')
      mockedDeclaredSkillProgressDetails.pathSegments.forEach((_segment, index) => {
        const segment = pathSegments[index]

        expect(segment.text()).toContain(mockedDeclaredSkillProgressDetails.pathSegments[index].libelle)
      })
    })

    BddTest().then('it should render the declared skill type badge', () => {
      const badge = wrapper.find('[data-testid="declared-skill-ref-card-type"]')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe(EExternalSkillType.ROME4)
    })

    BddTest().then('it should render the declared skill reflection', () => {
      const reflectionTextarea = wrapper.findAllComponents({ name: 'AvInput' })[1]
      expect(reflectionTextarea.exists()).toBe(true)
      expect(reflectionTextarea.props('modelValue')).toBe(mockedDeclaredSkillProgressDetails.reflection)
    })

    BddTest().and('the declared skill reflection is undefined', () => {
      const newProps: DeclaredSkillDetailsProps = {
        declaredSkillProgressDetails: mockedDeclaredSkillProgressDetailsWithUndefinedDescription
      }

      beforeEach(async () => {
        vi.clearAllMocks()
        wrapper = mount(DeclaredSkillDetails, { props: newProps, global: { stubs } })
      })

      BddTest().then('it should render an empty declared skill reflection', () => {
        const reflectionTextarea = wrapper.findAllComponents({ name: 'AvInput' })[1]
        expect(reflectionTextarea.exists()).toBe(true)
        expect(reflectionTextarea.props('modelValue')).toBeUndefined()
      })

      BddTest().then('it should set the correct maxLength', () => {
        const reflectionTextarea = wrapper.findComponent({ name: 'DeclaredSkillReflectionInput' })
        const avInput = reflectionTextarea.findComponent({ name: 'AvInput' })
        expect(avInput.props('maxlength')).toBe(DECLARED_SKILL_REFLECTION_MAX_LENGTH)
      })
    })

    BddTest().then('it should render the valorized badge', () => {
      const badge = wrapper.findComponent(ValorizedBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(mockedDeclaredSkillProgressDetails.valorized)
    })
  })
})
