import type { Preview } from '@storybook/vue3-vite'

import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvminint/vue-dsfr/styles'
import '@gouvfr/dsfr/dist/scheme/scheme.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'
import '@/assets/main.css'
import '@/ui/styles/main.scss'
import './preview.scss'

function withTheme (Story, context) {
  const isDark = context.globals.theme === 'dark'
  document.body.classList.toggle('theme-dark', isDark)
  return Story(context.args)
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
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
  decorators: [withTheme],
}

export default preview
