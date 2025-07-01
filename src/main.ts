import { createVueApp } from '@/bootstrap'

async function enableMsw () {
  if (import.meta.env.MODE === 'production' || !__ENABLE_MSW__) {
    return
  }

  const { worker } = await import('@/__mocks__/msw/browser')

  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  })
}

enableMsw().then(() => createVueApp().mount('#app'))
