import { type Preview, setup } from '@storybook/vue3-vite'
import '@avenirs-esr/avenirs-dsav/style.css'
import '@/assets/main.css'
// eslint-disable-next-line no-restricted-imports
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
