import type { VueWrapper } from '@vue/test-utils'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { LoaderStub } from '@avenirs-esr/shared/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { EActivityThematic } from '@/api/avenir-esr'
import ActivitiesSelectNavigation from '@/features/student/activities/views/ActivitiesCatalogView/components/ActivitiesSelectNavigation/ActivitiesSelectNavigation.vue'

const navigateToStudentActivitiesCatalogMock = vi.fn()
const navigateToStudentWidgetActivityCatalogMock = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentActivitiesCatalog: navigateToStudentActivitiesCatalogMock,
    navigateToStudentWidgetActivityCatalog: navigateToStudentWidgetActivityCatalogMock,
  }),
}))

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
    useRoute: () => ({
      params: {
        get id () {
          return '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1'
        },
        get thematic () {
          return EActivityThematic.SELF_KNOWLEDGE
        },
      },
    }),
  }
})

BddTest().given('an ActivitiesSelectNavigation', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesSelectNavigation>>
  let queryClient: QueryClient

  const stubs = {
    AvSelect: AvSelectStub,
    Loader: LoaderStub,
  }

  function getSelect () {
    return wrapper.findComponent({ name: 'AvSelect' })
  }

  const selectedActivityId = '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1'
  const anotherActivityId = '4b9e2c7d-1f6a-4d55-9c3b-2e8f7a1c5d44'

  const selectedActivity = {
    value: anotherActivityId,
    label: 'Activité de CV',
    parentId: EActivityThematic.RESUMES,
  }

  function mountNavigation (widget: boolean) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    wrapper = mountComponent(ActivitiesSelectNavigation, {
      props: { widget },
      global: { stubs },
      plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
    })
  }

  BddTest().when('the component is mounted with widget false', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mountNavigation(false)
    })

    BddTest().then('it should render an AvSelect component', async () => {
      await flushPromises()

      expect(getSelect().exists()).toBe(true)
    })

    BddTest().then('it should provide grouped options using the expected value and label structure', async () => {
      await flushPromises()

      const options = getSelect().props('options') as Array<{
        id: string
        label: string
        children: Array<{
          value: string
          label: string
        }>
      }>

      expect(options).toHaveLength(Object.keys(EActivityThematic).length)
      expect(options[0]).toEqual(expect.objectContaining({
        id: expect.any(String),
        label: expect.any(String),
        children: expect.any(Array),
      }))
      expect(options[0].children[0]).toEqual(expect.objectContaining({
        value: expect.any(String),
        label: expect.any(String),
      }))
      expect(options[0].children[0]).not.toHaveProperty('id')
    })

    BddTest().then('it should select the activity identified by the current route', async () => {
      await flushPromises()

      expect(getSelect().props('modelValue')).toEqual(expect.objectContaining({
        value: selectedActivityId,
        label: expect.any(String),
        parentId: EActivityThematic.SELF_KNOWLEDGE,
      }))
    })

    BddTest().and('an activity is selected', () => {
      beforeEach(async () => {
        await flushPromises()
        await getSelect().vm.$emit('update:modelValue', selectedActivity)
        await flushPromises()
      })

      BddTest().then('it should navigate to the catalog with the selected thematic and activity id', () => {
        expect(navigateToStudentActivitiesCatalogMock).toHaveBeenCalledTimes(1)
        expect(navigateToStudentActivitiesCatalogMock).toHaveBeenCalledWith({
          thematic: EActivityThematic.RESUMES,
          id: anotherActivityId,
          replace: false,
        })
        expect(navigateToStudentWidgetActivityCatalogMock).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the already selected activity is selected again', () => {
      beforeEach(async () => {
        await flushPromises()

        await getSelect().vm.$emit('update:modelValue', {
          value: selectedActivityId,
          label: 'Activité sélectionnée',
          parentId: EActivityThematic.SELF_KNOWLEDGE,
        })

        await flushPromises()
      })

      BddTest().then('it should not navigate again', () => {
        expect(navigateToStudentActivitiesCatalogMock).not.toHaveBeenCalled()
        expect(navigateToStudentWidgetActivityCatalogMock).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the component is mounted with widget true', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mountNavigation(true)
    })

    BddTest().and('an activity is selected', () => {
      beforeEach(async () => {
        await flushPromises()
        await getSelect().vm.$emit('update:modelValue', selectedActivity)
        await flushPromises()
      })

      BddTest().then('it should navigate to the widget catalog with the selected thematic and activity id', () => {
        expect(navigateToStudentWidgetActivityCatalogMock).toHaveBeenCalledTimes(1)
        expect(navigateToStudentWidgetActivityCatalogMock).toHaveBeenCalledWith({
          thematic: EActivityThematic.RESUMES,
          id: anotherActivityId,
          replace: false,
        })
        expect(navigateToStudentActivitiesCatalogMock).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the already selected activity is selected again', () => {
      beforeEach(async () => {
        await flushPromises()

        await getSelect().vm.$emit('update:modelValue', {
          value: selectedActivityId,
          label: 'Activité sélectionnée',
          parentId: EActivityThematic.SELF_KNOWLEDGE,
        })

        await flushPromises()
      })

      BddTest().then('it should not navigate again', () => {
        expect(navigateToStudentActivitiesCatalogMock).not.toHaveBeenCalled()
        expect(navigateToStudentWidgetActivityCatalogMock).not.toHaveBeenCalled()
      })
    })
  })
})
