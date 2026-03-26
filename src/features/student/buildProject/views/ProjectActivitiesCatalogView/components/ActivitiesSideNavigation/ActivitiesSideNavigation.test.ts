import { EActivityThematic } from '@/api/avenir-esr'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import ActivitiesSideNavigation from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesSideNavigation/ActivitiesSideNavigation.vue'
import { AvSideNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentProjectActivitiesCatalogMock = vi.fn()

vi.mock('@/common/composables', () => {
  return {
    useNavigation: () => ({
      navigateToStudentProjectActivitiesCatalog: navigateToStudentProjectActivitiesCatalogMock,
    }),
  }
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
    useRoute: () => ({
      params: {
        get id () { return '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1' },
        get thematic () { return EActivityThematic.SELF_KNOWLEDGE }
      }
    })
  }
})

BddTest().given('a build project activities side navigation component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesSideNavigation>>
  let queryClient: QueryClient

  const stubs = {
    AvSideNavigation: AvSideNavigationStub,
    Loader: LoaderStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      queryClient = new QueryClient()

      wrapper = mountComponent(ActivitiesSideNavigation, {
        global: { stubs },
        plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
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

    BddTest().then('it should build menu items from activities array', async () => {
      await flushPromises()
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      const items = sideNavigation.props('items') as any[]

      expect(items).toHaveLength(7)

      expect(items[0]).toEqual(expect.objectContaining({
        id: EActivityThematic.SELF_KNOWLEDGE,
        label: expect.any(String),
        icon: expect.any(String),
      }))
      expect(items[0].children).toHaveLength(4)
      expect(items[0].children?.[0]).toEqual(expect.objectContaining({
        id: '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1',
        label: 'Définir ses valeurs',
        icon: expect.any(String),
      }))

      expect(items[1]).toEqual(expect.objectContaining({
        id: EActivityThematic.FUTURE_PLANS,
        label: expect.any(String),
        icon: expect.any(String),
      }))
      expect(items[1].children).toHaveLength(4)

      expect(items[2]).toEqual(expect.objectContaining({
        id: EActivityThematic.PROGRAMS,
        label: expect.any(String),
        icon: expect.any(String),
      }))
      expect(items[2].children).toHaveLength(4)

      expect(items[3]).toEqual(expect.objectContaining({
        id: EActivityThematic.EXPERIENCES,
        label: expect.any(String),
        icon: expect.any(String),
      }))
      expect(items[3].children).toHaveLength(4)

      expect(items[4]).toEqual(expect.objectContaining({
        id: EActivityThematic.TRAJECTORIES,
        label: expect.any(String),
        icon: expect.any(String),
      }))
      expect(items[4].children).toHaveLength(4)

      expect(items[5]).toEqual(expect.objectContaining({
        id: EActivityThematic.RESUMES,
        label: expect.any(String),
        icon: expect.any(String),
      }))
      expect(items[5].children).toHaveLength(4)

      expect(items[6]).toEqual(expect.objectContaining({
        id: EActivityThematic.TRANSVERSAL,
        label: expect.any(String),
        icon: expect.any(String),
      }))
      expect(items[6].children).toHaveLength(4)
    })

    BddTest().then('it should set selectedItem to the first child by default', async () => {
      await flushPromises()
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      expect(sideNavigation.props('selectedItem')).toEqual({
        itemId: '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1',
        parentId: EActivityThematic.SELF_KNOWLEDGE,
      })
    })

    BddTest().and('the side menu collapse state changes', () => {
      beforeEach(async () => {
        await flushPromises()
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
      const selected = {
        itemId: 'some-id',
        parentId: EActivityThematic.SELF_KNOWLEDGE,
      }

      beforeEach(async () => {
        await flushPromises()
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', selected)
        await flushPromises()
      })

      BddTest().then('it should update the selected item', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('selectedItem')).toEqual(selected)
      })

      BddTest().then('it should navigate to the catalog with thematic and id', () => {
        expect(navigateToStudentProjectActivitiesCatalogMock).toHaveBeenCalledTimes(1)
        expect(navigateToStudentProjectActivitiesCatalogMock).toHaveBeenCalledWith({
          thematic: EActivityThematic.SELF_KNOWLEDGE,
          id: 'some-id',
          replace: true,
        })
      })
    })

    BddTest().and('the currently selected item is reselected', () => {
      const selected = {
        itemId: '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1',
        parentId: EActivityThematic.SELF_KNOWLEDGE,
      }

      beforeEach(async () => {
        await flushPromises()
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', selected)
        await flushPromises()
      })

      BddTest().then('it should not navigate again', () => {
        expect(navigateToStudentProjectActivitiesCatalogMock).toHaveBeenCalledTimes(0)
      })
    })

    BddTest().and('an invalid selected item format is emitted', () => {
      beforeEach(async () => {
        await flushPromises()
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', { itemId: 'INVALID_FORMAT' })
        await flushPromises()
      })

      BddTest().then('it should not navigate', () => {
        expect(navigateToStudentProjectActivitiesCatalogMock).not.toHaveBeenCalled()
      })
    })
  })
})
