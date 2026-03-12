import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import ActivityDetailedSelectNavigation
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/navigation/ActivityDetailedSelectNavigation/ActivityDetailedSelectNavigation.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity detailed select navigation component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDetailedSelectNavigation>>

  const stubs = {
    AvSelect: AvSelectStub,
    Loader: LoaderStub,
  }

  BddTest().when('the component is mounted without props', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityDetailedSelectNavigation, {
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render an AvSelect component', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.exists()).toBe(true)
    })

    BddTest().then('it should pass the default selected item', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })

      expect(select.props('selectedItem')).toEqual({
        itemId: 'activity-detailed',
      })
    })

    BddTest().then('it should build select options with default title fallback', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      const options = select.props('options') as any[]

      expect(options).toHaveLength(2)

      expect(options[0]).toEqual(expect.objectContaining({
        id: 'activity-detailed',
        label: expect.any(String),
      }))

      expect(options[1]).toEqual(expect.objectContaining({
        id: 'my-perspective',
        label: expect.any(String),
      }))
    })

    BddTest().then('it should pass the placeholder and label', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })

      expect(select.props('placeholder')).toEqual(expect.any(String))
      expect(select.props('label')).toEqual(expect.any(String))
    })

    BddTest().and('a selected item is emitted by the select', () => {
      const selectedItem = {
        itemId: 'my-perspective',
      }

      beforeEach(async () => {
        const select = wrapper.findComponent({ name: 'AvSelect' })
        await select.vm.$emit('update:selectedItem', selectedItem)
        await flushPromises()
      })

      BddTest().then('it should re-emit the selected item update event', () => {
        expect(wrapper.emitted('update:selectedItem')).toEqual([[selectedItem]])
      })
    })
  })

  BddTest().when('the component is mounted with props', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityDetailedSelectNavigation, {
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

    BddTest().then('it should use the provided activity title as first option label', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      const options = select.props('options') as any[]

      expect(options[0]).toEqual(expect.objectContaining({
        id: 'activity-detailed',
        label: 'Mon activité',
      }))
    })

    BddTest().then('it should pass the provided selected item', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })

      expect(select.props('selectedItem')).toEqual({
        itemId: 'my-perspective',
      })
    })
  })
})
