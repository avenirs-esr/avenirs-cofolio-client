import DashboardCard, {
  type DashboardCardProps
} from '@/features/global/components/cards/DashboardCard/DashboardCard.vue'
import { AvCardStub, AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a dashboard card', () => {
  let wrapper: VueWrapper<InstanceType<typeof DashboardCard>>

  const stubs = {
    AvCard: AvCardStub,
    AvIcon: AvIconStub,
  }

  const props: DashboardCardProps = {
    icon: 'mdi:bell-outline',
    value: '4',
    label: 'nouvelles demandes de feedback',
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(DashboardCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.find('[data-testid="dashboard-card"]').exists()).toBe(true)
    })

    BddTest().then('it should render the icon', () => {
      const icon = wrapper.findComponent(AvIconStub)
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe(props.icon)
    })

    BddTest().then('it should render the value', () => {
      expect(wrapper.find('[data-testid="dashboard-card-value"]').text()).toBe(props.value)
    })

    BddTest().then('it should render the label', () => {
      expect(wrapper.find('[data-testid="dashboard-card-label"]').text()).toBe(props.label)
    })
  })
})
