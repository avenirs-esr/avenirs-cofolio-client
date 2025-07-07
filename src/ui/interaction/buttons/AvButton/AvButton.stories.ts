import type { Meta, StoryFn } from '@storybook/vue3'
import AvButton, { type AvButtonProps } from './AvButton.vue'

/**
 * The `AvButton` is a component implementing the VueDSFR `DsfrButton`. The button is an interaction element with an interface enabling the user to perform an action.
 *
 * The `AvButton` is an elegant, reusable Vue component designed to simplify the creation of custom buttons. It features adjustable sizes, an optional icon and a click manager, all in keeping with the `DSFR` style. It's easy to use, with the flexibility to adapt to different contexts.
 *
 * For `AVENIR(s) ESR`, the button has been simplified to allow only two variants (`DEFAULT` without border and `OUTLINED` with border) and two themes (`PRIMARY` blue and `SECONDARY` grey).
 */
const meta: Meta<AvButtonProps> = {
  title: 'Components/Interaction/Buttons/AvButton',
  component: AvButton,
  argTypes: {
    label: {
      type: { name: 'string', required: true },
      control: 'text',
    },
    icon: { control: 'text' },
    variant: {
      control: { type: 'radio' },
      options: ['DEFAULT', 'OUTLINED'],
    },
    theme: {
      control: { type: 'radio' },
      options: ['PRIMARY', 'SECONDARY'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'small', 'md', 'medium', 'lg', 'large', '', undefined],
    },
    iconOnly: { control: 'boolean' },
    iconRight: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    noRadius: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: {
      type: { name: 'function' },
      control: false,
      action: 'click'
    },
  },
  args: {
    label: 'Ckick me',
    icon: '',
    variant: 'DEFAULT',
    theme: 'PRIMARY',
    size: 'md',
    iconOnly: false,
    iconRight: false,
    isLoading: false,
    noRadius: false,
    disabled: false,
  },
}

export default meta

const Template: StoryFn<AvButtonProps> = args => ({
  components: { AvButton },
  setup () {
    return { args }
  },
  template: `<AvButton v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}

export const DefaultIconOnly = Template.bind({})
DefaultIconOnly.args = {
  iconOnly: true,
  icon: 'mdi:settings',
  label: 'Settings',
}

export const DefaultLoading = Template.bind({})
DefaultLoading.args = {
  isLoading: true
}

export const DefaultDisabled = Template.bind({})
DefaultDisabled.args = {
  disabled: true
}

export const DefaultNoRadius = Template.bind({})
DefaultNoRadius.args = {
  noRadius: true
}

export const DefaultSecondary = Template.bind({})
DefaultSecondary.args = {
  theme: 'SECONDARY',
}

export const Outlined = Template.bind({})
Outlined.args = {
  variant: 'OUTLINED',
}

export const OutlinedIconOnly = Template.bind({})
OutlinedIconOnly.args = {
  variant: 'OUTLINED',
  iconOnly: true,
  icon: 'mdi:settings',
  label: 'Settings',
}

export const OutlinedLoading = Template.bind({})
OutlinedLoading.args = {
  variant: 'OUTLINED',
  isLoading: true
}

export const OutlinedDisabled = Template.bind({})
OutlinedDisabled.args = {
  variant: 'OUTLINED',
  disabled: true
}

export const OutlinedNoRadius = Template.bind({})
OutlinedNoRadius.args = {
  variant: 'OUTLINED',
  noRadius: true
}

export const OutlinedSecondary = Template.bind({})
OutlinedSecondary.args = {
  variant: 'OUTLINED',
  theme: 'SECONDARY',
}
