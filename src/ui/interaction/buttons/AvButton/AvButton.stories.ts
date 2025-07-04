import type { Meta, StoryFn } from '@storybook/vue3'
import AvButton, { type AvButtonProps } from './AvButton.vue'

/**
 * TODO Description
 */
const meta: Meta<AvButtonProps> = {
  title: 'Components/Interaction/Buttons/AvButton',
  component: AvButton,
  argTypes: {
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
    iconOnly: {
      control: 'boolean',
    },
    iconRight: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    noRadius: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Ckick me',
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

export const Outlined = Template.bind({})
Outlined.args = {
  variant: 'OUTLINED',
}

export const DefaultSecondary = Template.bind({})
DefaultSecondary.args = {
  theme: 'SECONDARY',
}

export const OutlinedSecondary = Template.bind({})
OutlinedSecondary.args = {
  variant: 'OUTLINED',
  theme: 'SECONDARY',
}

export const Loading = Template.bind({})
Loading.args = {
  isLoading: true,
}

export const IconOnly = Template.bind({})
IconOnly.args = {
  iconOnly: true,
  icon: 'mdi:settings',
  label: 'Settings',
}

export const IconRight = Template.bind({})
IconRight.args = {
  iconRight: true,
  icon: 'mdi:arrow-right-thin',
  label: 'See all',
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
}
