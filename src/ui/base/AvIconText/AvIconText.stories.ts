import type { Meta, StoryFn } from '@storybook/vue3'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'
import AvIconText, { type AvIconTextProps } from './AvIconText.vue'

const typographyClasses = [
  'n1',
  'n2',
  'n3',
  'n4',
  'n5',
  'n6',
  's1-bold',
  's1-regular',
  's1-light',
  's2-bold',
  's2-regular',
  's2-light',
  'b1-bold',
  'b1-regular',
  'b1-light',
  'b2-bold',
  'b2-regular',
  'b2-light',
  'caption-bold',
  'caption-regular',
  'caption-light'
]

/**
 * <h1 class="n1">Texts with icon - <code>AvIconText</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvIconText</code> is a component that allows you to display text with an icon on the left
 *     (preferably an
 *     <a href="https://icon-sets.iconify.design/mdi/" target="_blank" rel="noopener noreferrer">MDI</a>
 *     icon). This View component is ideal for displaying text with an icon that allows you to visualize
 *     the type of information conveyed by the text.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <ul>
 *   <li>
 *     <span class="b2-regular">The component is a <code>div</code> element composed of an <code>AvVIcon</code> component and a <code>span</code>.</span>
 *   </li>
 *   <li>
 *     <span class="b2-regular">Props allow you to modify the appearance of the icon and text according to the props: color, icon, size, and handling of overly long text.</span>
 *   </li>
 *   <li>
 *     <span class="b2-regular">The <code>label</code> is displayed inside a <code>span</code>, potentially with the <code>ellipsis</code> prop to handle truncated text.</span>
 *   </li>
 * </ul>
 */
const meta: Meta<AvIconTextProps> = {
  title: 'Components/Base/AvIconText',
  component: AvIconText,
  tags: ['autodocs'],
  argTypes: {
    textColor: { control: 'color' },
    iconColor: { control: 'color' },
    icon: {
      control: 'text',
      type: { name: 'string', required: true },
    },
    text: {
      control: 'text',
      type: { name: 'string', required: true },
    },
    typographyClass: {
      control: 'select',
      options: ['', ...typographyClasses]
    },
    gap: { control: 'text' },
    inline: { control: 'boolean' },
  },
  args: {
    textColor: 'var(--text1)',
    iconColor: 'var(--text1)',
    icon: 'mdi:calendar-month',
    text: 'Example text with icon',
    typographyClass: 'b2-regular',
    gap: 'var(--spacing-xxs)',
    inline: false,
  },
}

export default meta

const Template: StoryFn<AvIconTextProps> = args => ({
  components: { AvIconText, AvVIcon },
  setup () {
    return { args }
  },
  template: `
    <AvIconText v-bind="args" />
  `,
})

export const Default = Template.bind({})
Default.args = {}

export const InlineNoEllipsis = Template.bind({})
InlineNoEllipsis.args = {
  text: 'This text will not be truncated because inline is true',
  inline: true,
}

export const CustomColors = Template.bind({})
CustomColors.args = {
  icon: 'mdi:calendar-month',
  text: 'Warning icon with custom colors',
  iconColor: 'var(--dark-background-primary1)',
  textColor: 'var(--dark-background-primary2)',
  typographyClass: 'b1-bold',
  gap: 'var(--spacing-xs)',
}
