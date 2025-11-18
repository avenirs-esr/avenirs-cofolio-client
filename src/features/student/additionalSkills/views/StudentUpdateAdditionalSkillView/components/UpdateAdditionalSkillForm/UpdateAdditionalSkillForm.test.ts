import { createMockedAdditionalSkillProgressDetailsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { AdditionalSkillLevelRadioButtonSetFormFieldStub } from '@/features/student/additionalSkills/components/interactions/formFields/AdditionalSkillLevelRadioButtonSetFormField/AdditionalSkillLevelRadioButtonSetFormField.stub'
import UpdateAdditionalSkillForm from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/components/UpdateAdditionalSkillForm/UpdateAdditionalSkillForm.vue'
import { AvBadgeStub, AvCancelConfirmButtonsStub, AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockIsFormValid = ref(true)
const mockIsSubmitting = ref(false)

const AvCardStub = {
  name: 'AvCard',
  props: ['borderColor'],
  template: `<div class="av-card"><slot /><slot name="header" /><slot name="footer" /></div>`,
}

const AvInputStub = {
  name: 'AvInput',
  props: ['label', 'labelClass', 'prefixIcon', 'modelValue', 'disabled', 'maxlength', 'isTextarea'],
  template: `<div class="av-input">
    <span class="label">{{ label }}</span>
    <span class="value">{{ modelValue }}</span>
    <slot name="customCaptions" />
  </div>`,
}

const AvIconTextStub = {
  name: 'AvIconText',
  props: ['icon', 'iconColor', 'text', 'textColor', 'inline'],
  template: `<div class="av-icon-text">{{ text }}</div>`,
}

const AdditionalSkillCommentFormFieldStub = {
  name: 'AdditionalSkillCommentFormField',
  props: ['form'],
  template: `<div class="comment-field-stub"></div>`,
}

BddTest().given('an UpdateAdditionalSkillForm component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateAdditionalSkillForm>>
  const onCancel = vi.fn()
  const onSkillUpdated = vi.fn()

  const mockedAdditionalSkillProgressDetails = createMockedAdditionalSkillProgressDetailsDTO('1234')

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsFormValid.value = true
    mockIsSubmitting.value = false
    wrapper = mountComponent(UpdateAdditionalSkillForm, {
      props: {
        additionalSkillProgressDetails: mockedAdditionalSkillProgressDetails,
        onCancel,
        onSkillUpdated,
      },
      global: {
        stubs: {
          AvCard: AvCardStub,
          AvInput: AvInputStub,
          AvBadge: AvBadgeStub,
          AvIcon: AvIconStub,
          AvIconText: AvIconTextStub,
          AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
          AdditionalSkillLevelRadioButtonSetFormField: AdditionalSkillLevelRadioButtonSetFormFieldStub,
          AdditionalSkillCommentFormField: AdditionalSkillCommentFormFieldStub,
        },
      },
      useI18n: true,
      usePinia: true,
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main layout parts', () => {
      expect(wrapper.find('.update-additional-skill-form').exists()).toBe(true)
      expect(wrapper.find('.update-additional-skill-form__content').exists()).toBe(true)
      expect(wrapper.find('.update-additional-skill-form__main').exists()).toBe(true)
      expect(wrapper.find('.update-additional-skill-form__side').exists()).toBe(true)
    })

    BddTest().then('it should display the title input as disabled with the correct value', () => {
      const input = wrapper.find('.av-input .value')
      expect(input.exists()).toBe(true)
      expect(input.text()).toBe(mockedAdditionalSkillProgressDetails.title)
    })

    BddTest().then('it should render level and comment fields', () => {
      expect(wrapper.find('[data-testid="additional-skill-level-form-field"]').exists()).toBe(true)
      expect(wrapper.find('.comment-field-stub').exists()).toBe(true)
    })
  })

  BddTest().when('rendering the reference block', () => {
    BddTest().then('it should display a badge for the type and the path segments chain', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      expect(badges.length).toBeGreaterThan(0)

      const segments = mockedAdditionalSkillProgressDetails.pathSegments
      const iconTexts = wrapper.findAll('.ref--item .av-icon-text')
      expect(iconTexts.length).toBe(Math.max(segments.length - 1, 0))

      const lastSegment = wrapper.findComponent({ name: 'AvBadge', className: 'ref--last-segment' })
      if (segments.length > 0) {
        expect(lastSegment.exists()).toBe(true)
      }
    })
  })

  BddTest().when('rendering dates', () => {
    BddTest().then('it should show created and updated AvIconText if provided', async () => {
      await flushPromises()
      const dateLines = wrapper.findAll('.date-details .av-icon-text')
      expect(dateLines.length).toBeGreaterThanOrEqual(2)
    })
  })

  BddTest().when('clicking on cancel', () => {
    BddTest().then('it should call onCancel prop', async () => {
      const cancelConfirmButtons = wrapper.findComponent(AvCancelConfirmButtonsStub)
      expect(cancelConfirmButtons.exists()).toBe(true)

      await cancelConfirmButtons.vm.$emit('cancel')
      expect(onCancel).toHaveBeenCalledTimes(1)
    })
  })
})
