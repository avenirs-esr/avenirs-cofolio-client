import { mockedTraceDetailedWithFile, mockedTraceDetailedWithLink } from '@/__mocks__/fixtures/student/traces.fixtures'
import FeedbackTraceActions from '@/features/feedbacks/views/FeedbacksView/components/FeedbackTraceActions/FeedbackTraceActions.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

const traceWithFile = mockedTraceDetailedWithFile
const traceWithLink = mockedTraceDetailedWithLink

const stubs = { AvButton: AvButtonStub }

BddTest().given('a FeedbackTraceActions component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof FeedbackTraceActions>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the trace has a file attachment', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackTraceActions, {
        props: { trace: traceWithFile },
        global: { stubs },
      })
    })

    BddTest().then('it should render the download button', () => {
      expect(wrapper.find('[data-testid="feedback-trace-actions-download-button"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the link button', () => {
      expect(wrapper.find('[data-testid="feedback-trace-actions-link-button"]').exists()).toBe(false)
    })

    BddTest().then('it should trigger the download when download button is clicked', async () => {
      await wrapper.find('[data-testid="feedback-trace-actions-download-button"]').trigger('click')
      await flushPromises()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the trace has a link', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackTraceActions, {
        props: { trace: traceWithLink },
        global: { stubs },
      })
    })

    BddTest().then('it should render the link button', () => {
      expect(wrapper.find('[data-testid="feedback-trace-actions-link-button"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the download button', () => {
      expect(wrapper.find('[data-testid="feedback-trace-actions-download-button"]').exists()).toBe(false)
    })

    BddTest().then('it should pass href and security attributes for external link opening', () => {
      const linkButton = wrapper.find('[data-testid="feedback-trace-actions-link-button"]')
      expect(linkButton.attributes('href')).toBe(traceWithLink.link)
    })
  })
})
