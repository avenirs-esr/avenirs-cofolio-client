import type { Meta, StoryFn } from '@storybook/vue3'
import AvRadioButton, { type AvRadioButtonProps } from '@/ui/interaction/radios/AvRadioButton/AvRadioButton.vue'

/**
 * <h1 class="n1">Radio buttons - <code>AvRadioButton</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvRadioButton</code> is a declarative component used exclusively in the <code>default</code> slot of <code>AvRadioButtonSet</code>.
 *     <code>AvRadioButton</code> allows you to configure a radio button by passing its props (such as <code>value</code>, <code>label</code>,
 *     <code>description</code> and <code>disabled</code>) to the <code>AvRadioButtonSet</code> component without rendering.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     It acts as a proxy component: it exposes information (props) used by <code>AvRadioButtonSet</code> to generate the interface.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🚫 This component does not display anything by itself and should not be used outside <code>AvRadioButtonSet</code>.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">None.</span></p>
 */
const meta: Meta<AvRadioButtonProps> = {
  title: 'Components/Interaction/Radios/AvRadioButton',
  component: AvRadioButton,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    value: 'option1',
    label: 'Choice 1',
    description: 'This is choice 1',
    disabled: false
  },
}

export default meta

const Template: StoryFn<AvRadioButtonProps> = args => ({
  components: { AvRadioButton },
  setup () {
    return { args }
  },
  template: `<AvRadioButton v-bind="args"><span>This is the first choice</span></AvRadioButton>`,
})

export const Default = Template.bind({})
Default.args = {}
Default.parameters = {
  docs: {
    source: {
      code: `
        <AvRadioButton value="option1" label="Choice 1" description="This is choice 1">
          <span>This is the first choice</span>
        </AvRadioButton>`,
    },
  },
}
