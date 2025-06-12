import type { PaginatedResponse } from '@/types'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defaultGetNextPageParam, useAvInfiniteQuery } from './use-infinite-pagination'

interface TestingDTO {
  id: string
  title: string
  countSkills: number
  countTraces: number
  progress: {
    startedActivities: number
    totalActivities: number
  }
}

const mockDataByPage: Record<number, PaginatedResponse<TestingDTO[]>> = {
  0: {
    data: [
      {
        id: '1',
        title: 'Page 0 - View A',
        countSkills: 2,
        countTraces: 3,
        progress: { startedActivities: 0, totalActivities: 5 },
      }
    ],
    page: { number: 0, size: 10, totalElements: 30, totalPages: 3 }
  },
  1: {
    data: [
      {
        id: '2',
        title: 'Page 1 - View B',
        countSkills: 3,
        countTraces: 4,
        progress: { startedActivities: 1, totalActivities: 5 },
      }
    ],
    page: { number: 1, size: 10, totalElements: 30, totalPages: 3 }
  },
  2: {
    data: [
      {
        id: '3',
        title: 'Page 2 - View C',
        countSkills: 4,
        countTraces: 5,
        progress: { startedActivities: 5, totalActivities: 5 },
      }
    ],
    page: { number: 2, size: 10, totalElements: 30, totalPages: 3 }
  }
}

describe('useAvInfiniteQuery', () => {
  it('loads and flattens pages 0, 1, 2 correctly', async () => {
    const TestComponent = defineComponent({
      setup () {
        const callCount = ref(0)

        const { data: allAms, fetchNextPage, isLoading } = useAvInfiniteQuery<TestingDTO[]>({
          queryKey: ['ams-views', callCount.value],
          queryFn: async ({ pageParam = 0 }) => {
            callCount.value++
            return mockDataByPage[pageParam]
          },
          initialPageParam: 0,
          getNextPageParam: defaultGetNextPageParam
        })
        return { allAms, fetchNextPage, isLoading }
      },
      template: `
        <div v-if="allAms?.pages">
          <div
            v-for="page in allAms.pages"
            :key="page[0]?.id"
          >
            <div
              v-for="item in page"
              :key="item.id"
              :data-test="'item-' + item.id"
            >
              {{ item.title }}
            </div>
          </div>
          <button @click="fetchNextPage()">Load more</button>
        </div>
        <div v-else>Loading...</div>
      `
    })

    const queryClient = new QueryClient()
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }]],
      }
    })

    expect(wrapper.text()).toContain('Loading...')

    await flushPromises()
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.find('[data-test="item-1"]').exists()).toBe(true)

    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-test="item-2"]').exists()).toBe(true)

    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-test="item-3"]').exists()).toBe(true)
  })
})
