import type { Meta, StoryFn } from '@storybook/vue3'
import AvNavigation, { type AvNavigationProps } from '@/ui/navigation/AvNavigation/AvNavigation.vue'

/**
 * <h1 class="n1">Navigation - <code>AvNavigation</code></h1>
 *
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvNavigation</code> is a component implementing the VueDSFR <code>DsfrNavigation</code>.
 *     The main navigation is the central navigation system within a site. It guides the user through the site main and secondary sections.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🏅 Documentation on main navigation can be found on
 *     <a href="https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/navigation-principale" target="_blank" rel="noopener noreferrer">DSFR</a>
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <p><span class="b2-regular">The navigation component can be used to create a navigation bar with different types of navigation items:</span></p>
 *
 * <ul>
 *   <li><span class="b2-regular">direct link</span></li>
 *   <li><span class="b2-regular">submenu</span></li>
 *   <li><span class="b2-regular">mega-menu</span></li>
 * </ul>
 */
const meta: Meta<AvNavigationProps> = {
  title: 'Components/Navigation/AvNavigation',
  component: AvNavigation,
  tags: ['autodocs'],
  args: {
    navItems: [
      {
        text: 'Direct link',
        to: '#home',
        active: true,
      },
      {
        title: 'Menu',
        links: [
          { text: 'Link 1', to: '#menu-link1' },
          { text: 'Link 2', to: '#menu-link2' },
          { text: 'Link 3', to: '#menu-link3' },
          { text: 'Link 4', to: '#menu-link4' },
          { text: 'Link 5', to: '#menu-link5' },
        ]
      },
      {
        title: 'Mega menu',
        link: {
          to: '#',
          text: 'See all'
        },
        menus: [
          {
            title: 'Category 1',
            links: [
              { text: 'Link 1', to: '#cat1-link1' },
              { text: 'Link 2', to: '#cat1-link2' },
              { text: 'Link 3', to: '#cat1-link3' },
              { text: 'Link 4', to: '#cat1-link4' },
              { text: 'Link 5', to: '#cat1-link5' },
            ],
          },
          {
            title: 'Category 2',
            links: [
              { text: 'Link 1', to: '#cat2-link1' },
              { text: 'Link 2', to: '#cat2-link2' },
              { text: 'Link 3', to: '#cat2-link3' },
              { text: 'Link 4', to: '#cat2-link4' },
              { text: 'Link 5', to: '#cat2-link5' },
            ],
          },
          {
            title: 'Category 3',
            links: [
              { text: 'Link 1', to: '#cat3-link1' },
              { text: 'Link 2', to: '#cat3-link2' },
              { text: 'Link 3', to: '#cat3-link3' },
              { text: 'Link 4', to: '#cat3-link4' },
              { text: 'Link 5', to: '#cat3-link5' },
            ],
          },
        ],
      },
    ],
  },
}

export default meta

const Template: StoryFn<AvNavigationProps> = args => ({
  components: { AvNavigation },
  setup () {
    return { args }
  },
  template: `<AvNavigation v-bind="args" />`,
})

export const Default = Template.bind({})
Default.args = {}
Default.parameters = {
  docs: {
    story: {
      height: '420px',
    },
  },
}
