import type { VueWrapper } from '@vue/test-utils'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { CardStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { latestActivitiesErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { ActivityErrorMessageStub } from '@/features/student/activities/components/errors/ActivityErrorMessage/ActivityErrorMessage.stub'
import { ActivityCardStub } from '@/features/student/activities/views/ActivitiesView/components/ActivityCard/ActivityCard.stub'
import NewActivitiesPaginatorCard from '@/features/student/activities/views/ActivitiesView/components/NewActivitiesPaginatorCard/NewActivitiesPaginatorCard.vue'

const AvPaginationStub = defineComponent({
  name: 'AvPagination',
  props: ['id', 'currentPage', 'pages', 'ariaLabel', 'compact', 'truncLimit'],
  emits: ['update:current-page'],
  template: `<button class="av-pagination" @click="$emit('update:current-page', 2)">Page 2</button>`
})

BddTest().given('a new activities paginator card', () => {
  let wrapper: VueWrapper<InstanceType<typeof NewActivitiesPaginatorCard>>

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub,
    AvPagination: AvPaginationStub,
    ActivityCard: ActivityCardStub,
    ActivityErrorMessage: ActivityErrorMessageStub,
  }

  const getErrorMessage = () => wrapper.findComponent(ActivityErrorMessageStub)
  const getCards = () => wrapper.findAllComponents(ActivityCardStub)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  BddTest().when('the component is mounted without error', () => {
    beforeEach(async () => {
      wrapper = mountComponent(NewActivitiesPaginatorCard, { global: { stubs } })
      await vi.waitFor(() => {
        expect(getCards().length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should render an Card component', () => {
      expect(wrapper.findComponent(CardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toContain('Les nouveautés')
    })

    BddTest().then('it should render the pagination', () => {
      expect(wrapper.findComponent(AvPaginationStub).exists()).toBe(true)
    })

    BddTest().then('it should render the activity cards', async () => {
      expect(getCards().length).toBeGreaterThan(0)
    })
  })

  BddTest().when('the component is mounted with an error', () => {
    beforeEach(async () => {
      server.use(latestActivitiesErrorHandler)
      wrapper = mountComponent(NewActivitiesPaginatorCard, { global: { stubs } })
      await vi.waitFor(() => {
        expect(getErrorMessage().exists()).toBe(true)
      })
    })

    BddTest().then('it should render the error message', () => {
      expect(getErrorMessage().exists()).toBe(true)
    })

    BddTest().then('it should not render activity cards', () => {
      expect(getCards()).toHaveLength(0)
    })
  })
})
