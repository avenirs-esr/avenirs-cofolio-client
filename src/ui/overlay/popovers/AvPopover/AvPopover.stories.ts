import type { Meta, StoryFn } from '@storybook/vue3'
import AvButton from '@/ui/interaction/buttons/AvButton/AvButton.vue'
import AvPopover, { type AvPopoverProps } from '@/ui/overlay/popovers/AvPopover/AvPopover.vue'

/**
 * The popover is a contextual container that is displayed as an overlay near its trigger element. This component can be used to display additional content or interactions, without leaving the current page or completely obscuring its context.
 *
 * The `AvPopover` component is designed to offer accessible, ergonomic content, by trapping the focus inside the popover when it's open, and managing closure via the Escape key. It offers great flexibility via dedicated trigger (`trigger`) and content (`popover`) slots, allowing any content or interaction to be inserted.
 *
 * It uses a dynamic positioning system to display itself in the right place in relation to its trigger, while guaranteeing good keyboard control and a good user experience.
 */
const meta: Meta<AvPopoverProps> = {
  title: 'Components/Overlay/Popovers/AvPopover',
  component: AvPopover,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    padding: { control: 'text' },
  },
  args: {
    width: '12.5rem',
    padding: 'var(--spacing-md)',
  },
}

export default meta

const Template: StoryFn<AvPopoverProps> = args => ({
  components: { AvPopover, AvButton },
  setup () {
    return { args }
  },
  template: `
    <AvPopover
      v-bind="args"
    >
      <template #trigger="{ toggle }">
        <AvButton
          label="Open popover"
          :on-click="toggle"
        />
      </template>
      <template #popover>
        <ul style="list-style-type:none; padding: 0; margin: 0;">
          <li>
            <AvButton
              style="width: 100% !important;"
              label="Manage profile"
              icon="mdi:pencil-outline"
              variant="DEFAULT"
              theme="SECONDARY"
              size="sm"
              no-radius
            />
          </li>
          <li>
            <AvButton
              style="width: 100% !important;"
              label="See calendar"
              icon="mdi:calendar-month-outline"
              variant="DEFAULT"
              theme="SECONDARY"
              size="sm"
              no-radius
            />
          </li>
          <li>
            <AvButton
              style="width: 100% !important;"
              label="Go to ENT"
              icon="mdi:arrow-top-right-thick"
              variant="DEFAULT"
              theme="SECONDARY"
              size="sm"
              no-radius
            />
          </li>
          <li>
            <AvButton
              style="width: 100% !important;"
              label="Go to skills"
              icon="mdi:arrow-top-right-thick"
              variant="DEFAULT"
              theme="SECONDARY"
              size="sm"
              no-radius
            />
          </li>
          <li>
            <AvButton
              style="width: 100% !important;"
              label="Logout"
              icon="mdi:logout"
              variant="DEFAULT"
              theme="SECONDARY"
              size="sm"
              no-radius
            />
          </li>
        </ul>
      </template>
    </AvPopover>
  `,
})

export const Default = Template.bind({})
Default.args = {}
Default.parameters = {
  docs: {
    source: {
      code: `
    <AvPopover
      v-bind="args"
    >
      <template #trigger="{ toggle }">
        <AvButton
          label="Open popover"
          :on-click="toggle"
        />
      </template>
      <template #popover>
        <ul style="list-style-type:none; padding: 0; margin: 0;">
          <li>
            <AvButton
              style="width: 100% !important;"
              label="Manage profile"
              icon="mdi:pencil-outline"
              variant="DEFAULT"
              theme="SECONDARY"
              size="sm"
              no-radius
            />
          </li>
          <li>
            <AvButton
              style="width: 100% !important;"
              label="See calendar"
              icon="mdi:calendar-month-outline"
              variant="DEFAULT"
              theme="SECONDARY"
              size="sm"
              no-radius
            />
          </li>
          <li>
            <AvButton
              style="width: 100% !important;"
              label="Go to ENT"
              icon="mdi:arrow-top-right-thick"
              variant="DEFAULT"
              theme="SECONDARY"
              size="sm"
              no-radius
            />
          </li>
          <li>
            <AvButton
              style="width: 100% !important;"
              label="Go to skills"
              icon="mdi:arrow-top-right-thick"
              variant="DEFAULT"
              theme="SECONDARY"
              size="sm"
              no-radius
            />
          </li>
          <li>
            <AvButton
              style="width: 100% !important;"
              label="Logout"
              icon="mdi:logout"
              variant="DEFAULT"
              theme="SECONDARY"
              size="sm"
              no-radius
            />
          </li>
        </ul>
      </template>
    </AvPopover>
  `
    }
  }
}
