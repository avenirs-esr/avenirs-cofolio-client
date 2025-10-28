import type {
  AdditionalSkillProgressDetailsDTO
} from '@/api/avenir-esr'
import { createMockedAdditionalSkillProgressDetailsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import AdditionalSkillDetails, { type AdditionalSkillDetailsProps } from '@/features/student/views/StudentAdditionalSkillView/components/AdditionalSkillDetails/AdditionalSkillDetails.vue'
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

const mockedAdditionalSkillProgressDetails: AdditionalSkillProgressDetailsDTO = createMockedAdditionalSkillProgressDetailsDTO('additional-skill1')

const mockedAdditionalSkillProgressDetailsWithUndefinedDescription: AdditionalSkillProgressDetailsDTO = {
  ...mockedAdditionalSkillProgressDetails,
  description: undefined
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
      <slot name="customCaptions" :current-value="modelValue" :maxlength="maxlength" />
    </div>
  `
}

const AvCardStub = {
  name: 'AvCard',
  props: ['borderColor', 'titleBackground'],
  template: `
    <div class="av-card">
      <slot />
    </div>
  `
}

const AdditionalSkillLevelBadgeStub = {
  name: 'AdditionalSkillLevelBadge',
  props: ['level'],
  template: '<div class="additional-skill-level-badge" />'
}

BddTest().given('the AdditionalSkillDetails component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdditionalSkillDetails>>

  const props: AdditionalSkillDetailsProps = {
    additionalSkillProgressDetails: mockedAdditionalSkillProgressDetails
  }

  const stubs = {
    AvBadge: AvBadgeStub,
    AvCard: AvCardStub,
    AvIcon: AvIconStub,
    AvInput: AvInputStub,
    AdditionalSkillLevelBadge: AdditionalSkillLevelBadgeStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AdditionalSkillDetails, { props, global: { stubs } })
    })

    BddTest().then('it should render the additional skill title', () => {
      const titleInput = wrapper.findAllComponents({ name: 'AvInput' })[0]
      expect(titleInput.exists()).toBe(true)
      expect(titleInput.props('modelValue')).toBe(mockedAdditionalSkillProgressDetails.title)
    })

    BddTest().then('it should render the additional skill path segments', () => {
      const pathSegments = wrapper.findAll('.ref--item')
      mockedAdditionalSkillProgressDetails.pathSegments.forEach((_segment, index) => {
        const avIconText = pathSegments[index].findComponent({ name: 'AvIconText' })
        const avBadge = pathSegments[index].findComponent({ name: 'AvBadge' })
        expect(avIconText.exists()).toBe(index < mockedAdditionalSkillProgressDetails.pathSegments.length - 1)
        expect(avBadge.exists()).toBe(index === mockedAdditionalSkillProgressDetails.pathSegments.length - 1)

        if (avIconText.exists()) {
          expect(avIconText.props('text')).toContain(mockedAdditionalSkillProgressDetails.pathSegments[index].libelle)
        }
        else if (avBadge.exists()) {
          expect(avBadge.props('label')).toContain(mockedAdditionalSkillProgressDetails.pathSegments[index].libelle)
        }
      })
    })

    BddTest().then('it should render the additional skill type badge', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      const typeBadge = badges.find(badge => badge.props('label') === `Rome 4.0`)
      expect(typeBadge).toBeDefined()
    })

    BddTest().then('it should render the additional skill comment', () => {
      const commentTextarea = wrapper.findAllComponents({ name: 'AvInput' })[1]
      expect(commentTextarea.exists()).toBe(true)
      expect(commentTextarea.props('modelValue')).toBe(mockedAdditionalSkillProgressDetails.description)
    })

    BddTest().and('the additional skill comment is undefined', () => {
      const newProps: AdditionalSkillDetailsProps = {
        additionalSkillProgressDetails: mockedAdditionalSkillProgressDetailsWithUndefinedDescription
      }

      beforeEach(async () => {
        vi.clearAllMocks()
        wrapper = mount(AdditionalSkillDetails, { props: newProps, global: { stubs } })
      })

      BddTest().then('it should render an empty additional skill comment', () => {
        const commentTextarea = wrapper.findAllComponents({ name: 'AvInput' })[1]
        expect(commentTextarea.exists()).toBe(true)
        expect(commentTextarea.props('modelValue')).toBeUndefined()
      })

      BddTest().then('it should render the correct character count caption', () => {
        const commentTextarea = wrapper.findAllComponents({ name: 'AvInput' })[1]
        expect(commentTextarea.text()).toContain(`0 / ${commentTextarea.props('maxlength')}`)
      })
    })
  })
})
