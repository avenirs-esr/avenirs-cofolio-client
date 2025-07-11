import type { Meta, StoryFn } from '@storybook/vue3'
import AvButton from '@/ui/interaction/buttons/AvButton/AvButton.vue'
import AvDrawer, { type AvDrawerProps } from '@/ui/overlay/drawers/AvDrawer/AvDrawer.vue'

/**
 * <h1 class="n1">Drawers - <code>AvDrawer</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The drawer is a panel that slides in from the edge of the screen, providing additional content or navigation options without leaving the current page.
 *     This component is designed to display contextual information, actions, or secondary navigation in a non-intrusive way.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvDrawer</code> component offers flexible positioning (left or right), customizable dimensions, and an optional backdrop overlay.
 *     It provides a clean, accessible way to present supplementary content while maintaining focus on the primary interface.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     It features smooth animations, proper z-index management, and integrates seamlessly with the design system's styling tokens.
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">The drawer consists of the following elements:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular"><strong>Container:</strong> The main drawer panel that slides in from the specified edge</span></li>
 *   <li><span class="b2-regular"><strong>Backdrop:</strong> (optional) Semi-transparent overlay that dims the background content</span></li>
 *   <li><span class="b2-regular"><strong>Content Area:</strong> Flexible content container that accepts any slotted content</span></li>
 * </ul>
 *
 * <p><span class="b2-regular">The drawer integrates:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular">Fixed positioning for consistent placement</span></li>
 *   <li><span class="b2-regular">Conditional backdrop for modal-like behavior</span></li>
 *   <li><span class="b2-regular">Position-specific styling (left/right rounded corners and shadows)</span></li>
 *   <li><span class="b2-regular">Responsive width and padding customization</span></li>
 * </ul>
 */
const meta: Meta<AvDrawerProps> = {
  title: 'Components/Overlay/Drawers/AvDrawer',
  component: AvDrawer,
  tags: ['autodocs'],
  argTypes: {
    show: { control: 'boolean' },
    position: {
      control: 'select',
      options: ['left', 'right']
    },
    width: { control: 'text' },
    backdrop: { control: 'boolean' },
    padding: { control: 'text' },
  },
  args: {
    show: true,
    position: 'right',
    width: '35rem',
    backdrop: true,
    padding: 'var(--spacing-md)',
  },
  parameters: {
    docs: {
      story: {
        height: '20rem',
      },
    },
  }
}

export default meta

const Template: StoryFn<AvDrawerProps> = args => ({
  components: { AvDrawer, AvButton },
  setup () {
    const isDrawerOpen = ref(args.show)

    const toggleDrawer = () => {
      isDrawerOpen.value = !isDrawerOpen.value
    }

    const closeDrawer = () => {
      isDrawerOpen.value = false
    }

    return {
      args,
      isDrawerOpen,
      toggleDrawer,
      closeDrawer
    }
  },
  template: `
    <div>
      <AvButton
        label="Toggle Drawer"
        @click="toggleDrawer"
      />
      
      <AvDrawer 
        :show="isDrawerOpen"
        :position="args.position"
        :width="args.width"
        :backdrop="args.backdrop"
        :padding="args.padding"
      >
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <h3 style="margin: 0; color: var(--title);">Drawer Content</h3>
          <p style="margin: 0; color: var(--text1);">
            This is the drawer content area. You can put any content here like navigation, 
            actions, or additional information.
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <AvButton
              label="Action 1"
              variant="DEFAULT"
              theme="PRIMARY"
              size="sm"
            />
            <AvButton
              label="Action 2"
              variant="OUTLINED"
              theme="SECONDARY"
              size="sm"
            />
          </div>
          
          <div style="margin-top: auto; padding-top: 2rem;">
            <AvButton
              label="Close Drawer"
              @click="closeDrawer"
              variant="OUTLINED"
              theme="SECONDARY"
              size="sm"
            />
          </div>
        </div>
      </AvDrawer>
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {}

export const LeftPosition = Template.bind({})
LeftPosition.args = {
  position: 'left',
}

export const WithoutBackdrop = Template.bind({})
WithoutBackdrop.args = {
  backdrop: false,
}

export const CustomWidth = Template.bind({})
CustomWidth.args = {
  width: '25rem',
}
