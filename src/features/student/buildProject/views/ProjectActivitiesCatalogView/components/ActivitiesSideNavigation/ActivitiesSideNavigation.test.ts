import { activitiesNavigationMock } from '@/__mocks__/fixtures/student/activities.fixtures'
import { EActivityThematic } from '@/api/avenir-esr'
import ActivitiesSideNavigation
  from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesSideNavigation/ActivitiesSideNavigation.vue'
import { AvSideNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/features/student/buildProject/queries/use-activities.query/use-activities.query', () => {
  return {
    useActivitiesNavigationQuery: () => ({
      activities: computed(() => activitiesNavigationMock),
      isLoading: computed(() => false),
      isError: computed(() => false),
    })
  }
})

BddTest().given('a build project activities side navigation component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesSideNavigation>>

  const stubs = {
    AvSideNavigation: AvSideNavigationStub,
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(ActivitiesSideNavigation, {
        global: { stubs }
      })
    })

    BddTest().then('it should render an AvSideNavigation component', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      expect(sideNavigation.exists()).toBe(true)
    })

    BddTest().then('it should initialize with side menu expanded', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      expect(sideNavigation.props('isSideMenuCollapsed')).toBe(false)
    })

    BddTest().then('it should build menu items from activities map', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      const items = sideNavigation.props('items')

      expect(items).toHaveLength(7)

      expect(items[0]).toEqual(expect.objectContaining({
        id: EActivityThematic.ABOUT_ME,
        label: expect.any(String),
        icon: expect.any(String),
        expanded: true,
      }))
      expect(items[0].children).toHaveLength(2)

      expect(items[1]).toEqual(expect.objectContaining({
        id: EActivityThematic.FUTURE_PLANS,
        label: expect.any(String),
        icon: expect.any(String),
        expanded: false,
      }))
      expect(items[1].children).toHaveLength(2)

      expect(items[2]).toEqual(expect.objectContaining({
        id: EActivityThematic.PROGRAMS,
        label: expect.any(String),
        icon: expect.any(String),
        expanded: false,
      }))
      expect(items[2].children).toHaveLength(1)

      expect(items[3]).toEqual(expect.objectContaining({
        id: EActivityThematic.EXPERIENCES,
        label: expect.any(String),
        icon: expect.any(String),
        expanded: false,
      }))
      expect(items[3].children).toHaveLength(4)

      expect(items[4]).toEqual(expect.objectContaining({
        id: EActivityThematic.TRAJECTORIES,
        label: expect.any(String),
        icon: expect.any(String),
        expanded: false,
      }))
      expect(items[4].children).toHaveLength(3)

      expect(items[5]).toEqual(expect.objectContaining({
        id: EActivityThematic.CV,
        label: expect.any(String),
        icon: expect.any(String),
        expanded: false,
      }))
      expect(items[5].children).toHaveLength(2)

      expect(items[6]).toEqual(expect.objectContaining({
        id: EActivityThematic.TRANSVERSAL,
        label: expect.any(String),
        icon: expect.any(String),
        expanded: false,
      }))
      expect(items[6].children).toHaveLength(1)
    })

    BddTest().then('it should set selectedItem to the first child by default', async () => {
      await flushPromises()
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      expect(sideNavigation.props('selectedItem')).toBe('a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p')
    })

    BddTest().and('the side menu collapse state changes', () => {
      beforeEach(async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:isSideMenuCollapsed', true)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the collapsed prop', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('isSideMenuCollapsed')).toBe(true)
      })
    })

    BddTest().and('a navigation child item is selected', () => {
      beforeEach(async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', '4b9e2c7d-1f6a-4d55-9c3b-2e8f7a1c5d44')
        await flushPromises()
      })

      BddTest().then('it should update the selected item', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('selectedItem')).toBe('4b9e2c7d-1f6a-4d55-9c3b-2e8f7a1c5d44')
      })
    })
  })
})
