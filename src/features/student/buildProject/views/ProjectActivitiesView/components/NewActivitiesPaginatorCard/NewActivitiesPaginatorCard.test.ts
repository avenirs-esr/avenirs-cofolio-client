import type { VueWrapper } from '@vue/test-utils'
import { latestActivitiesErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ActivityCardStub } from '@/features/student/buildProject/components/cards/ActivityCard/ActivityCard.stub'
import NewActivitiesPaginatorCard from '@/features/student/buildProject/views/ProjectActivitiesView/components/NewActivitiesPaginatorCard/NewActivitiesPaginatorCard.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

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
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(NewActivitiesPaginatorCard, { global: { stubs } })
  })

  BddTest().when('the component is mounted without error', () => {
    beforeEach(async () => {
      await vi.waitFor(() => {
        const cards = wrapper.findAllComponents(ActivityCardStub)
        expect(cards.length).toBeGreaterThan(0)
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
      const cards = wrapper.findAllComponents(ActivityCardStub)
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  BddTest().when('the component is mounted with an error', () => {
    beforeEach(async () => {
      server.use(latestActivitiesErrorHandler)
      vi.clearAllMocks()
      wrapper = mountComponent(NewActivitiesPaginatorCard, { global: { stubs } })
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="activity-error-message-stub"]').exists()).toBe(false)
      })
    })

    BddTest().then('it should render the error message', () => {
      expect(wrapper.find('[data-testid="activity-error-message-stub"]').exists()).toBe(false)
    })

    BddTest().then('it should not render activity cards', () => {
      expect(wrapper.findAllComponents(ActivityCardStub)).toHaveLength(0)
    })
  })
})
