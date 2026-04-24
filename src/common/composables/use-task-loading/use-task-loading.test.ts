import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect, vi } from 'vitest'

BddTest().given('a useTaskLoading composable', () => {
  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should expose loading state and wrapper function', () => {
      const result = useTaskLoading()

      expect(result).toHaveProperty('isLoading')
      expect(result).toHaveProperty('withTaskLoading')
      expect(typeof result.withTaskLoading).toBe('function')
      expect(result.isLoading.value).toBe(false)
    })
  })

  BddTest().when('a wrapped task resolves', () => {
    BddTest().then('it should toggle loading state and return task result', async () => {
      const { isLoading, withTaskLoading } = useTaskLoading()

      let resolveTask: (value: string) => void = () => {}
      const task = vi.fn(() => new Promise<string>((resolve) => {
        resolveTask = resolve
      }))

      const promise = withTaskLoading(task)

      expect(isLoading.value).toBe(true)
      expect(task).toHaveBeenCalledTimes(1)

      resolveTask('done')

      await expect(promise).resolves.toBe('done')
      expect(isLoading.value).toBe(false)
    })
  })

  BddTest().when('a wrapped task rejects', () => {
    BddTest().then('it should reset loading state and rethrow the error', async () => {
      const { isLoading, withTaskLoading } = useTaskLoading()
      const error = new Error('task failed')

      const promise = withTaskLoading(async () => {
        throw error
      })

      expect(isLoading.value).toBe(true)

      await expect(promise).rejects.toThrow('task failed')
      expect(isLoading.value).toBe(false)
    })
  })

  BddTest().when('multiple wrapped tasks are running concurrently', () => {
    BddTest().then('it should keep loading true until all tasks are completed', async () => {
      const { isLoading, withTaskLoading } = useTaskLoading()

      let resolveFirstTask: (value: number) => void = () => {}
      let resolveSecondTask: (value: number) => void = () => {}

      const firstPromise = withTaskLoading(() => new Promise<number>((resolve) => {
        resolveFirstTask = resolve
      }))
      const secondPromise = withTaskLoading(() => new Promise<number>((resolve) => {
        resolveSecondTask = resolve
      }))

      expect(isLoading.value).toBe(true)

      resolveFirstTask(1)
      await expect(firstPromise).resolves.toBe(1)
      expect(isLoading.value).toBe(true)

      resolveSecondTask(2)
      await expect(secondPromise).resolves.toBe(2)
      expect(isLoading.value).toBe(false)
    })
  })
})
