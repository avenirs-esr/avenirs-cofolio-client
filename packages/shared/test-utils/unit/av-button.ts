import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export function findAvButtonByTestId (wrapper: VueWrapper, testId: string) {
  return wrapper.findAllComponents(AvButtonStub).find(button => button.vm.$attrs['data-testid'] === testId)
}

export function getAvButtonByTestId (wrapper: VueWrapper, testId: string) {
  const button = findAvButtonByTestId(wrapper, testId)

  if (!button) {
    throw new Error(`Button with test id ${testId} not found`)
  }

  return button
}
