import {
  alphanumBase,
  getRandomAlphaNum,
  getRandomHtmlId,
  getRandomString,
  type Message,
  useToaster
} from './use-toaster'

describe('getRandomAlphaNum', () => {
  const alphanumSet = new Set(alphanumBase.split(''))

  it('should return a character from alphanumBase', () => {
    const char = getRandomAlphaNum()
    expect(alphanumSet.has(char)).toBe(true)
  })
})

describe('getRandomString', () => {
  const alphanumSet = new Set(alphanumBase.split(''))

  it('should return a string of the given length', () => {
    const result = getRandomString(10)
    expect(result).toHaveLength(10)
  })

  it('should return only valid alphanumeric characters', () => {
    const result = getRandomString(1000)
    for (const char of result) {
      expect(alphanumSet.has(char)).toBe(true)
    }
  })
})

describe('getRandomHtmlId', () => {
  it('should generate a string with expected format with provided prefix and suffix', () => {
    const id = getRandomHtmlId('prefix', 'suffix')
    const match = /^prefix-[a-z0-9]{5}-suffix$/.test(id)
    expect(match).toBe(true)
  })

  it('should generate a string with expected format with empty prefix and provided suffix', () => {
    const id = getRandomHtmlId('', 'suffix')
    const match = /^[a-z0-9]{5}-suffix$/.test(id)
    expect(match).toBe(true)
  })

  it('should generate a string with expected format with provided prefix and empty suffix', () => {
    const id = getRandomHtmlId('prefix', '')
    const match = /^prefix-[a-z0-9]{5}$/.test(id)
    expect(match).toBe(true)
  })

  it('should generate a string with expected format with empty prefix and suffix', () => {
    const id = getRandomHtmlId('prefix', '')
    const match = /^prefix-[a-z0-9]{5}$/.test(id)
    expect(match).toBe(true)
  })
})

describe('useToaster', () => {
  let removeMessage: ReturnType<typeof useToaster>['removeMessage']
  let addMessage: ReturnType<typeof useToaster>['addMessage']
  let addSuccessMessage: ReturnType<typeof useToaster>['addSuccessMessage']
  let addErrorMessage: ReturnType<typeof useToaster>['addErrorMessage']
  let messages: ReturnType<typeof useToaster>['messages']
  let timeouts: ReturnType<typeof useToaster>['timeouts']

  const DEFAULT_TIMEOUT = useToaster().DEFAULT_TIMEOUT
  const message: Message = { id: 'test-id', description: 'test' }
  const newMessage: Message = {
    id: 'new-test-id',
    title: 'new title',
    description: 'new test',
    titleTag: 'h4',
    closeable: false,
    type: 'warning',
    timeout: 5000
  }
  const infoMessage: Message = { description: 'info', type: 'info' }
  const successMessage: Message = { description: 'success', type: 'success' }
  const warningMessage: Message = { description: 'warning', type: 'warning' }
  const errorMessage: Message = { description: 'error', type: 'error' }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'clearTimeout')

    const toaster = useToaster()

    messages = toaster.messages
    messages.length = 0
    messages.push(message)

    timeouts = toaster.timeouts
    timeouts[message.id!] = window.setTimeout(() => {}, 1000)

    removeMessage = toaster.removeMessage
    addMessage = toaster.addMessage
    addSuccessMessage = toaster.addSuccessMessage
    addErrorMessage = toaster.addErrorMessage
  })

  it('should remove message and clear timeout when calling removeMessage', () => {
    removeMessage(message.id!)

    expect(clearTimeout).toHaveBeenCalledWith(timeouts[message.id!])
    expect(messages.find(m => m.id === message.id)).toBeUndefined()
  })

  it('should do nothing if message is not found when calling removeMessage', () => {
    removeMessage('non-existent-id')

    expect(messages.length).toBe(1)
  })

  it('should remove existing message when calling addMessage with already existing messageId', () => {
    addMessage(message)

    expect(messages.length).toBe(1)
  })

  it('should add message when calling addMessage with non-existent messageId', () => {
    addMessage(newMessage)

    expect(messages.length).toBe(2)
  })

  it('should add message with default props when calling addMessage', () => {
    removeMessage(message.id!)
    addMessage(message)

    expect(messages.length).toBe(1)
    const { id, title, description, titleTag, closeable, type, timeout } = messages[0]
    expect(id).toBe(message.id)
    expect(title).toBe(undefined)
    expect(description).toBe(message.description)
    expect(titleTag).toBe('h3')
    expect(closeable).toBe(true)
    expect(type).toBe('info')
    expect(timeout).toBe(DEFAULT_TIMEOUT)
  })

  it('should add message with provided props when calling addMessage', () => {
    addMessage(newMessage)

    expect(messages.length).toBe(2)
    const { id, title, description, titleTag, closeable, type, timeout } = messages[1]
    expect(id).toBe(newMessage.id)
    expect(title).toBe(newMessage.title)
    expect(description).toBe(newMessage.description)
    expect(titleTag).toBe(newMessage.titleTag)
    expect(closeable).toBe(newMessage.closeable)
    expect(type).toBe(newMessage.type)
    expect(timeout).toBe(newMessage.timeout)
  })

  it('should add a success message when calling addSuccessMessage with a message with any type', () => {
    addSuccessMessage(infoMessage)
    addSuccessMessage(successMessage)
    addSuccessMessage(warningMessage)
    addSuccessMessage(errorMessage)

    expect(messages.length).toBe(5)
    expect(messages[1].type).toBe('success')
    expect(messages[2].type).toBe('success')
    expect(messages[3].type).toBe('success')
    expect(messages[4].type).toBe('success')
  })

  it('should add a success message when calling addSuccessMessage with a string', () => {
    addSuccessMessage(newMessage.description)

    expect(messages.length).toBe(2)
    expect(messages[1].description).toBe(newMessage.description)
    expect(messages[1].type).toBe('success')
  })

  it('should add an error message when calling addErrorMessage with a message with any type', () => {
    addErrorMessage(infoMessage)
    addErrorMessage(successMessage)
    addErrorMessage(warningMessage)
    addErrorMessage(errorMessage)

    expect(messages.length).toBe(5)
    expect(messages[1].type).toBe('error')
    expect(messages[2].type).toBe('error')
    expect(messages[3].type).toBe('error')
    expect(messages[4].type).toBe('error')
  })

  it('should add an error message when calling addErrorMessage with a string', () => {
    addErrorMessage(newMessage.description)

    expect(messages.length).toBe(2)
    expect(messages[1].description).toBe(newMessage.description)
    expect(messages[1].type).toBe('error')
  })
})
