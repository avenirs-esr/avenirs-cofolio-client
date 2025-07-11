import type { Meta, StoryFn } from '@storybook/vue3'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'
import AvRichButton, { type AvRichButtonProps } from '@/ui/interaction/buttons/AvRichButton/AvRichButton.vue'

/**
 * <h1 class="n1">Rich buttons - <code>AvRichButton</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The rich button is an interaction element with an interface enabling the user to perform an action.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvRichButton</code> is an elegant, reusable Vue component designed to simplify the creation of custom rich buttons.
 *     It features optional icons and a click manager. It is easy to use, with the flexibility to adapt to different contexts.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     With a default slot, button content is highly customizable. The <code>label</code> property lets you assign the button <code>title</code> and <code>aria-label</code>.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">Rich buttons consist of a button composed of :</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular">an optional left icon</span></li>
 *   <li><span class="b2-regular">a default slot for button content</span></li>
 *   <li><span class="b2-regular">an optional right icon</span></li>
 * </ul>
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
    customPadding: 'var(--spacing-sm)'
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
