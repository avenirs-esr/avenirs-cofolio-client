import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ICONS } from '@/common/constants'
import NationalActivityContentTab from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a national activity content tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivityContentTab>>

  const stubs = {
    AvIconText: AvIconTextStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(NationalActivityContentTab, {
      props: { activity: mockedActivityContent },
      global: { stubs },
    })
  })

  BddTest().when('the component is mounted', () => {
    let avIconText: VueWrapper<InstanceType<typeof AvIconTextStub>>

    beforeEach(() => {
      avIconText = wrapper.findComponent(AvIconTextStub)
    })

    BddTest().then('it should render the content tab container', () => {
      expect(wrapper.find('[data-testid="national-activity-catalog-content-tab"]').exists()).toBe(true)
    })

    BddTest().then('it should render AvIconText with the activity title', () => {
      expect(avIconText.props('text')).toBe(mockedActivityContent.title)
    })

    BddTest().then('it should render AvIconText with the activity icon', () => {
      expect(avIconText.props('icon')).toBe(ICONS.ACTIVITY)
    })

    BddTest().then('it should apply the n4 typography class', () => {
      expect(avIconText.attributes('typography-class')).toBe('n4')
    })
  })
})
