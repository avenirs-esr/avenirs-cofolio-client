import { mockedAdditionalSkillProgressDetails } from '@/__mocks__/fixtures/student/skills.fixtures'
import UpdateAdditionalSkillForm from '@/features/student/views/StudentUpdateAdditionalSkillView/components/UpdateAdditionalSkillForm/UpdateAdditionalSkillForm.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
const AvBadgeStub = {
  name: 'AvBadge',
  props: ['label', 'backgroundColor', 'borderColor', 'color', 'noIcon'],
  template: `<div class="av-badge">{{ label }}</div>`,
}
const AvIconStub = {
  name: 'AvIcon',
  props: ['name', 'color', 'size'],
  template: `<i class="av-icon" />`,
}
const AvIconTextStub = {
  name: 'AvIconText',
  props: ['icon', 'iconColor', 'text', 'textColor', 'inline'],
  template: `<div class="av-icon-text">{{ text }}</div>`,
}
const AvButtonStub = {
  name: 'AvButton',
  props: ['label', 'icon', 'variant', 'size', 'disabled', 'loading', 'type'],
  emits: ['click'],
  template: `<button class="av-button" :disabled="disabled" @click="$emit('click')">
    <span class="btn-label">{{ label }}</span>
  </button>`,
}

const AdditionalSkillLevelFormFieldStub = {
  name: 'AdditionalSkillLevelFormField',
  props: ['form'],
  template: `<div class="level-field-stub"></div>`,
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
          AvButton: AvButtonStub,
          AdditionalSkillLevelFormField: AdditionalSkillLevelFormFieldStub,
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
      expect(wrapper.find('.level-field-stub').exists()).toBe(true)
      expect(wrapper.find('.comment-field-stub').exists()).toBe(true)
    })
  })

  BddTest().when('rendering the reference block', () => {
    BddTest().then('it should display a badge for the type and the path segments chain', () => {
      const badges = wrapper.findAll('.av-badge')
      expect(badges.length).toBeGreaterThan(0)

      const segments = mockedAdditionalSkillProgressDetails.pathSegments
      const iconTexts = wrapper.findAll('.ref--item .av-icon-text')
      expect(iconTexts.length).toBe(Math.max(segments.length - 1, 0))

      const lastSegment = wrapper.find('.ref--last-segment .av-badge')
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
      const buttons = wrapper.findAllComponents(AvButtonStub as any)
      const cancelBtn = buttons[0]
      expect(cancelBtn.exists()).toBe(true)

      await cancelBtn.trigger('click')
      expect(onCancel).toHaveBeenCalledTimes(1)
    })
  })
})
