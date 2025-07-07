import type { StoryFn } from '@storybook/vue3'
import AvTagPicker, { type AvTagPickerProps } from './AvTagPicker.vue'

/**
 * The `AvTagPicker` is a Vue component enabling a user to select an element from a given set. Selectable elements consist of `DsfrTag`.
 *
 * The `DsfrTag` list provides a list of options from which the user can choose.
 */
const meta = {
  title: 'Components/Interaction/Pickers/AvTagPicker',
  component: AvTagPicker,
  tags: ['autodocs'],
  argTypes: {
    options: {
      type: { name: 'AvTagPickerOption[]', required: true },
      control: false,
    },
    label: {
      type: { name: 'string' },
      control: 'text',
    },
    labelColor: {
      type: { name: 'string' },
      control: 'text',
    },
    labelTypographyClass: {
      type: { name: 'string' },
      control: 'text',
    },
    multiple: {
      type: { name: 'boolean' },
      control: 'boolean',
    },
    selected: {
      type: { name: 'AvTagPickerOption | AvTagPickerOption[]' },
      control: false,
    },
    handleSelectChange: {
      type: { name: 'function', required: true },
      control: false,
      action: 'select-change'
    },
  },
  args: {
    label: 'Pick:',
  },
}

export default meta

const Template: StoryFn<AvTagPickerProps> = args => ({
  components: { AvTagPicker },
  setup () {
    return { args }
  },
  template: `<AvTagPicker v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {
  label: 'Pick one:',
  labelColor: 'var(--text2)',
  labelTypographyClass: 'b2-regular',
  multiple: false,
  options: [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ],
  selected: { label: 'Option B', value: 'b' },
}

export const Multiple = Template.bind({})
Multiple.args = {
  label: 'Pick many:',
  labelColor: 'var(--text2)',
  labelTypographyClass: 'b2-regular',
  multiple: true,
  options: [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ],
  selected: [
    { label: 'Option A', value: 'a' },
    { label: 'Option C', value: 'c' },
  ],
}
