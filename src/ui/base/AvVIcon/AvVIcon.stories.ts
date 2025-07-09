import type { Meta, StoryFn } from '@storybook/vue3'
import AvVIcon, { type AvVIconProps } from '@/ui/base/AvVIcon/AvVIcon.vue'

/**
 * <h1 class="n1">Icons - <code>AvVIcon</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvVIcon</code> component places a <code>VIcon</code> in a square <code>div</code> of configurable size.
 *     It's a Vue.js component for displaying icons with a wide range of customization options, including animations, colors, and sizes.
 *     It's designed to be flexible and performant, with support for various display options, flip options, and accessible titles.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     It has exactly the same API as OhVueIcon, and uses <code>@iconify/vue</code> under the hood.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     <strong>⚠️ Icon names must be those from </strong>
 *     <a href="https://icon-sets.iconify.design/" target="_blank" rel="noopener noreferrer">Iconify-vue</a>
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🏅 The documentation for the <code>VIcon</code> can be found at
 *     <a href="https://vue-ds.fr/composants/VIcon" target="_blank" rel="noopener noreferrer">VueDSFR</a>
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The icon is composed of a square <code>div</code> of configurable size containing the <code>VIcon</code> component.
 *   </span>
 * </p>
 */
const meta: Meta<AvVIconProps> = {
  title: 'Components/Base/AvVIcon',
  component: AvVIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Name of the icon (from VIcon naming convention)',
      type: { name: 'string', required: true },
    },
    size: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.25 },
      description: 'Size in rem of the container and icon scale',
    },
    verticalAlign: { control: 'text' },
    animation: {
      control: 'select',
      options: ['spin', 'wrench', 'pulse', 'spin-pulse', 'flash', 'float', undefined],
    },
    speed: {
      control: 'radio',
      options: ['fast', 'slow', undefined],
    },
    flip: {
      control: 'radio',
      options: ['horizontal', 'vertical', 'both', undefined],
    },
    color: { control: 'color' },
    inverse: { control: 'boolean' },
    label: { control: 'text' },
    title: { control: 'text' },
    ssr: { control: 'boolean' },
  },
  args: {
    name: 'mdi:check',
    size: 2,
    verticalAlign: '-0.2em',
    animation: undefined,
    speed: undefined,
    flip: undefined,
    color: '#000000',
    inverse: false,
    label: 'Check icon',
    title: 'Check',
    ssr: true,
  },
}

export default meta

const Template: StoryFn<AvVIconProps> = args => ({
  components: { AvVIcon },
  setup () {
    return { args }
  },
  template: `<AvVIcon v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}

export const Animated = Template.bind({})
Animated.args = {
  name: 'mdi:loading',
  animation: 'spin',
  speed: 'fast',
  title: 'Loading',
}
