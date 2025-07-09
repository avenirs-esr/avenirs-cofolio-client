import type { Meta, StoryFn } from '@storybook/vue3'
import AvButton from '@/ui/interaction/buttons/AvButton/AvButton.vue'
import AvPopover, { type AvPopoverProps } from '@/ui/overlay/popovers/AvPopover/AvPopover.vue'

/**
 * <h1 class="n1">Popovers - <code>AvPopover</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The popover is a contextual container that is displayed as an overlay near its trigger element.
 *     This component can be used to display additional content or interactions, without leaving the current page or completely obscuring its context.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvPopover</code> component is designed to offer accessible, ergonomic content,
 *     by trapping the focus inside the popover when it's open, and managing closure via the Escape key.
 *     It offers great flexibility via dedicated trigger (<code>trigger</code>) and content (<code>popover</code>) slots,
 *     allowing any content or interaction to be inserted.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     It uses a dynamic positioning system to display itself in the right place in relation to its trigger,
 *     while guaranteeing good keyboard control and a good user experience.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">The popover consists of the following elements:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular">The trigger (slot <code>trigger</code>), mandatory: Interactive element (for example, a button) that opens or closes the popover.</span></li>
 *   <li><span class="b2-regular">The content (slot <code>popover</code>), mandatory: Content area that can contain text, buttons, lists or any other interactive element. This zone is displayed close to the trigger and captures the focus when opened.</span></li>
 * </ul>
 *
 * <p><span class="b2-regular">The popover integrates :</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular">Focus trap for keyboard accessibility.</span></li>
 *   <li><span class="b2-regular">Close by pressing the Escape key or clicking outside the popover.</span></li>
 * </ul>
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
