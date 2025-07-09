import type { Meta, StoryFn } from '@storybook/vue3'
import AvBadge, { type AvBadgeProps } from '@/ui/badges/AvBadge/AvBadge.vue'

const iconBasePath = '/assets/icons/'
const iconOptions = [
  `${iconBasePath}calendar-check-outline.svg`,
  `${iconBasePath}calendar-clock-outline.svg`,
  `${iconBasePath}calendar-range-outline.svg`,
  `${iconBasePath}check-circle.svg`,
  `${iconBasePath}close-circle-outline.svg`,
  `${iconBasePath}dots-horizontal-circle-outline.svg`,
  `${iconBasePath}hourglass.svg`,
  `${iconBasePath}message-badge.svg`,
  `${iconBasePath}text-box-check-outline.svg`,
  `${iconBasePath}warning-outline.svg`,
]

/**
 * <h1 class="n1">Badges - <code>AvBadge</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvBadge</code> is a component that implements the VueDSFR <code>DsfrBadge</code>.
 *     This Vue component is ideal for displaying short, important information, such as categories, labels, or statuses.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🏅 The documentation for the <code>DsfrBadge</code> can be found at
 *     <a href="https://vue-ds.fr/composants/DsfrBadge" target="_blank" rel="noopener noreferrer">VueDSFR</a>
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <ul>
 *   <li>
 *     <span class="b2-regular">The component is a <code>p</code> element with the <code>fr-badge</code> class.</span>
 *   </li>
 *   <li>
 *     <span class="b2-regular">Props allow you to modify the badge appearance according to the props: color, icon presence, size, and handling of overly long text.</span>
 *   </li>
 *   <li>
 *     <span class="b2-regular">The <code>label</code> is displayed inside a <code>span</code>, potentially with the <code>ellipsis</code> prop and a defined or maximum size to handle truncated text.</span>
 *   </li>
 * </ul>
 */
const meta: Meta<AvBadgeProps> = {
  title: 'Components/Badges/AvBadge',
  component: AvBadge,
  tags: ['autodocs'],
  argTypes: {
    label: {
      type: { name: 'string', required: true },
      control: 'text',
    },
    color: { control: 'color' },
    backgroundColor: { control: 'color' },
    borderColor: { control: 'color' },
    iconPath: {
      control: 'select',
      options: ['', ...iconOptions],
    },
    type: {
      control: 'select',
      options: ['success', 'error', 'new', 'info', 'warning'],
    },
    noIcon: { control: 'boolean' },
    small: { control: 'boolean' },
    ellipsis: { control: 'boolean' },
  },
  args: {
    label: 'A super badge',
    color: 'var(--dark-background-primary1)',
    backgroundColor: 'var(--light-background-primary2)',
    borderColor: '',
    iconPath: '/assets/icons/calendar-clock-outline.svg',
    type: 'info',
    noIcon: false,
    small: false,
    ellipsis: false,
  },
}

export default meta

const Template: StoryFn<AvBadgeProps> = args => ({
  components: { AvBadge },
  setup () {
    return { args }
  },
  template: `
    <AvBadge v-bind="args" />
  `,
})

const TemplateWithWidth: StoryFn<AvBadgeProps> = args => ({
  components: { AvBadge },
  setup () {
    return { args }
  },
  template: `
    <div style="width: 150px">
      <AvBadge v-bind="args" />
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {}

export const WithoutIcon = Template.bind({})
WithoutIcon.args = {
  noIcon: true,
}

export const SmallEllipsis = TemplateWithWidth.bind({})
SmallEllipsis.args = {
  label: 'This is a very long badge label that will be truncated',
  ellipsis: true,
  small: true,
  iconPath: '/assets/icons/calendar-clock-outline.svg',
}

export const StatusNotStarted = Template.bind({})
StatusNotStarted.args = {
  label: 'Not started',
  color: 'var(--text2)',
  backgroundColor: 'var(--other-background-base)',
  borderColor: 'var(--other-border-skill-card)',
  iconPath: '/assets/icons/calendar-clock-outline.svg'
}

export const StatusInProgress = Template.bind({})
StatusInProgress.args = {
  label: 'In progress',
  color: 'var(--dark-background-primary1)',
  backgroundColor: 'var(--light-background-primary2)',
  iconPath: '/assets/icons/calendar-range-outline.svg'
}

export const StatusSubmitted = Template.bind({})
StatusSubmitted.args = {
  label: 'Submitted for evaluation',
  color: 'var(--light-foreground-primary1)',
  backgroundColor: 'var(--light-background-critical)',
  iconPath: '/assets/icons/dots-horizontal-circle-outline.svg'
}

export const StatusCompleted = Template.bind({})
StatusCompleted.args = {
  label: 'Completed',
  color: 'var(--light-foreground-neutral)',
  backgroundColor: 'var(--light-background-neutral)',
  iconPath: '/assets/icons/calendar-check-outline.svg'
}
