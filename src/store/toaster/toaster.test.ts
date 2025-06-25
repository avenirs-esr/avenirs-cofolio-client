import { type Message, useToasterStore } from '@/store/toaster/toaster'

describe('useToasterStore', () => {
  let toaster: ReturnType<typeof useToasterStore>

  const message: Message = { id: 'test-id', description: 'test', type: 'info' }
  const newMessage: Message = {
    id: 'new-id',
    title: 'Hello',
    description: 'World',
    type: 'warning',
    timeout: 5000,
    closeable: false,
    titleTag: 'h4',
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'clearTimeout')
    setActivePinia(createPinia())
    toaster = useToasterStore()
    toaster.messages.length = 0
    toaster.messages.push({ ...message })
    toaster.timeouts[message.id!] = window.setTimeout(() => {}, 1000)
  })

  it('should remove message and clear timeout when calling removeMessage', () => {
    toaster.removeMessage(message.id!)
    expect(toaster.messages.length).toBe(0)
    expect(clearTimeout).toHaveBeenCalled()
  })

  it('should ignore removal of non-existent message', () => {
    toaster.removeMessage('non-existent-id')
    expect(toaster.messages.length).toBe(1)
  })

  it('should replace message when calling addMessage with already existing messageId', () => {
    toaster.addMessage(message)
    expect(toaster.messages.length).toBe(1)
  })

  it('should add message with default props when calling addMessage', () => {
    toaster.removeMessage(message.id!)
    toaster.addMessage(message)

    expect(toaster.messages.length).toBe(1)
    const { id, title, description, titleTag, closeable, type, timeout } = toaster.messages[0]!

    expect(id).toBe(message.id)
    expect(title).toBe(undefined)
    expect(description).toBe(message.description)
    expect(titleTag).toBe('h3')
    expect(closeable).toBe(true)
    expect(type).toBe('info')
    expect(timeout).toBe(5000)
  })

  it('should add message with full props', () => {
    toaster.addMessage(newMessage)
    const msg = toaster.messages.find(m => m.id === newMessage.id)!
    expect(msg.title).toBe('Hello')
    expect(msg.type).toBe('warning')
    expect(msg.timeout).toBe(5000)
    expect(msg.titleTag).toBe('h4')
    expect(msg.closeable).toBe(false)
  })

  it('should add message with default props', () => {
    toaster.removeMessage('test-id')
    toaster.addMessage({ description: 'default', type: 'info' })
    const msg = toaster.messages[0]
    expect(msg.titleTag).toBe('h3')
    expect(msg.type).toBe('info')
    expect(msg.closeable).toBe(true)
  })

  it('should add success message from string or object', () => {
    toaster.addSuccessMessage('ok')
    toaster.addSuccessMessage({ description: 'yes', type: 'error' })
    expect(toaster.messages.slice(1).every(m => m.type === 'success')).toBe(true)
  })

  it('should add error message from string or object', () => {
    toaster.addErrorMessage('fail')
    toaster.addErrorMessage({ description: 'warn', type: 'warning' })
    expect(toaster.messages.slice(1).every(m => m.type === 'error')).toBe(true)
  })

  it('should call removeMessage after timeout', () => {
    toaster.removeMessage('test-id')
    toaster.addMessage({ description: 'default', type: 'info' })

    expect(toaster.messages.length).toBe(1)
    vi.advanceTimersByTime(5000)
    expect(toaster.messages.length).toBe(0)
  })
})
