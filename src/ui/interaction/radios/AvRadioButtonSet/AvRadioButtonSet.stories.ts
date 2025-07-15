import type { Meta, StoryFn } from '@storybook/vue3'
import AvRadioButton from '@/ui/interaction/radios/AvRadioButton/AvRadioButton.vue'
import AvRadioButtonSet, { type AvRadioButtonSetProps } from '@/ui/interaction/radios/AvRadioButtonSet/AvRadioButtonSet.vue'

/**
 * <h1 class="n1">Radio button set - <code>AvRadioButtonSet</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvRadioButtonSet</code> component implements VueDSFR <code>DsfrRadioButtonSet</code> while automatically managing the addition of
 *     <code>DsfrRadioButton</code> according to the <code>AvRadioButton</code> present in the <code>default</code> slot.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     Radio buttons allow the user to select a single option from a list.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The radio button cannot be used on its own: a minimum of 2 options is required. It is preferable not to select a default option,
 *     so that the user choice is conscious (especially if the choice is mandatory).
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🏅 Documentation on <code>DsfrRadioButtonSet</code> can be found at
 *     <a href="https://vue-ds.fr/composants/DsfrRadioButtonSet" target="_blank" rel="noopener noreferrer">VueDSFR</a>
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">The <code>AvRadioButtonSet</code> component consists of the following elements:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular">A <code>&lt;div&gt;</code> element encompassing the entire radio group.</span></li>
 *   <li><span class="b2-regular">A <code>&lt;fieldset&gt;</code> element containing the radio buttons and associated messages.</span></li>
 *   <li><span class="b2-regular">A legend (<code>legend</code>) defined by the <code>legend</code> prop and customizable with the <code>legend</code> slot.</span></li>
 *   <li><span class="b2-regular">A hint (<code>hint</code>) defined by the <code>hint</code> prop and customizable with the <code>hint</code> slot.</span></li>
 *   <li><span class="b2-regular">A group of individual radio buttons rendered by the <code>AvRadioButton</code>/<code>DsfrRadioButton</code> component.</span></li>
 *   <li><span class="b2-regular">An information, error or validation message, displayed below the group of radio buttons (optional).</span></li>
 * </ul>
 */
const meta: Meta<AvRadioButtonSetProps> = {
  title: 'Components/Interaction/Radios/AvRadioButtonSet',
  component: AvRadioButtonSet,
  tags: ['autodocs'],
  argTypes: {
    name: { type: { name: 'string', required: true }, control: 'text' },
    modelValue: { type: { name: 'string', required: true }, control: 'text' },
    legend: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    small: { control: 'boolean' },
    inline: { control: 'boolean' },
    errorMessage: { control: 'text' },
    validMessage: { control: 'text' },
    hint: { control: 'text' }
  },
  args: {
    name: 'RadioButtonSet',
    modelValue: '1',
    legend: '',
    disabled: false,
    required: false,
    small: false,
    inline: false,
    errorMessage: '',
    validMessage: '',
    hint: ''
  },
}

export default meta

const Template: StoryFn<AvRadioButtonSetProps> = args => ({
  components: { AvRadioButtonSet, AvRadioButton },
  setup () {
    return { args }
  },
  template: `
    <AvRadioButtonSet v-bind="args" v-model="args.modelValue">
      <AvRadioButton value="1">
        <span>First option</span>
      </AvRadioButton>
      <AvRadioButton value="2">
        <span>Second option</span>
      </AvRadioButton>
    </AvRadioButtonSet>
  `,
})

export const Default = Template.bind({})
Default.args = {
  name: 'Default'
}
Default.parameters = {
  docs: {
    source: {
      code: `
        <AvRadioButtonSet v-model="selected">
          <AvRadioButton value="1">
            <span>First option</span>
          </AvRadioButton>
          <AvRadioButton value="2">
            <span>Second option</span>
          </AvRadioButton>
        </AvRadioButtonSet>
      `
    }
  }
}

export const Inline = Template.bind({})
Inline.args = {
  name: 'Inline',
  inline: true
}

export const Disabled = Template.bind({})
Disabled.args = {
  name: 'Disabled',
  disabled: true
}

export const Error = Template.bind({})
Error.args = {
  name: 'Error',
  errorMessage: 'This is an error message'
}

export const SuccessInline = Template.bind({})
SuccessInline.args = {
  name: 'SuccessInline',
  inline: true,
  validMessage: 'This is a sucess message'
}
