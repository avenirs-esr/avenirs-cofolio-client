import type { Meta, StoryFn } from '@storybook/vue3'
import AvTab from '@/ui/interaction/tabs/AvTab/AvTab.vue'
import AvTabs, { type AvTabsProps } from '@/ui/interaction/tabs/AvTabs/AvTabs.vue'

/**
 * <h1 class="n1">Tabs - <code>AvTabs</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvTabs</code> component implements VueDSFR <code>DsfrTabs</code> while automatically managing the addition of <code>DsfrTabItem</code>
 *     according to the <code>AvTab</code> present in the <code>default</code> slot.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The tab component allows users to navigate different content sections within the same page.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The tab system helps to group different contents together in a limited space, and allows dense content to be divided into individually accessible sections to make reading easier for the user.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🏅 Documentation on <code>DsfrTabs</code> can be found at
 *     <a href="https://vue-ds.fr/composants/DsfrTabs" target="_blank" rel="noopener noreferrer">VueDSFR</a>
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">Each tab consists of the following elements:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular">an icon to the left of the title - optional.</span></li>
 *   <li><span class="b2-regular">a clickable title - mandatory: displays the associated content zone.</span></li>
 * </ul>
 *
 * <p>
 *   <span class="b2-regular">
 *     If the number of tabs exceeds the width of the container, a horizontal scroll allows you to navigate between the different tabs.
 *   </span>
 * </p>
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
