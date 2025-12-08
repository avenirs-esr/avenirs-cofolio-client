import { createVueApp } from '@/bootstrap'

async function enableMsw () {
  const basePath = import.meta.env.VITE_BASE_PATH || '/cofolio/'

  if (__DEMO_MODE__) {
    document.documentElement.setAttribute('demo-mode', 'true')
  }
  else {
    document.documentElement.setAttribute('demo-mode', 'false')
  }

  if (import.meta.env.MODE === 'production' || !__ENABLE_MSW__) {
    return
  }

  const { worker } = await import('@/__mocks__/msw/browser')

  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${basePath}mockServiceWorker.js`
    }
  })
}

enableMsw().then(async () => {
  const app = await createVueApp()
  app.mount('#app')
})
