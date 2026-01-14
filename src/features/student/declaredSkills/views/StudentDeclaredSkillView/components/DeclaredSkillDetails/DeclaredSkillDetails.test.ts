import type {
  DeclaredSkillProgressDetailsDTO
} from '@/api/avenir-esr'
import { createMockedDeclaredSkillProgressDetailsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { DECLARED_SKILL_COMMENT_MAX_LENGTH } from '@/features/student/declaredSkills/config'
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
    AvCard: AvCardStub,
    AvIcon: AvIconStub,
    AvInput: AvInputStub,
    DeclaredSkillLevelBadge: DeclaredSkillLevelBadgeStub
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
      const pathSegments = wrapper.findAll('.ref__item')
      mockedDeclaredSkillProgressDetails.pathSegments.forEach((_segment, index) => {
        const avIconText = pathSegments[index].findComponent({ name: 'AvIconText' })
        const avBadge = pathSegments[index].findComponent({ name: 'AvBadge' })
        expect(avIconText.exists()).toBe(index < mockedDeclaredSkillProgressDetails.pathSegments.length - 1)
        expect(avBadge.exists()).toBe(index === mockedDeclaredSkillProgressDetails.pathSegments.length - 1)

        if (avIconText.exists()) {
          expect(avIconText.props('text')).toContain(mockedDeclaredSkillProgressDetails.pathSegments[index].libelle)
        }
        else if (avBadge.exists()) {
          expect(avBadge.props('label')).toContain(mockedDeclaredSkillProgressDetails.pathSegments[index].libelle)
        }
      })
    })

    BddTest().then('it should render the declared skill type badge', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      const typeBadge = badges.find(badge => badge.props('label') === `Rome 4.0`)
      expect(typeBadge).toBeDefined()
    })

    BddTest().then('it should render the declared skill comment', () => {
      const commentTextarea = wrapper.findAllComponents({ name: 'AvInput' })[1]
      expect(commentTextarea.exists()).toBe(true)
      expect(commentTextarea.props('modelValue')).toBe(mockedDeclaredSkillProgressDetails.description)
    })

    BddTest().and('the declared skill comment is undefined', () => {
      const newProps: DeclaredSkillDetailsProps = {
        declaredSkillProgressDetails: mockedDeclaredSkillProgressDetailsWithUndefinedDescription
      }

      beforeEach(async () => {
        vi.clearAllMocks()
        wrapper = mount(DeclaredSkillDetails, { props: newProps, global: { stubs } })
      })

      BddTest().then('it should render an empty declared skill comment', () => {
        const commentTextarea = wrapper.findAllComponents({ name: 'AvInput' })[1]
        expect(commentTextarea.exists()).toBe(true)
        expect(commentTextarea.props('modelValue')).toBeUndefined()
      })

      BddTest().then('it should set the correct maxLength', () => {
        const commentTextarea = wrapper.findComponent({ name: 'DeclaredSkillCommentInput' })
        const avInput = commentTextarea.findComponent({ name: 'AvInput' })
        expect(avInput.props('maxlength')).toBe(DECLARED_SKILL_COMMENT_MAX_LENGTH)
      })
    })
  })
})
