import type { VueWrapper } from '@vue/test-utils'
import { type NotificationDTO, NotificationDTOType } from '@/api/avenir-esr'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import NotificationsPopoverList from '@/common/notifications/components/NotificationsPopoverList/NotificationsPopoverList.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { h } from 'vue'

vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useInfiniteScroll: vi.fn(),
  }
})

BddTest().given('a notifications popover list', () => {
  let wrapper: VueWrapper<InstanceType<typeof NotificationsPopoverList>>

  const stubs = {
    Loader: LoaderStub,
  }

  const mountDefault = (props: Record<string, any> = {}) => {
    wrapper = mountComponent(NotificationsPopoverList, {
      props: {
        notifications: [],
        isFetching: false,
        ...props
      },
      slots: {
        default: ({ notification }: { notification: NotificationDTO }) =>
          h('div', {
            'data-testid': 'list-item',
            'data-id': notification.id
          })
      },
      global: { stubs }
    })
  }

  const getList = () => wrapper.find('[data-testid="notifications-popover-list"]')
  const getListItems = () => wrapper.findAll('[data-testid="list-item"]')
  const getLoader = () => wrapper.findComponent(LoaderStub)

  const mockedNotifications: NotificationDTO[] = [
    {
      id: 'notification-3',
      createdAt: '2024-01-15T10:00:00Z',
      type: NotificationDTOType.ASK_FOR_FEEDBACK,
      seen: false
    },
    {
      id: 'notification-2',
      createdAt: '2024-01-15T10:00:00Z',
      type: NotificationDTOType.ASK_FOR_FEEDBACK,
      seen: true
    },
    {
      id: 'notification-1',
      createdAt: '2024-01-15T10:00:00Z',
      type: NotificationDTOType.ASK_FOR_FEEDBACK,
      seen: true
    },
  ]

  BddTest().when('mounted with no notifications', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render the list container', () => {
      expect(getList().exists()).toBe(true)
    })

    BddTest().then('it should render no slot items', () => {
      expect(getListItems()).toHaveLength(0)
    })

    BddTest().then('it should not show the loader', () => {
      expect(getLoader().exists()).toBe(true)
      expect(getLoader().props('isLoading')).toBe(false)
    })
  })

  BddTest().when('notifications exist', () => {
    beforeEach(() => mountDefault({ notifications: mockedNotifications }))

    BddTest().then('it should render one slot item per notification', () => {
      const items = getListItems()

      expect(items).toHaveLength(mockedNotifications.length)

      mockedNotifications.forEach((n, index) => {
        expect(items[index].attributes('data-id')).toBe(n.id)
      })
    })
  })

  BddTest().when('is fetching', () => {
    beforeEach(() => mountDefault({ isFetching: true }))

    BddTest().then('it should show the loader', () => {
      const loader = getLoader()
      expect(loader.exists()).toBe(true)
      expect(loader.props('isLoading')).toBe(true)
    })
  })
})
