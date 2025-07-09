import type { Meta, StoryFn } from '@storybook/vue3'
import AvTab, { type AvTabProps } from '@/ui/interaction/tabs/AvTab/AvTab.vue'

/**
 * <h1 class="n1">Tabs - <code>AvTab</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvTab</code> is a declarative component used exclusively in the <code>default</code> slot of <code>AvTabs</code>.
 *     <code>AvTab</code> allows you to configure a tab by passing its props (such as <code>title</code> and <code>icon</code>)
 *     to the <code>AvTabs</code> component without rendering.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     It acts as a proxy component: it exposes information (props) used by <code>AvTabs</code> to generate the interface.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🚫 This component does not display anything by itself and should not be used outside <code>AvTabs</code>.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">None.</span></p>
 */
const meta: Meta<AvTabProps> = {
  title: 'Components/Interaction/Tabs/AvTab',
  component: AvTab,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    icon: { control: 'text' },
  },
  args: {
    title: 'Tab 1',
    icon: ''
  },
}

export default meta

const Template: StoryFn<AvTabProps> = args => ({
  components: { AvTab },
  setup () {
    return { args }
  },
  template: `<AvTab v-bind="args"><span>Some content</span></AvTab>`,
})

export const Default = Template.bind({})
Default.args = {}
Default.parameters = {
  docs: {
    source: {
      code: `
        <AvTab title="Tab 1">
          <span>Some content</span>
        </AvTab>`,
    },
  },
}
