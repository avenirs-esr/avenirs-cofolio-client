import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { VueWrapper } from '@vue/test-utils'
import type { Ref } from 'vue'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import { SwitchUniverseStub } from '@/common/components/SwitchUniverse/SwitchUniverse.stub'
import StudentLayout from '@/features/student/global/layouts/StudentLayout/StudentLayout.vue'
import { useStudentSummaryQuery } from '@/features/student/user'
import { AvHeaderStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, type UseQueryDefinedReturnType, VueQueryPlugin } from '@tanstack/vue-query'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const selectLanguageMock = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useLanguageSwitcher: () => ({
      selectLanguage: selectLanguageMock
    }),
  }
})

vi.mock(import('@/features/student/user'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useStudentSummaryQuery: vi.fn()
  }
})

const mockedUseStudentSummaryQuery = vi.mocked(useStudentSummaryQuery)

function mockUseStudentSummaryQuery (payload: ProfileOverviewDTO) {
  const mockData: Ref<ProfileOverviewDTO> = ref(payload)
  const mockError: Ref<null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<ProfileOverviewDTO, BaseApiException>
  mockedUseStudentSummaryQuery.mockReturnValue(queryMockedData)
}

function mockUseStudentSummaryQueryUndefined () {
  const mockData: Ref<ProfileOverviewDTO | undefined> = ref(undefined)
  const mockError: Ref<null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<ProfileOverviewDTO, BaseApiException>
  mockedUseStudentSummaryQuery.mockReturnValue(queryMockedData)
}

BddTest().given('a student layout', () => {
  let queryClient: QueryClient
  let wrapper: VueWrapper<InstanceType<typeof StudentLayout>>

  const stubs = {
    AvHeader: AvHeaderStub,
    SwitchUniverse: SwitchUniverseStub,
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
    },
    Footer: {
      name: 'Footer',
      template: '<footer data-testid="footer" />'
    }
  }

  const studentSummary = {
    firstname: 'Jeanne',
    lastname: 'Moulin',
    email: 'j.moulin@example.com',
    profilePicture: {
      url: profile_picture_placeholder
    },
    coverPicture: {
      url: profile_banner_placeholder
    },
    bio: 'Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète.'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    queryClient = new QueryClient()
    mockUseStudentSummaryQuery(studentSummary)
  })

  BddTest().and('a valid summary', () => {
    BddTest().when('the layout is rendered', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
          global: { stubs, plugins: [[VueQueryPlugin, { queryClient }]] }
        })
      })

      BddTest().then('it should render header, navigation and quicklinks correctly', async () => {
        expect(wrapper.findComponent({ name: 'AvHeader' }).exists()).toBe(true)
        expect(wrapper.find('[data-testid="navigation"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="mailbox-popover"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="notifications-popover"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="profile-popover"]').exists()).toBe(true)
      })

      BddTest().then('it should pass correct props to profile popover', async () => {
        const profilePopover = wrapper.findComponent({ name: 'StudentProfilePopover' })
        expect(profilePopover.props('username')).toBe('J. Moulin')
      })
    })

    BddTest().when('AvHeader emits update:modelValue', () => {
      BddTest().then('it should update searchQuery', async () => {
        const avHeader = wrapper.findComponent({ name: 'AvHeader' })
        avHeader.vm.$emit('update:modelValue', 'test search')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.searchQuery).toBe('test search')
      })
    })

    BddTest().when('AvHeader emits language-select', () => {
      beforeEach(async () => {
        const avHeader = wrapper.findComponent(AvHeaderStub)
        avHeader.vm.$emit('language-select', 'en')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should call selectLanguage from useLanguageSwitcher', () => {
        expect(selectLanguageMock).toHaveBeenCalledWith('en')
      })
    })

    BddTest().when('the searchQuery is updated', () => {
      BddTest().then('it should pass the value to AvHeader', async () => {
        wrapper.vm.searchQuery = 'search value'
        await wrapper.vm.$nextTick()

        const avHeader = wrapper.findComponent({ name: 'AvHeader' })
        expect(avHeader.props('modelValue')).toBe('search value')
      })
    })
  })

  BddTest().and('an undefined summary', () => {
    beforeEach(() => {
      mockUseStudentSummaryQueryUndefined()
    })

    BddTest().when('the layout is rendered', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof StudentLayout>(StudentLayout, {
          global: { stubs, plugins: [[VueQueryPlugin, { queryClient }]] }
        })
      })

      BddTest().then('it should fallback to default values', async () => {
        expect(wrapper.findComponent({ name: 'StudentProfilePopover' }).props('username')).toBe('')
      })
    })
  })
})
