import type { BaseApiException } from '@/common/exceptions'
import type { StudentHeaderSummaryDTO } from '@/types'
import type { VueWrapper } from '@vue/test-utils'
import type { Ref } from 'vue'
import StudentLayout from '@/features/student/layouts/StudentLayout/StudentLayout.vue'
import { useStudentHeaderSummaryQuery } from '@/features/student/queries'
import { QueryClient, type UseQueryDefinedReturnType, VueQueryPlugin } from '@tanstack/vue-query'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock(import('@/features/student/queries'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useStudentHeaderSummaryQuery: vi.fn()
  }
})

const mockedUseStudentHeaderSummaryQuery = vi.mocked(useStudentHeaderSummaryQuery)

function mockUseStudentHeaderSummaryQuery (payload: StudentHeaderSummaryDTO) {
  const mockData: Ref<StudentHeaderSummaryDTO> = ref(payload)
  const mockError: Ref<null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<StudentHeaderSummaryDTO, BaseApiException>
  mockedUseStudentHeaderSummaryQuery.mockReturnValue(queryMockedData)
}

function mockUseStudentHeaderSummaryQueryUndefined () {
  const mockData: Ref<StudentHeaderSummaryDTO | undefined> = ref(undefined)
  const mockError: Ref<null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<StudentHeaderSummaryDTO, BaseApiException>
  mockedUseStudentHeaderSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentLayout', () => {
  let queryClient: QueryClient
  let wrapper: VueWrapper<InstanceType<typeof StudentLayout>>

  const stubs = {
    AvHeader: {
      name: 'AvHeader',
      props: ['modelValue', 'serviceTitle', 'homeTo', 'showSearch', 'languageSelector'],
      emits: ['update:modelValue', 'language-select'],
      template: `
        <div>
          <slot name="before-quick-links" />
          <slot name="mainnav" />
        </div>
      `
    },
    StudentMailboxPopover: {
      name: 'StudentMailboxPopover',
      props: ['messagesCount'],
      template: '<div data-testid="mailbox-popover" />'
    },
    StudentNotificationsPopover: {
      name: 'StudentNotificationsPopover',
      props: ['notificationsCount'],
      template: '<div data-testid="notifications-popover" />'
    },
    StudentProfilePopover: {
      name: 'StudentProfilePopover',
      props: ['username'],
      template: '<div data-testid="profile-popover" />'
    },
    StudentNavigation: {
      name: 'StudentNavigation',
      template: '<nav data-testid="navigation">Navigation</nav>'
    }
  }

  const headerSummary: StudentHeaderSummaryDTO = {
    id: '123456789',
    name: 'J. Moulin',
    messagesCount: 2,
    notificationsCount: 3
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    queryClient = new QueryClient()
    mockUseStudentHeaderSummaryQuery(headerSummary)
  })

  describe('given a valid header summary', () => {
    describe('when the layout is rendered', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
          global: { stubs, plugins: [[VueQueryPlugin, { queryClient }]] }
        })
      })

      it('then it should render header, navigation and quicklinks correctly', async () => {
        expect(wrapper.findComponent({ name: 'AvHeader' }).exists()).toBe(true)
        expect(wrapper.find('[data-testid="navigation"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="mailbox-popover"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="notifications-popover"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="profile-popover"]').exists()).toBe(true)
      })

      it('then it should pass correct props to mailbox popover', async () => {
        const mailboxPopover = wrapper.findComponent({ name: 'StudentMailboxPopover' })
        expect(mailboxPopover.props('messagesCount')).toBe(2)
      })

      it('then it should pass correct props to notifications popover', async () => {
        const notificationsPopover = wrapper.findComponent({ name: 'StudentNotificationsPopover' })
        expect(notificationsPopover.props('notificationsCount')).toBe(3)
      })

      it('then it should pass correct props to profile popover', async () => {
        const profilePopover = wrapper.findComponent({ name: 'StudentProfilePopover' })
        expect(profilePopover.props('username')).toBe('J. Moulin')
      })
    })

    describe('when AvHeader emits update:modelValue', () => {
      it('then it should update searchQuery', async () => {
        const avHeader = wrapper.findComponent({ name: 'AvHeader' })
        avHeader.vm.$emit('update:modelValue', 'test search')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.searchQuery).toBe('test search')
      })
    })

    describe('when the searchQuery is updated', () => {
      it('then it should pass the value to AvHeader', async () => {
        wrapper.vm.searchQuery = 'search value'
        await wrapper.vm.$nextTick()

        const avHeader = wrapper.findComponent({ name: 'AvHeader' })
        expect(avHeader.props('modelValue')).toBe('search value')
      })
    })
  })

  describe('given an undefined header summary', () => {
    beforeEach(() => {
      mockUseStudentHeaderSummaryQueryUndefined()
    })

    describe('when the layout is rendered', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
          global: { stubs, plugins: [[VueQueryPlugin, { queryClient }]] }
        })
      })

      it('then it should fallback to default values', async () => {
        expect(wrapper.findComponent({ name: 'StudentMailboxPopover' }).props('messagesCount')).toBe(0)
        expect(wrapper.findComponent({ name: 'StudentNotificationsPopover' }).props('notificationsCount')).toBe(0)
        expect(wrapper.findComponent({ name: 'StudentProfilePopover' }).props('username')).toBe('')
      })
    })
  })
})
