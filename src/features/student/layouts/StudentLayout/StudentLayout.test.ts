import type { BaseApiException } from '@/common/exceptions'
import type { StudentHeaderSummaryDTO } from '@/types'
import type { Ref } from 'vue'
import { useStudentHeaderSummaryQuery } from '@/features/student/queries'
import { MDI_ICONS } from '@/ui'
import { QueryClient, type UseQueryDefinedReturnType, VueQueryPlugin } from '@tanstack/vue-query'
import { mountWithRouter } from 'tests/utils'
import { describe, expect, it, vi } from 'vitest'
import StudentLayout from './StudentLayout.vue'

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
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<StudentHeaderSummaryDTO, BaseApiException>
  mockedUseStudentHeaderSummaryQuery.mockReturnValue(queryMockedData)
}

function mockUseStudentHeaderSummaryQueryUndefined () {
  const mockData: Ref<StudentHeaderSummaryDTO | undefined> = ref(undefined)
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<StudentHeaderSummaryDTO, BaseApiException>
  mockedUseStudentHeaderSummaryQuery.mockReturnValue(queryMockedData)
}

describe('studentLayout', () => {
  let queryClient: QueryClient
  const stubs = {
    AvHeader: {
      name: 'AvHeader',
      props: ['modelValue', 'serviceTitle', 'homeTo', 'quickLinks', 'languageSelector'],
      emits: ['update:modelValue', 'language-select'],
      template: `
        <div>
          <button @click="quickLinks[0].onClick($event)" data-testid="mailbox-btn">Mailbox</button>
          <button @click="quickLinks[1].onClick($event)" data-testid="notifications-btn">Notifications</button>
          <button @click="quickLinks[2].onClick($event)" data-testid="profile-btn">Profile</button>
          <slot name="mainnav" />
        </div>
      `,
    },
    StudentMailboxModal: {
      name: 'StudentMailboxModal',
      props: ['showModal', 'onClose', 'messagesCount'],
      template: '<div v-if="showModal" data-testid="mailbox-modal">MailboxModal</div>',
    },
    StudentNotificationsModal: {
      name: 'StudentNotificationsModal',
      props: ['showModal', 'onClose', 'notificationsCount'],
      template: '<div v-if="showModal" data-testid="notifications-modal">NotificationsModal</div>',
    },
    StudentProfileModal: {
      name: 'StudentProfileModal',
      props: ['showModal', 'onClose'],
      template: '<div v-if="showModal" data-testid="profile-modal">ProfileModal</div>',
    },
    StudentNavigation: {
      name: 'StudentNavigation',
      template: '<nav data-testid="navigation">Navigation</nav>',
    },
  }
  const headerSummary = {
    id: '123456789',
    name: 'J. Moulin',
    messagesCount: 2,
    notificationsCount: 2,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    queryClient = new QueryClient()
    mockUseStudentHeaderSummaryQuery(headerSummary)
  })

  it('should render header and nav correctly', async () => {
    const wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
      global: {
        stubs,
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })
    expect(wrapper.findComponent({ name: 'AvHeader' }).exists()).toBe(true)
    expect(wrapper.find('[data-testid="navigation"]').exists()).toBe(true)
  })

  it('should open mailbox modal on click and close it when onClose is called', async () => {
    const wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
      global: {
        stubs,
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })
    await wrapper.find('[data-testid="mailbox-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="mailbox-modal"]').exists()).toBe(true)

    await wrapper.findComponent({ name: 'StudentMailboxModal' }).vm.onClose()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="mailbox-modal"]').exists()).toBe(false)
  })

  it('should open notifications modal on click and close it when onClose is called', async () => {
    const wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
      global: {
        stubs,
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })
    await wrapper.find('[data-testid="notifications-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="notifications-modal"]').exists()).toBe(true)

    await wrapper.findComponent({ name: 'StudentNotificationsModal' }).vm.onClose()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="notifications-modal"]').exists()).toBe(false)
  })

  it('should open profile modal on click and close it when onClose is called', async () => {
    const wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
      global: {
        stubs,
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })
    await wrapper.find('[data-testid="profile-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="profile-modal"]').exists()).toBe(true)

    await wrapper.findComponent({ name: 'StudentProfileModal' }).vm.onClose()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="profile-modal"]').exists()).toBe(false)
  })

  it('should use BELL_NOTIFICATION icon when there are notifications', async () => {
    const wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
      global: {
        stubs,
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })
    const quickLinks = wrapper.findComponent({ name: 'AvHeader' }).props('quickLinks')

    expect(quickLinks[1].icon).toBe(MDI_ICONS.BELL_NOTIFICATION)
  })

  it('should use NOTIFICATIONS_NONE icon when there are no notifications', async () => {
    mockUseStudentHeaderSummaryQuery({ ...headerSummary, notificationsCount: 0 })
    const wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
      global: {
        stubs,
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })
    const quickLinks = wrapper.findComponent({ name: 'AvHeader' }).props('quickLinks')

    expect(quickLinks[1].icon).toBe(MDI_ICONS.NOTIFICATIONS_NONE)
  })

  it('should use default values if header summary is undefined', async () => {
    mockUseStudentHeaderSummaryQueryUndefined()
    const wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
      global: {
        stubs,
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })

    const quickLinks = wrapper.findComponent({ name: 'AvHeader' }).props('quickLinks')
    expect(quickLinks[1].icon).toBe(MDI_ICONS.NOTIFICATIONS_NONE)
    expect(quickLinks[2].label).toBe('')

    const mailboxModal = wrapper.findComponent({ name: 'StudentMailboxModal' })
    expect(mailboxModal.props('messagesCount')).toBe(0)

    const notificationsModal = wrapper.findComponent({ name: 'StudentNotificationsModal' })
    expect(notificationsModal.props('notificationsCount')).toBe(0)
  })

  it('should update searchQuery when AvHeader emits update:modelValue', async () => {
    const wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
      global: {
        stubs,
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })
    const avHeader = wrapper.findComponent({ name: 'AvHeader' })
    avHeader.vm.$emit('update:modelValue', 'test')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.searchQuery).toBe('test')
  })

  it('should pass searchQuery as modelValue to AvHeader', async () => {
    const wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
      global: {
        stubs,
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })
    const avHeader = wrapper.findComponent({ name: 'AvHeader' })
    wrapper.vm.searchQuery = 'test'
    await wrapper.vm.$nextTick()

    expect(avHeader.props('modelValue')).toBe('test')
  })

  // TODO: it's the only component not working with that but I don't understand why
  // testUseBaseApiExceptionToast<StudentHeaderSummaryDTO>({
  //   mockedUseQuery: mockedUseStudentHeaderSummaryQuery,
  //   payload: headerSummary,
  //   mountComponent: () => mountWithRouter<typeof StudentLayout>(StudentLayout, {
  //     global: {
  //       stubs,
  //       plugins: [[VueQueryPlugin, { queryClient }]],
  //     },
  //   })
  // })
})
