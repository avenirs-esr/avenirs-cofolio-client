import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'
import { SideNavigationStub } from '@/common/components/navigation/SideNavigation/SideNavigation.stub'
import AddNationalActivitySideNavigation from '@/features/staff/activities/components/navigation/AddNationalActivitySideNavigation/AddNationalActivitySideNavigation.vue'
import { ContentSectionId, ContentSectionSubActivityId, EditActivityTabIndex, PublicationSectionId } from '@/features/staff/activities/editActivity.constants'

const replaceMock = vi.fn()
const requestAnimationFrameMock = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
  callback(0)
  return 0
})

const routeQuery = { tab: 'CONTENT', mode: 'edit' }

vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
  useRoute: () => ({
    query: routeQuery,
  }),
}))

BddTest().given('AddNationalActivitySideNavigation component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddNationalActivitySideNavigation>>

  function getContentHeaderLabel () {
    const sideNav = wrapper.findComponent(SideNavigationStub)
    const items = sideNav.props('items') as Array<{ label: string }>
    return items[0].label
  }

  BddTest().when('mounted with content tab', () => {
    beforeEach(() => {
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT, isSubActivity: false },
        global: {
          stubs: {
            SideNavigation: SideNavigationStub,
          }
        }
      })
    })

    BddTest().then('it should render the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render SideNavigation', () => {
      expect(wrapper.findComponent({ name: 'SideNavigation' }).exists()).toBe(true)
    })

    BddTest().then('it should pass content items to SideNavigation', () => {
      const items = wrapper.findComponent({ name: 'SideNavigation' }).props('items')
      expect(items[0].id).toBe('CONTENT')
      expect(items[0].children).toHaveLength(Object.values(ContentSectionId).length)
    })
  })

  BddTest().when('mounted with content tab for a sub-activity', () => {
    beforeEach(() => {
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT, isSubActivity: true },
        global: {
          stubs: {
            SideNavigation: SideNavigationStub,
          }
        }
      })
    })

    BddTest().then('it should pass only the sub-activity content sections to SideNavigation', () => {
      const items = wrapper.findComponent({ name: 'SideNavigation' }).props('items')
      expect(items[0].id).toBe('CONTENT')
      expect(items[0].children.map(({ id }: { id: string }) => id)).toEqual(Object.values(ContentSectionSubActivityId))
    })

    BddTest().then('it should not list the THEMATIC and SUB_ACTIVITIES sections', () => {
      const childrenIds = wrapper.findComponent({ name: 'SideNavigation' }).props('items')[0].children.map(({ id }: { id: string }) => id)
      expect(childrenIds).not.toContain(ContentSectionId.THEMATIC)
      expect(childrenIds).not.toContain(ContentSectionId.SUB_ACTIVITIES)
    })
  })

  BddTest().when('mounted with publication tab', () => {
    beforeEach(() => {
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.PUBLICATION, isSubActivity: false },
        global: {
          stubs: {
            SideNavigation: SideNavigationStub,
          }
        }
      })
    })

    BddTest().then('it should pass publication items to SideNavigation', () => {
      const items = wrapper.findComponent({ name: 'SideNavigation' }).props('items')
      expect(items[0].id).toBe('PUBLICATION')
      expect(items[0].children).toHaveLength(Object.values(PublicationSectionId).length)
    })
  })

  BddTest().when('an item is clicked', () => {
    beforeEach(() => {
      replaceMock.mockClear()
      requestAnimationFrameMock.mockClear()
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT, isSubActivity: false },
        attachTo: document.body,
        global: {
          stubs: {
            SideNavigation: SideNavigationStub,
          }
        }
      })
    })

    BddTest().then('it should scroll to the corresponding section', () => {
      const mockScrollIntoView = vi.fn()
      const el = document.createElement('div')
      el.id = ContentSectionId.TITLE
      el.scrollIntoView = mockScrollIntoView
      document.body.appendChild(el)

      wrapper.findComponent({ name: 'SideNavigation' }).vm.$emit('update:selectedItem', {
        itemId: ContentSectionId.TITLE,
        parentId: 'CONTENT',
      })

      expect(replaceMock).toHaveBeenLastCalledWith({
        query: routeQuery,
        hash: `#${ContentSectionId.TITLE}`,
      })
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
      document.body.removeChild(el)
    })
  })

  BddTest().when('activeTab changes to publication', () => {
    beforeEach(async () => {
      replaceMock.mockClear()
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT, isSubActivity: false },
        global: {
          stubs: {
            SideNavigation: SideNavigationStub,
          }
        }
      })
      await wrapper.setProps({ activeTab: EditActivityTabIndex.PUBLICATION })
    })

    BddTest().then('it should update items to publication', () => {
      const items = wrapper.findComponent({ name: 'SideNavigation' }).props('items')
      expect(items[0].id).toBe('PUBLICATION')
    })
  })

  BddTest().when('mounted', () => {
    beforeEach(() => {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search)
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT, isSubActivity: false },
        global: {
          stubs: {
            SideNavigation: SideNavigationStub,
          }
        }
      })
    })

    BddTest().then('it should initialize selectedItem as empty', () => {
      const selectedItem = wrapper.findComponent({ name: 'SideNavigation' }).props('selectedItem')
      expect(selectedItem.itemId).toBe('')
    })
  })

  BddTest().when('the activity is a main activity', () => {
    beforeEach(() => {
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT, isSubActivity: false },
        attachTo: document.body,
        global: { stubs: { SideNavigation: SideNavigationStub } },
      })
    })

    BddTest().then('it should display the activity content header', () => {
      expect(getContentHeaderLabel())
        .toBe('Contenu de l\'activité')
    })
  })

  BddTest().when('the activity is a sub-activity', () => {
    beforeEach(() => {
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT, isSubActivity: true },
        attachTo: document.body,
        global: { stubs: { SideNavigation: SideNavigationStub } },
      })
    })

    BddTest().then('it should display the sub-activity content header', () => {
      expect(getContentHeaderLabel())
        .toBe('Contenu de la sous-activité')
    })
  })
})
