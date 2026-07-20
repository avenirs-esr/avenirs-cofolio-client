import { useQueueAutoSave } from '@/common/composables/use-queue-auto-save/use-queue-auto-save'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, vi } from 'vitest'

interface TestData {
  title?: string
  description?: string
}

BddTest().given('a useQueueAutoSave composable', () => {
  let save: ReturnType<typeof vi.fn>
  let autoSave: ReturnType<typeof useQueueAutoSave<TestData>>

  beforeEach(() => {
    vi.useFakeTimers()

    save = vi.fn().mockResolvedValue(undefined)

    autoSave = useQueueAutoSave<TestData>(
      save,
      1000
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should expose required properties and methods', () => {
      expect(autoSave).toHaveProperty('queueAutoSave')
      expect(autoSave).toHaveProperty('flushAutoSave')
      expect(autoSave).toHaveProperty('cancelAutoSave')
      expect(autoSave).toHaveProperty('pendingAutoSaveData')

      expect(typeof autoSave.queueAutoSave).toBe('function')
      expect(typeof autoSave.flushAutoSave).toBe('function')
      expect(typeof autoSave.cancelAutoSave).toBe('function')
    })

    BddTest().then('pendingAutoSaveData should be empty', () => {
      expect(autoSave.pendingAutoSaveData.value).toEqual({})
    })
  })

  BddTest().when('queue is called with data', () => {
    beforeEach(() => {
      autoSave.queueAutoSave({
        title: 'Mon titre'
      })
    })

    BddTest().then('it should store pending data', () => {
      expect(autoSave.pendingAutoSaveData.value).toEqual({
        title: 'Mon titre'
      })
    })

    BddTest().then('it should not save immediately', () => {
      expect(save).not.toHaveBeenCalled()
    })

    BddTest().then('it should save after debounce delay', async () => {
      await vi.advanceTimersByTimeAsync(1000)

      expect(save).toHaveBeenCalledOnce()
      expect(save).toHaveBeenCalledWith({
        title: 'Mon titre'
      })
    })

    BddTest().then('pendingData should be cleared after save', async () => {
      await vi.advanceTimersByTimeAsync(1000)

      expect(autoSave.pendingAutoSaveData.value).toEqual({})
    })
  })

  BddTest().when('queue is called multiple times before debounce ends', () => {
    beforeEach(() => {
      autoSave.queueAutoSave({
        title: 'Titre'
      })

      autoSave.queueAutoSave({
        description: 'Description'
      })
    })

    BddTest().then('it should merge pending data', () => {
      expect(autoSave.pendingAutoSaveData.value).toEqual({
        title: 'Titre',
        description: 'Description'
      })
    })

    BddTest().then('it should save merged data only once', async () => {
      await vi.advanceTimersByTimeAsync(1000)

      expect(save).toHaveBeenCalledOnce()

      expect(save).toHaveBeenCalledWith({
        title: 'Titre',
        description: 'Description'
      })
    })
  })

  BddTest().when('queue is called without data', () => {
    beforeEach(() => {
      autoSave.queueAutoSave()
    })

    BddTest().then('it should save immediately', () => {
      expect(save).toHaveBeenCalledOnce()
    })
  })

  BddTest().when('cancel is called before debounce finishes', () => {
    beforeEach(() => {
      autoSave.queueAutoSave({
        title: 'Titre'
      })

      autoSave.cancelAutoSave()
    })

    BddTest().then('it should not save', async () => {
      await vi.advanceTimersByTimeAsync(1000)

      expect(save).not.toHaveBeenCalled()
    })
  })
})
