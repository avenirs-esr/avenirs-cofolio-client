import type { Meta, StoryFn } from '@storybook/vue3'
import AvAccordion from '@/ui/interaction/accordions/AvAccordion/AvAccordion.vue'

/**
 * <h1 class="n1">Accordions - <code>AvAccordions</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvAccordion</code> is a declarative component used exclusively in the <code>default</code> slot of
 *     <code>AvAccordionsGroup</code>.
 *     <code>AvAccordion</code> allows you to configure an accordion by passing its props (such as <code>title</code> and <code>icon</code>)
 *     to the <code>AvAccordionsGroup</code> component without rendering.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     It acts as a proxy component: it exposes information (props) used by <code>AvAccordionsGroup</code> to generate the interface.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🚫 This component does not display anything by itself and should not be used outside <code>AvAccordion</code>.
 *   </span>
 * </p>
 */
const meta: Meta = {
  title: 'Components/Interaction/Accordions/AvAccordions',
  component: AvAccordion,
  tags: ['autodocs'],
}

export default meta

const Template: StoryFn = () => ({
  components: { AvAccordion },
  setup () {
    return { }
  },
  template: `<AvAccordion v-bind="args"><span>Some content</span></AvAccordion>`,
})

export const Default = Template.bind({})
Default.args = {}
Default.parameters = {
  docs: {
    source: {
      code: `
        <AvAccordion title="Accordion 1">
          <span>Some content</span>
        </AvAccordion>`,
    },
  },
}
