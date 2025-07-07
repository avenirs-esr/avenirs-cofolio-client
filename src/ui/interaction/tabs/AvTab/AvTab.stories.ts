import type { Meta, StoryFn } from '@storybook/vue3'
import AvTab, { type AvTabProps } from './AvTab.vue'

/**
 * The `AvTab` is a declarative component used exclusively in the `default` slot of `AvTabs`.
 * `AvTab` allows you to configure a tab by passing its props (such as `title` and `icon`) to the `AvTabs` component without rendering.
 *
 * It acts as a proxy component: it exposes information (props) used by `AvTabs` to generate the interface.
 *
 * 🚫 This component does not display anything by itself and should not be used outside `AvTabs`.
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
