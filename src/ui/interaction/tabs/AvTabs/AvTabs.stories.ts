import type { Meta, StoryFn } from '@storybook/vue3'
import AvTab from '@/ui/interaction/tabs/AvTab/AvTab.vue'
import AvTabs, { type AvTabsProps } from '@/ui/interaction/tabs/AvTabs/AvTabs.vue'

/**
 * The `AvTabs` component implements VueDSFR `DsfrTabs` while automatically managing the addition of `DsfrTabItem` according to the `AvTab` present in the `default` slot.
 *
 * The tab component allows users to navigate different content sections within the same page.
 *
 * The tab system helps to group different contents together in a limited space, and allows dense content to be divided into individually accessible sections to make reading easier for the user.
 *
 * 🏅 Documentation on `DsfrTabs` can be found at [VueDSFR](https://vue-ds.fr/composants/DsfrTabs)
 */
const meta: Meta<AvTabsProps> = {
  title: 'Components/Interaction/Tabs/AvTabs',
  component: AvTabs,
  tags: ['autodocs'],
  argTypes: {
    ariaLabel: { control: 'text' },
    modelValue: {
      type: { name: 'number', required: true },
      control: 'number',
    },
  },
  args: {
    ariaLabel: 'Tabs switcher',
  },
}

export default meta

const Template: StoryFn<AvTabsProps> = args => ({
  components: { AvTabs, AvTab },
  setup () {
    return { args }
  },
  template: `
    <AvTabs v-model="activeTab">
      <AvTab
        title="Tab 1"
        icon="mdi:format-list-bulleted"
      >
        <span>First tab content</span>
      </AvTab>
      <AvTab
        title="Tab 2"
        icon="mdi:calendar-month-outline"
      >
        <span>Second tab content</span>
      </AvTab>
    </AvTabs>
  `,
})

export const Default = Template.bind({})
Default.args = {}
Default.parameters = {
  docs: {
    source: {
      code: `
        <AvTabs v-model="activeTab">
          <AvTab
            title="Tab 1"
            icon="mdi:format-list-bulleted"
          >
            <span>First tab content</span>
          </AvTab>
          <AvTab
            title="Tab 2"
            icon="mdi:calendar-month-outline"
          >
            <span>Second tab content</span>
          </AvTab>
        </AvTabs>
      `
    }
  }
}
