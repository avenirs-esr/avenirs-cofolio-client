import type { Meta, StoryFn } from '@storybook/vue3'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'
import AvRichButton, { type AvRichButtonProps } from './AvRichButton.vue'

/**
 * The rich button is an interaction element with an interface enabling the user to perform an action.
 *
 * The `AvRichButton` is an elegant, reusable Vue component designed to simplify the creation of custom rich buttons. It features optional icons and a click manager. It is easy to use, with the flexibility to adapt to different contexts.
 *
 * With a default slot, button content is highly customizable. The `label` property lets you assign the button `title` and `aria-label`.
 */
const meta: Meta<AvRichButtonProps> = {
  title: 'Components/Interaction/Buttons/AvRichButton',
  component: AvRichButton,
  tags: ['autodocs'],
  argTypes: {
    label: {
      type: { name: 'string', required: true },
      control: 'text',
    },
    iconLeft: { control: 'text' },
    iconRight: { control: 'text' },
    customPadding: { control: 'text' },
    onClick: {
      type: { name: 'function' },
      control: false,
      action: 'click'
    },
  },
  args: {
    label: 'Ckick me',
    iconLeft: '',
    iconRight: '',
    customPadding: '1rem'
  },
}

export default meta

const Template: StoryFn<AvRichButtonProps> = args => ({
  components: { AvRichButton, AvVIcon },
  setup () {
    return { args }
  },
  template: `
    <AvRichButton v-bind="args">
      <div class="ellipsis-container" style="display: flex; flex-direction: column; align-items: start;">
        <span class="ellipsis b1-regular">{{ args.label }}</span>
        <span class="ellipsis caption-light">
          Last update on 02/02/2025
        </span>
      </div>
    </AvRichButton>
  `,
})

export const Default = Template.bind({})
Default.args = {}
