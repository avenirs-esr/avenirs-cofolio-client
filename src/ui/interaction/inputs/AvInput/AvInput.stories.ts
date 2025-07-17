import type { Meta, StoryFn } from '@storybook/vue3'
import AvInput, { type AvInputProps } from '@/ui/interaction/inputs/AvInput/AvInput.vue'

/**
 * <h1 class="n1">Inputs - <code>AvInput</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The input component provides a standardized way to collect user input in forms and interfaces.
 *     It supports various input types, validation states, and accessibility features to ensure a consistent user experience.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvInput</code> component offers flexible configuration options including text inputs, textareas, validation states,
 *     labels, hints, and error messages. It's designed to be fully accessible and follows modern form design patterns.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     It features proper focus management, keyboard navigation, and screen reader support while maintaining visual consistency
 *     with the design system's styling tokens.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">The input component consists of the following elements:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular"><strong>Label:</strong> (optional) Descriptive text that identifies the purpose of the input</span></li>
 *   <li><span class="b2-regular"><strong>Hint:</strong> (optional) Additional guidance text displayed below the label</span></li>
 *   <li><span class="b2-regular"><strong>Input Field:</strong> The main input element that accepts user input</span></li>
 *   <li><span class="b2-regular"><strong>Validation Messages:</strong> (optional) Error or success messages displayed below the input</span></li>
 * </ul>
 *
 * <p><span class="b2-regular">The input integrates:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular">Support for both input and textarea elements</span></li>
 *   <li><span class="b2-regular">Validation state styling (valid, invalid, disabled)</span></li>
 *   <li><span class="b2-regular">Accessibility attributes and proper labeling</span></li>
 *   <li><span class="b2-regular">Responsive design and consistent spacing</span></li>
 * </ul>
 */
const meta: Meta<AvInputProps> = {
  title: 'Components/Interaction/Inputs/AvInput',
  component: AvInput,
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    descriptionId: { control: 'text' },
    hint: { control: 'text' },
    isValid: { control: 'boolean' },
    isTextarea: { control: 'boolean' },
    labelVisible: { control: 'boolean' },
    label: { control: 'text' },
    labelClass: { control: 'text' },
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'datetime-local', 'month', 'time', 'week', 'color', 'file', 'hidden', 'range']
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    maxlength: { control: 'number' },
    minlength: { control: 'number' },
    errorMessage: { control: 'text' },
    validMessage: { control: 'text' },
    prefixIcon: {
      control: 'select',
      options: [
        undefined,
        'mdi:account-circle-outline',
        'mdi:magnify',
        'mdi:email-outline',
        'mdi:lock-outline',
        'mdi:phone-outline',
        'mdi:calendar-outline',
        'mdi:map-marker-outline'
      ]
    }
  },
  args: {
    label: 'Input Label',
    placeholder: 'Enter text here...',
    labelVisible: true,
    type: 'text',
    disabled: false,
    required: false,
    isValid: false,
    isTextarea: false,
    prefixIcon: undefined
  }
}

export default meta

const Template: StoryFn<AvInputProps> = args => ({
  components: { AvInput },
  setup () {
    const inputValue = ref(args.modelValue || '')

    return {
      args,
      inputValue
    }
  },
  template: `
    <AvInput
      v-bind="args"
      v-model="inputValue"
    />
    <p style="margin-top: 1rem; color: var(--text2);">
      Current value: {{ inputValue }}
    </p>
  `
})

export const Default = Template.bind({})
Default.args = {}

export const WithHint = Template.bind({})
WithHint.args = {
  hint: 'This is a helpful hint about what to enter'
}

export const Required = Template.bind({})
Required.args = {
  required: true,
  hint: 'This field is required'
}

export const Valid = Template.bind({})
Valid.args = {
  isValid: true,
  validMessage: 'This field is valid'
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  modelValue: 'This input is disabled'
}

export const Email = Template.bind({})
Email.args = {
  type: 'email',
  label: 'Email Address',
  placeholder: 'Enter your email address'
}

export const Password = Template.bind({})
Password.args = {
  type: 'password',
  label: 'Password',
  placeholder: 'Enter your password'
}

export const Textarea = Template.bind({})
Textarea.args = {
  isTextarea: true,
  label: 'Message',
  placeholder: 'Enter your message here...',
  hint: 'Please provide detailed information'
}

export const WithoutLabel = Template.bind({})
WithoutLabel.args = {
  labelVisible: false,
  label: 'Hidden Label',
  placeholder: 'Label is hidden but still accessible'
}

export const WithMaxLength = Template.bind({})
WithMaxLength.args = {
  maxlength: 50,
  label: 'Limited Input',
  hint: 'Maximum 50 characters allowed'
}

export const MultipleErrors = Template.bind({})
MultipleErrors.args = {
  isValid: false,
  errorMessage: ['This field is required', 'Must be at least 8 characters long']
}

export const MultipleValidMessages = Template.bind({})
MultipleValidMessages.args = {
  isValid: true,
  validMessage: ['Password strength: Strong', 'All requirements met']
}

export const WithPrefixIcon = Template.bind({})
WithPrefixIcon.args = {
  label: 'Search',
  placeholder: 'Search for something...',
  prefixIcon: 'mdi:magnify'
}

export const EmailWithIcon = Template.bind({})
EmailWithIcon.args = {
  type: 'email',
  label: 'Email Address',
  placeholder: 'Enter your email',
  prefixIcon: 'mdi:email-outline'
}

export const PasswordWithIcon = Template.bind({})
PasswordWithIcon.args = {
  type: 'password',
  label: 'Password',
  placeholder: 'Enter your password',
  prefixIcon: 'mdi:lock-outline'
}

export const PhoneWithIcon = Template.bind({})
PhoneWithIcon.args = {
  type: 'tel',
  label: 'Phone Number',
  placeholder: 'Enter your phone number',
  prefixIcon: 'mdi:phone-outline'
}

export const PrefixIconWithValidation = Template.bind({})
PrefixIconWithValidation.args = {
  label: 'Username',
  placeholder: 'Enter your username',
  prefixIcon: 'mdi:account-circle-outline',
  errorMessage: 'Username is required'
}

export const PrefixIconDisabled = Template.bind({})
PrefixIconDisabled.args = {
  label: 'Search',
  placeholder: 'Search is disabled',
  prefixIcon: 'mdi:magnify',
  disabled: true
}

export const NumberInput = Template.bind({})
NumberInput.args = {
  type: 'number',
  label: 'Age',
  placeholder: 'Enter your age'
}

export const SearchInput = Template.bind({})
SearchInput.args = {
  type: 'search',
  label: 'Search',
  placeholder: 'Search for items...',
  prefixIcon: 'mdi:magnify'
}

export const UrlInput = Template.bind({})
UrlInput.args = {
  type: 'url',
  label: 'Website URL',
  placeholder: 'https://example.com'
}
