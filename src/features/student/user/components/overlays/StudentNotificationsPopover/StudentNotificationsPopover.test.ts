import type { VueWrapper } from '@vue/test-utils'
import { NotificationsPopoverStub } from '@/common/notifications/components/NotificationsPopover/NotificationsPopover.stub'
import StudentNotificationsPopover from '@/features/student/user/components/overlays/StudentNotificationsPopover/StudentNotificationsPopover.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a StudentNotificationsPopover', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentNotificationsPopover>>

  const stubs = {
    NotificationsPopover: NotificationsPopoverStub
  }

  const mountDefault = () => {
    wrapper = mountComponent(StudentNotificationsPopover, {
      global: { stubs }
    })
  }

  const getPopover = () => wrapper.findComponent(NotificationsPopoverStub)
  const getHeader = () => wrapper.find('[data-testid="student-notifications-popover-contexts-header"]')
  const getList = () => wrapper.find('[data-testid="student-notifications-popover-contexts"]')

  BddTest().when('the component is rendered', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render NotificationsPopover with correct props', () => {
      expect(getPopover().exists()).toBe(true)
    })

    BddTest().then('it should render empty slot header', () => {
      expect(getHeader().text()).toBe('Vous recevrez une notification dans les cas suivants :')
    })

    BddTest().then('it should render all context items', () => {
      const text = getList().text()
      expect(text).toContain('Un enseignant vous enverra un message')
      expect(text).toContain('Un tiers vous aura évalué sur une compétence')
      expect(text).toContain('Une trace a été validée')
      expect(text).toContain('Un événement a lieu prochainement')
    })
  })
})
