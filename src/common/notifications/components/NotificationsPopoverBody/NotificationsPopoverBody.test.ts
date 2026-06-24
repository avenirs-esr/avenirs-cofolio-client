import { EUserCategory } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import NotificationsPopoverBody from '@/common/notifications/components/NotificationsPopoverBody/NotificationsPopoverBody.vue'
import { NotificationsPopoverEmptyOrDisabledStub } from '@/common/notifications/components/NotificationsPopoverEmptyOrDisabled/NotificationsPopoverEmptyOrDisabled.stub'
import { NotificationsPopoverListStub } from '@/common/notifications/components/NotificationsPopoverList/NotificationsPopoverList.stub'
import { NotificationsPopoverPreferenceToggleStub } from '@/common/notifications/components/NotificationsPopoverPreferenceToggle/NotificationsPopoverPreferenceToggle.stub'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvButtonStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a notifications popover body', () => {
  let wrapper: VueWrapper<InstanceType<typeof NotificationsPopoverBody>>

  const stubs = {
    NotificationsPopoverList: NotificationsPopoverListStub,
    NotificationsPopoverEmptyOrDisabled: NotificationsPopoverEmptyOrDisabledStub,
    NotificationsPopoverPreferenceToggle: NotificationsPopoverPreferenceToggleStub,
    QuerySuspense: QuerySuspenseStub,
    AvButton: AvButtonStub,
    AvIconText: AvIconTextStub,
  }

  const mountDefault = async (userCategory: EUserCategory = EUserCategory.STAFF) => {
    wrapper = mountComponent(NotificationsPopoverBody, {
      props: { userCategory },
      global: { stubs }
    })
    await flushPromises()
  }

  const getTitle = () => wrapper.findComponent('[data-testid="notifications-popover-body-title"]') as VueWrapper<InstanceType<typeof AvIconTextStub>>
  const getList = () => wrapper.findComponent(NotificationsPopoverListStub)
  const getEmpty = () => wrapper.findComponent(NotificationsPopoverEmptyOrDisabledStub)
  const getPreferenceToggle = () => wrapper.findComponent(NotificationsPopoverPreferenceToggleStub)
  const getCloseButton = () => wrapper.findComponent('[data-testid="notifications-popover-body-close"]') as VueWrapper<InstanceType<typeof AvButtonStub>>

  BddTest().when('notifications are enabled', () => {
    beforeEach(() => mountDefault(EUserCategory.STAFF))

    BddTest().then('it should render title with unseen notification counter', () => {
      const title = getTitle()

      expect(title.exists()).toBe(true)
      expect(title.props('icon')).toBe(MDI_ICONS.NOTIFICATIONS_NONE)
      expect(title.props('text')).toBe('10 notifications non lues')
    })

    BddTest().then('it should not render the list content', () => {
      expect(getList().exists()).toBe(false)
    })

    BddTest().then('it should render the empty content', () => {
      const empty = getEmpty()

      expect(empty.exists()).toBe(true)
      expect(empty.props('userCategory')).toBe(EUserCategory.STAFF)
    })

    BddTest().then('it should render the preference toggle with correct props', () => {
      const preferenceToggle = getPreferenceToggle()

      expect(preferenceToggle.exists()).toBe(true)
      expect(preferenceToggle.props('userCategory')).toBe(EUserCategory.STAFF)
    })

    BddTest().then('it should render the close button with correct props', () => {
      const closeButton = getCloseButton()

      expect(closeButton.exists()).toBe(true)
      expect(closeButton.props('icon')).toBe(MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
      expect(closeButton.props('label')).toBe('Quitter')
    })
  })

  BddTest().when('notifications are disabled', () => {
    beforeEach(() => mountDefault(EUserCategory.STUDENT))

    BddTest().then('it should render title without unseen notification counter', () => {
      const title = getTitle()

      expect(title.exists()).toBe(true)
      expect(title.props('icon')).toBe(MDI_ICONS.NOTIFICATIONS_NONE)
      expect(title.props('text')).toBe('Aucune notification non lue')
    })

    BddTest().then('it should not render the list content', () => {
      expect(getList().exists()).toBe(false)
    })

    BddTest().then('it should render the empty with correct props', () => {
      const empty = getEmpty()

      expect(empty.exists()).toBe(true)
      expect(empty.props('userCategory')).toBe(EUserCategory.STUDENT)
    })

    BddTest().then('it should render the preference toggle with correct props', () => {
      const preferenceToggle = getPreferenceToggle()

      expect(preferenceToggle.exists()).toBe(true)
      expect(preferenceToggle.props('userCategory')).toBe(EUserCategory.STUDENT)
    })

    BddTest().then('it should render the close button with correct props', () => {
      const closeButton = getCloseButton()

      expect(closeButton.exists()).toBe(true)
      expect(closeButton.props('icon')).toBe(MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
      expect(closeButton.props('label')).toBe('Quitter')
    })
  })

  BddTest().when('user clicks close button', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should emit close', async () => {
      await getCloseButton().trigger('click')
      expect(wrapper.emitted('close')?.length).toBe(1)
    })
  })
})
