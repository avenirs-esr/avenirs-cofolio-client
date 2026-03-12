import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import ActivityDetailedSideNavigation
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/navigation/ActivityDetailedSideNavigation/ActivityDetailedSideNavigation.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvSideNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity detailed side navigation component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDetailedSideNavigation>>

  const stubs = {
    AvSideNavigation: AvSideNavigationStub,
    Loader: LoaderStub,
  }

  BddTest().when('the component is mounted without props', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityDetailedSideNavigation, {
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render an AvSideNavigation component', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      expect(sideNavigation.exists()).toBe(true)
    })

    BddTest().then('it should initialize with side menu expanded', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      expect(sideNavigation.props('isSideMenuCollapsed')).toBe(false)
    })

    BddTest().then('it should pass the default selected item', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })

      expect(sideNavigation.props('selectedItem')).toEqual({
        itemId: 'activity-detailed',
      })
    })

    BddTest().then('it should build navigation items with default title fallback', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      const items = sideNavigation.props('items') as any[]

      expect(items).toHaveLength(2)

      expect(items[0]).toEqual(expect.objectContaining({
        id: 'activity-detailed',
        label: expect.any(String),
        icon: ICONS.ACTIVITY,
      }))

      expect(items[1]).toEqual(expect.objectContaining({
        id: 'my-perspective',
        label: expect.any(String),
        icon: expect.any(String),
      }))
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

    BddTest().and('a selected item is emitted by the side navigation', () => {
      const selectedItem = {
        itemId: 'my-perspective',
      }

      beforeEach(async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', selectedItem)
        await flushPromises()
      })

      BddTest().then('it should re-emit the selected item update event', () => {
        expect(wrapper.emitted('update:selectedItem')).toEqual([[selectedItem]])
      })
    })
  })

  BddTest().when('the component is mounted with props', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityDetailedSideNavigation, {
        props: {
          activityTitle: 'Mon activité',
          selectedItem: {
            itemId: 'my-perspective',
          },
        },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should use the provided activity title as first item label', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      const items = sideNavigation.props('items') as any[]

      expect(items[0]).toEqual(expect.objectContaining({
        id: 'activity-detailed',
        label: 'Mon activité',
        icon: ICONS.ACTIVITY,
      }))
    })

    BddTest().then('it should pass the provided selected item', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })

      expect(sideNavigation.props('selectedItem')).toEqual({
        itemId: 'my-perspective',
      })
    })
  })
})
