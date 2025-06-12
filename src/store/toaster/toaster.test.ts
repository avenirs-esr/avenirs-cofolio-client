import {
  type Message,
  useToasterStore
  , } from './toaster'

describe('useToasterStore', () => {
  let toaster: ReturnType<typeof useToasterStore>

  const defaultMessage: Message = { id: 'test-id', description: 'test' }
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
    setActivePinia(createPinia())
    toaster = useToasterStore()
    toaster.messages.length = 0
    toaster.messages.push({ ...defaultMessage })
  })

  it('should remove message and clear timeout', () => {
    const spy = vi.spyOn(globalThis, 'clearTimeout')
    toaster.addMessage(defaultMessage)
    toaster.removeMessage('test-id')
    expect(toaster.messages.length).toBe(0)
    expect(spy).toHaveBeenCalled()
  })

  it('should ignore removal of non-existent message', () => {
    toaster.removeMessage('nope')
    expect(toaster.messages.length).toBe(1)
  })

  it('should replace message with same ID', () => {
    toaster.addMessage(defaultMessage)
    expect(toaster.messages.length).toBe(1)
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
    toaster.addMessage({ description: 'default' })
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
})
