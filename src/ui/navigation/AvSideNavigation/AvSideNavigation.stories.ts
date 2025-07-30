import type { Meta, StoryObj } from '@storybook/vue3'
import { MDI_ICONS } from '@/ui/tokens'
import AvSideNavigation from './AvSideNavigation.vue'

const mockItems = [
  {
    id: 'careers',
    label: 'Career Information',
    icon: MDI_ICONS.BRIEFCASE_VARIANT_OUTLINE
  },
  {
    id: 'educations',
    label: 'Educational Background',
    icon: MDI_ICONS.SCHOOL_OUTLINE
  },
  {
    id: 'experiences',
    label: 'Professional Experience',
    icon: MDI_ICONS.VECTOR_POLYGON_VARIANT
  },
  {
    id: 'activities',
    label: 'Activities & Projects',
    icon: MDI_ICONS.TARGET_ARROW
  }
]

/**
 * <h1 class="n1">Navigation - <code>AvSideNavigation</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The side navigation component is a comprehensive solution that combines AvSideMenu, AvList, and AvListItem
 *     components to provide a fully functional navigational sidebar. It handles both the layout structure and
 *     navigation behavior while maintaining full accessibility and keyboard navigation support.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvSideNavigation</code> component offers automatic state management through defineModel,
 *     customizable navigation items with icons and labels, and responsive behavior that adapts to collapsed states.
 *     It provides a clean API for managing selected items and menu visibility.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     It features two-way data binding for selected items and collapse state, smooth transitions,
 *     proper focus management, and screen reader support while maintaining visual consistency
 *     with the design system's styling tokens.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">The side navigation component consists of the following elements:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular"><strong>Side Menu Container:</strong> The main AvSideMenu wrapper that handles collapsible behavior</span></li>
 *   <li><span class="b2-regular"><strong>Navigation List:</strong> An AvList component that contains all navigation items</span></li>
 *   <li><span class="b2-regular"><strong>Navigation Items:</strong> Individual AvListItem components representing each navigational option</span></li>
 *   <li><span class="b2-regular"><strong>Toggle Functionality:</strong> Automatic label hiding/showing based on collapsed state</span></li>
 * </ul>
 *
 * <p><span class="b2-regular">The side navigation integrates:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular">Two-way binding for selected item and collapsed state via defineModel</span></li>
 *   <li><span class="b2-regular">Automatic icon-only display when collapsed</span></li>
 *   <li><span class="b2-regular">Selection state management with visual feedback</span></li>
 *   <li><span class="b2-regular">Keyboard navigation and accessibility attributes</span></li>
 *   <li><span class="b2-regular">Responsive design with customizable widths</span></li>
 * </ul>
 */
const meta: Meta<typeof AvSideNavigation> = {
  title: 'Components/Navigation/AvSideNavigation',
  component: AvSideNavigation,
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of navigation items with id, label, and icon',
      control: { type: 'object' }
    },
    collapsedWidth: {
      description: 'Width of the side menu when collapsed',
      control: { type: 'text' }
    },
    selectedItem: {
      description: 'Currently selected item ID (v-model)',
      control: { type: 'text' }
    },
    isSideMenuCollapsed: {
      description: 'Whether the side menu is collapsed (v-model)',
      control: { type: 'boolean' }
    }
  },
  args: {
    items: mockItems,
    collapsedWidth: '3.5rem'
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { AvSideNavigation },
    setup () {
      const selectedItem = ref('careers')
      const isSideMenuCollapsed = ref(false)
      return { args, selectedItem, isSideMenuCollapsed }
    },
    template: `
      <div style="height: 400px; display: flex;">
        <AvSideNavigation 
          v-bind="args"
          v-model:selected-item="selectedItem"
          v-model:is-side-menu-collapsed="isSideMenuCollapsed"
        />
        <div style="flex: 1; padding: 1rem; background: #f5f5f5;">
          <p><strong>Selected item:</strong> {{ selectedItem }}</p>
          <p><strong>Menu collapsed:</strong> {{ isSideMenuCollapsed }}</p>
          <p>This component uses defineModel for automatic two-way binding with parent components.</p>
        </div>
      </div>
    `
  })
}

export const Collapsed: Story = {
  render: args => ({
    components: { AvSideNavigation },
    setup () {
      const selectedItem = ref('educations')
      const isSideMenuCollapsed = ref(true)
      return { args, selectedItem, isSideMenuCollapsed }
    },
    template: `
      <div style="height: 400px; display: flex;">
        <AvSideNavigation 
          v-bind="args"
          v-model:selected-item="selectedItem"
          v-model:is-side-menu-collapsed="isSideMenuCollapsed"
        />
        <div style="flex: 1; padding: 1rem; background: #f5f5f5;">
          <p><strong>Selected item:</strong> {{ selectedItem }}</p>
          <p><strong>Menu collapsed:</strong> {{ isSideMenuCollapsed }}</p>
          <p>This story demonstrates the collapsed state where only icons are visible.</p>
        </div>
      </div>
    `
  })
}

export const CustomWidth: Story = {
  render: args => ({
    components: { AvSideNavigation },
    setup () {
      const selectedItem = ref('experiences')
      const isSideMenuCollapsed = ref(false)
      return { args, selectedItem, isSideMenuCollapsed }
    },
    template: `
      <div style="height: 400px; display: flex;">
        <AvSideNavigation 
          v-bind="args"
          v-model:selected-item="selectedItem"
          v-model:is-side-menu-collapsed="isSideMenuCollapsed"
        />
        <div style="flex: 1; padding: 1rem; background: #f5f5f5;">
          <p><strong>Selected item:</strong> {{ selectedItem }}</p>
          <p><strong>Menu collapsed:</strong> {{ isSideMenuCollapsed }}</p>
          <p>This story demonstrates custom collapsed width (5rem instead of default 3.5rem).</p>
        </div>
      </div>
    `
  }),
  args: {
    collapsedWidth: '5rem'
  }
}
