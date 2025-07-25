import type { Meta, StoryFn } from '@storybook/vue3'
import AvList from '@/ui/interaction/lists/AvList/AvList.vue'
import { MDI_ICONS } from '@/ui/tokens/icons'
import AvListItem, { type AvListItemProps } from './AvListItem.vue'

/**
 * <h1 class="n1">Lists - <code>AvListItem</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The AvListItem component represents an individual item within a list container. It provides a flexible and accessible way to display content with optional icons, titles, descriptions, and interactive capabilities while maintaining consistent styling and behavior patterns.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvListItem</code> component is designed to work seamlessly within <code>AvList</code> containers, offering extensive customization for various use cases including navigation menus, content lists, action items, and interactive elements. It supports full accessibility compliance with proper ARIA attributes and keyboard navigation.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     It features comprehensive interaction states (hover, focus, active, disabled, selected), flexible content structure with slots, and dynamic tag rendering for different semantic contexts while maintaining visual consistency with the design system.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">The list item consists of the following elements:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular"><strong>Container:</strong> (mandatory) Root wrapper element that can be div, button, or anchor based on usage</span></li>
 *   <li><span class="b2-regular"><strong>Icon:</strong> (optional) Visual indicator displayed on the left side of the content</span></li>
 *   <li><span class="b2-regular"><strong>Content Area:</strong> (mandatory) Contains title, description, and/or custom content</span></li>
 *   <li><span class="b2-regular"><strong>Custom Content Slot:</strong> (optional) Allows insertion of any custom elements within the content area</span></li>
 * </ul>
 *
 * <p><span class="b2-regular">The list item integrates:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular">Dynamic tag rendering for semantic correctness (div, button, a)</span></li>
 *   <li><span class="b2-regular">Full accessibility support with ARIA attributes and keyboard navigation</span></li>
 *   <li><span class="b2-regular">Comprehensive interaction states and visual feedback</span></li>
 *   <li><span class="b2-regular">Flexible content structure with icon, title, description, and slot support</span></li>
 * </ul>
 */
const meta: Meta<AvListItemProps> = {
  title: 'Components/Interaction/Lists/AvListItem',
  component: AvListItem,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: [
        undefined,
        MDI_ICONS.HOME_VARIANT_OUTLINE,
        MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
        MDI_ICONS.PENCIL_OUTLINE,
        MDI_ICONS.BRIEFCASE_VARIANT_OUTLINE,
        MDI_ICONS.SCHOOL_OUTLINE,
        MDI_ICONS.TARGET_ARROW,
        MDI_ICONS.STARS
      ]
    },
    color: { control: 'color' },
    iconSize: { control: 'number' },
    title: { control: 'text' },
    description: { control: 'text' },
    hoverBackgroundColor: { control: 'color' },
    colorOnHover: { control: 'color' },
    descriptionColor: { control: 'color' },
    clickable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
    tag: {
      control: 'select',
      options: ['button', 'div', 'a']
    },
    href: { control: 'text' },
    target: { control: 'text' },
    rel: { control: 'text' },
    ariaLabel: { control: 'text' },
    ariaDescribedby: { control: 'text' }
  },
  args: {
    color: 'var(--text1)',
    iconSize: 1.3125,
    hoverBackgroundColor: 'var(--dark-background-primary1)',
    colorOnHover: 'var(--card)',
    descriptionColor: 'var(--text2)',
    clickable: false,
    disabled: false,
    selected: false,
    tag: 'button'
  }
}

export default meta

const Template: StoryFn<AvListItemProps> = args => ({
  components: { AvList, AvListItem },
  setup () {
    return {
      args,
      MDI_ICONS
    }
  },
  template: `
    <div style="max-width: 20rem;">
      <AvList>
        <AvListItem v-bind="args" />
      </AvList>
    </div>
  `
})

export const Default = Template.bind({})
Default.args = {
  title: 'Default List Item',
  description: 'This is a basic list item'
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  title: 'Home',
  description: 'Navigate to homepage',
  icon: MDI_ICONS.HOME_VARIANT_OUTLINE
}

export const Clickable = Template.bind({})
Clickable.args = {
  title: 'Clickable Item',
  description: 'This item responds to clicks',
  icon: MDI_ICONS.PENCIL_OUTLINE,
  clickable: true
}

export const Selected = Template.bind({})
Selected.args = {
  title: 'Selected Item',
  description: 'This item is currently selected',
  icon: MDI_ICONS.STAR_CHECK_OUTLINE,
  clickable: true,
  selected: true
}

export const Disabled = Template.bind({})
Disabled.args = {
  title: 'Disabled Item',
  description: 'This item is not available',
  icon: MDI_ICONS.ALERT_CIRCLE_OUTLINE,
  clickable: true,
  disabled: true
}

export const TitleOnly = Template.bind({})
TitleOnly.args = {
  title: 'Title Only Item',
  icon: MDI_ICONS.INFORMATION_OUTLINE,
  clickable: true
}

export const DescriptionOnly = Template.bind({})
DescriptionOnly.args = {
  description: 'This item only has a description',
  icon: MDI_ICONS.CHAT_BUBBLE_OUTLINE
}

export const NavigationLink = Template.bind({})
NavigationLink.args = {
  title: 'External Link',
  description: 'Opens in new tab',
  icon: MDI_ICONS.ARROW_TOP_RIGHT_THICK,
  clickable: true,
  tag: 'a',
  href: 'https://example.com',
  target: '_blank',
  rel: 'noopener noreferrer'
}

export const LargeIcon = Template.bind({})
LargeIcon.args = {
  title: 'Large Icon',
  description: 'Item with bigger icon',
  icon: MDI_ICONS.BRIEFCASE_VARIANT_OUTLINE,
  iconSize: 2,
  clickable: true
}

export const CustomColors = Template.bind({})
CustomColors.args = {
  title: 'Custom Colors',
  description: 'Item with custom styling',
  icon: MDI_ICONS.STARS,
  clickable: true,
  color: '#2563eb',
  hoverBackgroundColor: '#dbeafe',
  colorOnHover: '#1d4ed8',
  descriptionColor: '#6b7280'
}

export const WithCustomContent = Template.bind({})
WithCustomContent.args = {
  title: 'Custom Content',
  icon: MDI_ICONS.DOTS_VERTICAL,
  clickable: true
}
WithCustomContent.render = args => ({
  components: { AvList, AvListItem },
  setup () {
    return { args, MDI_ICONS }
  },
  template: `
    <div style="max-width: 20rem;">
      <AvList>
        <AvListItem v-bind="args">
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <button style="padding: 0.25rem 0.5rem; border: 1px solid #ccc; border-radius: 0.25rem; background: white;">Edit</button>
            <button style="padding: 0.25rem 0.5rem; border: 1px solid #dc2626; border-radius: 0.25rem; background: #fef2f2; color: #dc2626;">Delete</button>
          </div>
        </AvListItem>
      </AvList>
    </div>
  `
})

export const WithAccessibility = Template.bind({})
WithAccessibility.args = {
  title: 'Accessible Item',
  description: 'Item with custom accessibility attributes',
  icon: MDI_ICONS.INFORMATION_OUTLINE,
  clickable: true,
  ariaLabel: 'Custom accessible label for screen readers',
  ariaDescribedby: 'helper-text'
}
WithAccessibility.render = args => ({
  components: { AvList, AvListItem },
  setup () {
    return { args, MDI_ICONS }
  },
  template: `
    <div style="max-width: 20rem;">
      <AvList>
        <AvListItem v-bind="args" />
      </AvList>
      <p id="helper-text" style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">
        This text provides additional context for screen readers
      </p>
    </div>
  `
})
