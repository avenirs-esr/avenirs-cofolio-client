import { getRandomId } from '@gouvminint/vue-dsfr'
import { defineStore } from 'pinia'

export interface Message {
  id?: string
  title?: string
  description: string
  type?: 'info' | 'success' | 'warning' | 'error'
  closeable?: boolean
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  timeout?: number
  style?: Record<string, string>
  class?: string | Record<string, string> | Array<string | Record<string, string>>
}

const DEFAULT_TIMEOUT = 5000

export const useToasterStore = defineStore('toaster', () => {
  const messages = reactive<Message[]>([])
  const timeouts: Record<string, number> = {}

  function removeMessage (id: string) {
    const index = messages.findIndex(message => message.id === id)
    clearTimeout(timeouts[id])
    if (index !== -1) {
      messages.splice(index, 1)
    }
  }

  function addMessage (message: Message) {
    if (message.id && timeouts[message.id]) {
      removeMessage(message.id)
    }

    message.id ??= getRandomId('toaster')
    message.titleTag ??= 'h3'
    message.closeable ??= true
    message.type ??= 'info'
    message.timeout ??= DEFAULT_TIMEOUT

    messages.push({ ...message })

    timeouts[message.id] = window.setTimeout(() => {
      removeMessage(message.id as string)
    }, message.timeout)
  }

  function addSuccessMessage (msg: Message | string) {
    const message = typeof msg === 'string' ? { description: msg } : msg
    addMessage({ ...message, type: 'success' })
  }

  function addErrorMessage (msg: Message | string) {
    const message = typeof msg === 'string' ? { description: msg } : msg
    addMessage({ ...message, type: 'error' })
  }

  return {
    messages,
    addMessage,
    removeMessage,
    addSuccessMessage,
    addErrorMessage,
  }
})
