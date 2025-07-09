import type { Meta, StoryFn } from '@storybook/vue3'
import { PageSizes } from '@/ui/config'
import AvPageSizePicker, { type AvPageSizePickerProps } from '@/ui/interaction/picker/AvPageSizePicker/AvPageSizePicker.vue'

/**
 * <h1 class="n1">Picker for number of results per page - <code>AvPageSizePicker</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvPageSizePicker</code> is a component implementing the <code>AvTagPicker</code> and dedicated to selecting the number of results per page.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The pickers for number of results per page consist of an <code>AvTagPicker</code> to which options specific to the number of results per page are assigned.
 *   </span>
 * </p>
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
