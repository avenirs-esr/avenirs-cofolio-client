import type { VueWrapper } from '@vue/test-utils'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import AssessmentActivityTitle from '@/features/staff/assessments/views/AssessmentsView/components/AssessmentActivityTitle/AssessmentActivityTitle.vue'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useTextTruncation: () => ({ isTruncated: mockIsTruncated }),
  }
})

BddTest().given('an assessment activity title', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentActivityTitle>>

  const activityTitle = 'Activité "Portfolio" : Valoriser ses expériences'

  const mountWith = (title = activityTitle) => {
    wrapper = mount(AssessmentActivityTitle, {
      props: {
        activityTitle: title,
      },
      global: {
        stubs: {
          AvTooltip: AvTooltipStub,
        },
      },
    })
  }

  const getAvTooltip = () => wrapper.findComponent(AvTooltipStub)
  const getTitleSpan = () => wrapper.find('span')

  beforeEach(() => {
    mockIsTruncated.value = false
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the activity title text', () => {
      expect(getTitleSpan().text()).toBe(activityTitle)
    })

    BddTest().then('it should pass the activity title as tooltip content', () => {
      expect(getAvTooltip().props('content')).toBe(activityTitle)
    })

    BddTest().then('it should disable the tooltip when text is not truncated', () => {
      expect(getAvTooltip().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the text is truncated', () => {
    beforeEach(() => {
      mockIsTruncated.value = true
      mountWith()
    })

    BddTest().then('it should enable the tooltip', () => {
      expect(getAvTooltip().props('disabled')).toBe(false)
    })
  })
})
