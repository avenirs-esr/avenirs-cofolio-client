import type { Meta, StoryFn } from '@storybook/vue3'
import { PageSizes } from '@/ui/config'
import AvPageSizePicker, { type AvPageSizePickerProps } from './AvPageSizePicker.vue'

/**
 * The `AvPageSizePicker` is a component implementing the `AvTagPicker` and dedicated to selecting the number of results per page.
 */
const meta: Meta<AvPageSizePickerProps> = {
  title: 'Components/Interaction/Pickers/AvPageSizePicker',
  component: AvPageSizePicker,
  tags: ['autodocs'],
  argTypes: {
    label: {
      type: { name: 'string', required: true },
      control: 'text',
    },
    pageSizeSelected: {
      type: { name: 'string', required: true },
      control: {
        type: 'select',
        options: Object.values(PageSizes),
      },
    },
    handleSelectChange: {
      type: { name: 'function' },
      control: false,
      action: 'select-change'
    },
  },
  args: {
    label: 'Number of results per page:',
    pageSizeSelected: PageSizes.FOUR,
  },
}

export default meta

const Template: StoryFn<AvPageSizePickerProps> = args => ({
  components: { AvPageSizePicker },
  setup () {
    return { args }
  },
  template: `<AvPageSizePicker v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}
