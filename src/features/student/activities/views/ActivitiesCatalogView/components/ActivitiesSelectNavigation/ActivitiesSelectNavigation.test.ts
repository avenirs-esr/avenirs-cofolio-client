import { EActivityThematic } from '@/api/avenir-esr'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import ActivitiesSelectNavigation from '@/features/student/activities/views/ActivitiesCatalogView/components/ActivitiesSelectNavigation/ActivitiesSelectNavigation.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentActivitiesCatalogMock = vi.fn()
const navigateToStudentWidgetActivityCatalogMock = vi.fn()

vi.mock('@/common/composables', () => {
  return {
    useNavigation: () => ({
      navigateToStudentActivitiesCatalog: navigateToStudentActivitiesCatalogMock,
      navigateToStudentWidgetActivityCatalog: navigateToStudentWidgetActivityCatalogMock,
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

BddTest().given('an ActivitiesSelectNavigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesSelectNavigation>>
  let queryClient: QueryClient

  const stubs = {
    AvSelect: AvSelectStub,
    Loader: LoaderStub
  }

  BddTest().when('the component is mounted with widget false', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      queryClient = new QueryClient()

      wrapper = mountComponent(ActivitiesSelectNavigation, {
        props: { widget: false },
        global: { stubs },
        plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
      })
    })

    BddTest().then('it should render an AvSelect component', async () => {
      await flushPromises()

      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.exists()).toBe(true)
    })

    BddTest().then('it should provide grouped select options derived from items', async () => {
      await flushPromises()

      const select = wrapper.findComponent({ name: 'AvSelect' })
      const options = select.props('options') as any[]

      expect(options.length).toBe(7)
      expect(options[0]).toEqual(expect.objectContaining({
        id: expect.any(String),
        label: expect.any(String),
        children: expect.any(Array),
      }))
      expect(options[0].children[0]).toEqual(expect.objectContaining({
        id: expect.any(String),
        label: expect.any(String),
      }))
    })

    BddTest().then('it should set selectedItem to the first child by default', async () => {
      await flushPromises()

      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('selectedItem')).toEqual({
        itemId: '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1',
        parentId: EActivityThematic.SELF_KNOWLEDGE,
      })
    })

    BddTest().and('a select option is chosen', () => {
      const selected = {
        itemId: '4b9e2c7d-1f6a-4d55-9c3b-2e8f7a1c5d44',
        parentId: EActivityThematic.RESUMES,
      }

      beforeEach(async () => {
        await flushPromises()
        const select = wrapper.findComponent({ name: 'AvSelect' })
        await select.vm.$emit('update:selectedItem', selected)
        await flushPromises()
      })

      BddTest().then('it should navigate to the catalog with thematic and id', () => {
        expect(navigateToStudentActivitiesCatalogMock).toHaveBeenCalledTimes(1)
        expect(navigateToStudentActivitiesCatalogMock).toHaveBeenCalledWith({
          thematic: EActivityThematic.RESUMES,
          id: '4b9e2c7d-1f6a-4d55-9c3b-2e8f7a1c5d44',
          replace: false,
        })
        expect(navigateToStudentWidgetActivityCatalogMock).toHaveBeenCalledTimes(0)
      })
    })

    BddTest().and('the user selects the already selected option', () => {
      beforeEach(async () => {
        await flushPromises()
        const select = wrapper.findComponent({ name: 'AvSelect' })
        await select.vm.$emit('update:selectedItem', {
          itemId: '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1',
          parentId: EActivityThematic.SELF_KNOWLEDGE,
        })
        await flushPromises()
      })

      BddTest().then('it should not navigate again', () => {
        expect(navigateToStudentActivitiesCatalogMock).toHaveBeenCalledTimes(0)
        expect(navigateToStudentWidgetActivityCatalogMock).toHaveBeenCalledTimes(0)
      })
    })
  })

  BddTest().when('the component is mounted with widget true', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      queryClient = new QueryClient()

      wrapper = mountComponent(ActivitiesSelectNavigation, {
        props: { widget: true },
        global: { stubs },
        plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
      })
    })

    BddTest().and('a select option is chosen', () => {
      const selected = {
        itemId: '4b9e2c7d-1f6a-4d55-9c3b-2e8f7a1c5d44',
        parentId: EActivityThematic.RESUMES,
      }

      beforeEach(async () => {
        await flushPromises()
        const select = wrapper.findComponent({ name: 'AvSelect' })
        await select.vm.$emit('update:selectedItem', selected)
        await flushPromises()
      })

      BddTest().then('it should navigate to the widget catalog with thematic and id', () => {
        expect(navigateToStudentWidgetActivityCatalogMock).toHaveBeenCalledTimes(1)
        expect(navigateToStudentWidgetActivityCatalogMock).toHaveBeenCalledWith({
          thematic: EActivityThematic.RESUMES,
          id: '4b9e2c7d-1f6a-4d55-9c3b-2e8f7a1c5d44',
          replace: false,
        })
        expect(navigateToStudentActivitiesCatalogMock).toHaveBeenCalledTimes(0)
      })
    })

    BddTest().and('the user selects the already selected option', () => {
      beforeEach(async () => {
        await flushPromises()
        const select = wrapper.findComponent({ name: 'AvSelect' })
        await select.vm.$emit('update:selectedItem', {
          itemId: '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1',
          parentId: EActivityThematic.SELF_KNOWLEDGE,
        })
        await flushPromises()
      })

      BddTest().then('it should not navigate again', () => {
        expect(navigateToStudentActivitiesCatalogMock).toHaveBeenCalledTimes(0)
        expect(navigateToStudentWidgetActivityCatalogMock).toHaveBeenCalledTimes(0)
      })
    })
  })
})
