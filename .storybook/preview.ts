import { type Preview, setup } from '@storybook/vue3-vite'

import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvminint/vue-dsfr/styles'
import '@gouvfr/dsfr/dist/scheme/scheme.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'
import '@/assets/main.css'
import '@/ui/styles/main.scss'
import './preview.scss'

function toggleDarkTheme (story, context) {
  const isDark = context.globals.theme === 'dark'
  document.body.classList.toggle('theme-dark', isDark)
  return ({
    ...context.args,
    components: { story },
    template: `
      <div class="story-wrapper">
        <story />
      </div>
    `,
  })
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Docs',
          'Foundations',
          'Composables',
          'Components',
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', right: '☀️', title: 'Light Theme' },
          { value: 'dark', right: '🌙', title: 'Dark Theme' }
        ],
        showName: true,
      },
    },
  },
  decorators: [toggleDarkTheme],
  tags: ['autodocs'],
}

const RouterLink = defineComponent({
  name: 'RouterLink',
  props: {
    to: String,
  },
  template: `
    <a :href="to" v-bind="$attrs"><slot /></a>
  `,
})

setup((app) => {
  app.component('RouterLink', RouterLink)
})

export default preview
