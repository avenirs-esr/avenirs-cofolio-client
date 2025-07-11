import type { Meta, StoryFn } from '@storybook/vue3'
import AvCard, { type AvCardProps } from '@/ui/cards/AvCard/AvCard.vue'

/**
 * <h1 class="n1">Cards - <code>AvCard</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvCard</code> card is a component for creating customizable styled containers.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The card is composed of a main <code>div</code> containing a div for the title (slot <code>title</code>),
 *     a generic slot by default, a div for the body (slot <code>body</code>) as well as a div for the footer
 *     (slot <code>footer</code>).
 *   </span>
 * </p>
 */
const meta: Meta<AvCardProps> = {
  title: 'Components/Cards/AvCard',
  component: AvCard,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    borderColor: { control: 'color' },
    titleBackground: { control: 'color' },
    titleHeight: { control: 'text' },
  },
  args: {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--stroke)',
    titleBackground: 'var(--surface-background)',
    titleHeight: undefined,
  },
}

export default meta

const Template: StoryFn<AvCardProps> = args => ({
  components: { AvCard },
  setup () {
    return { args }
  },
  template: `
    <AvCard v-bind="args">
      <template #title>
        <h3 class="n3" style="margin: 0;">Card Title</h3>
      </template>
      <template #body>
        <p class="b2-regular">This is the card body. You can put any content here.</p>
      </template>
      <template #footer>
        <small class="caption-regular">Footer content</small>
      </template>
    </AvCard>
  `,
})

const TemplateDefaultSlot: StoryFn<AvCardProps> = args => ({
  components: { AvCard },
  setup () {
    return { args }
  },
  template: `
    <AvCard v-bind="args">
      <p class="b2-regular">This card uses only the default slot.</p>
    </AvCard>
  `,
})

export const Default = Template.bind({})
Default.args = {}

export const WithCustomColors = Template.bind({})
WithCustomColors.args = {
  backgroundColor: 'var(--surface-background)',
  borderColor: 'var(--other-border-skill-card)',
  titleBackground: 'var(--light-background-primary1)',
  titleHeight: 'var(--dimension-5xl)',
}

export const WithOnlyDefaultSlot = TemplateDefaultSlot.bind({})
WithOnlyDefaultSlot.args = {
  backgroundColor: '#fff4e5',
  borderColor: '#ff9900',
}
