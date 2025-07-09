import type { StoryFn } from '@storybook/vue3'
import AvTagPicker, { type AvTagPickerProps } from '@/ui/interaction/picker/AvTagPicker/AvTagPicker.vue'

/**
 * <h1 class="n1">Tag picker - <code>AvTagPicker</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvTagPicker</code> is a Vue component enabling a user to select an element from a given set.
 *     Selectable elements consist of <code>DsfrTag</code>.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>DsfrTag</code> list provides a list of options from which the user can choose.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">Buttons consist of :</span></p>
 *
 * <ul>
 *   <li>
 *     <span class="b2-regular">
 *       A label - mandatory, using the <code>label</code> prop, enables label display when <code>iconOnly</code> is <code>false</code>,
 *       also enables connection to <code>title</code> and <code>aria-label</code>;
 *     </span>
 *   </li>
 *   <li>
 *     <span class="b2-regular">
 *       An icon, which can be modified (see available icons) - optional.
 *     </span>
 *   </li>
 * </ul>
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
