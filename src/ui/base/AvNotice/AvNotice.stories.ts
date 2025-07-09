import type { Meta, StoryFn } from '@storybook/vue3'
import AvNotice, { type AvNoticeProps } from '@/ui/base/AvNotice/AvNotice.vue'
import { DsfrNotice } from '@gouvminint/vue-dsfr'

/**
 * <h1 class="n1">Important information banner - <code>AvNotice</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvNotice</code> is a component implementing the VueDSFR <code>DsfrNotice</code>.
 *     The important information banner allows users to view or access important and temporary information.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     It is displayed on all pages on desktop and mobile devices. It displays important and urgent information
 *     (overuse may cause this banner to "disappear").
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🏅 The documentation on the <code>DsfrNotice</code> can be found at
 *     <a href="https://vue-ds.fr/composants/DsfrNotice" target="_blank" rel="noopener noreferrer">VueDSFR</a>
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">The notice consists of the following elements:</span></p>
 *
 * <ul>
 *   <li>
 *     <span class="b2-regular">A title (prop <code>title</code>, of type <code>string</code>):</span>
 *     <ul>
 *       <li><span class="b2-regular">Optional with a default value <code>''</code></span></li>
 *     </ul>
 *   </li>
 *   <li>
 *     <span class="b2-regular">A text (prop <code>text</code>, of type <code>string</code>):</span>
 *     <ul>
 *       <li><span class="b2-regular">Optional with a default value <code>''</code></span></li>
 *     </ul>
 *   </li>
 *   <li>
 *     <span class="b2-regular">A pictogram and a color determined by the prop <code>type</code>, which can be one of the following strings:</span>
 *     <ul>
 *       <li><span class="b2-regular"><code>'info'</code></span></li>
 *       <li><span class="b2-regular"><code>'warning'</code></span></li>
 *       <li><span class="b2-regular"><code>'alert'</code></span></li>
 *     </ul>
 *   </li>
 *   <li>
 *     <span class="b2-regular">An information icon</span>
 *   </li>
 * </ul>
 */
const meta: Meta<AvNoticeProps> = {
  title: 'Components/Base/AvNotice',
  component: AvNotice,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    text: { control: 'text' },
    type: {
      control: 'radio',
      options: ['info', 'warning', 'alert'],
      description: 'The type of notice',
    },
  },
  args: {
    title: 'Attention',
    text: 'Please **read carefully** the instructions.',
    type: 'warning',
  },
}

export default meta

const Template: StoryFn<AvNoticeProps> = args => ({
  components: { AvNotice, DsfrNotice },
  setup () {
    return { args }
  },
  template: `<AvNotice v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}

export const InfoNotice = Template.bind({})
InfoNotice.args = {
  title: 'Information',
  text: 'This is an **informative message** with underlined parts.',
  type: 'info',
}

export const AlertNotice = Template.bind({})
AlertNotice.args = {
  title: 'Critical alert',
  text: '**Immediate action** is required.',
  type: 'alert',
}
