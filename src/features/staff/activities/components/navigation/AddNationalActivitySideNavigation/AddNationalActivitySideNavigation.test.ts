import AddNationalActivitySideNavigation from '@/features/staff/activities/components/navigation/AddNationalActivitySideNavigation/AddNationalActivitySideNavigation.vue'
import { ContentSectionId, EditActivityTabIndex, PublicationSectionId } from '@/features/staff/activities/editActivity.constants'
import { AvSideNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

BddTest().given('AddNationalActivitySideNavigation component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddNationalActivitySideNavigation>>

  BddTest().when('mounted with content tab', () => {
    beforeEach(() => {
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT },
        global: {
          stubs: {
            AvSideNavigation: AvSideNavigationStub,
          }
        }
      })
    })

    BddTest().then('it should render the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render AvSideNavigation', () => {
      expect(wrapper.findComponent({ name: 'AvSideNavigation' }).exists()).toBe(true)
    })

    BddTest().then('it should pass content items to AvSideNavigation', () => {
      const items = wrapper.findComponent({ name: 'AvSideNavigation' }).props('items')
      expect(items[0].id).toBe('CONTENT')
      expect(items[0].children).toHaveLength(Object.values(ContentSectionId).length)
    })
  })

  BddTest().when('mounted with publication tab', () => {
    beforeEach(() => {
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.PUBLICATION },
        global: {
          stubs: {
            AvSideNavigation: AvSideNavigationStub,
          }
        }
      })
    })

    BddTest().then('it should pass publication items to AvSideNavigation', () => {
      const items = wrapper.findComponent({ name: 'AvSideNavigation' }).props('items')
      expect(items[0].id).toBe('PUBLICATION')
      expect(items[0].children).toHaveLength(Object.values(PublicationSectionId).length)
    })
  })

  BddTest().when('an item is clicked', () => {
    beforeEach(() => {
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT },
        attachTo: document.body,
        global: {
          stubs: {
            AvSideNavigation: AvSideNavigationStub,
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

      wrapper.findComponent({ name: 'AvSideNavigation' }).vm.$emit('update:selectedItem', {
        itemId: ContentSectionId.TITLE,
        parentId: 'CONTENT',
      })

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
      document.body.removeChild(el)
    })
  })

  BddTest().when('activeTab changes to publication', () => {
    beforeEach(async () => {
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT },
        global: {
          stubs: {
            AvSideNavigation: AvSideNavigationStub,
          }
        }
      })
      await wrapper.setProps({ activeTab: EditActivityTabIndex.PUBLICATION })
    })

    BddTest().then('it should update items to publication', () => {
      const items = wrapper.findComponent({ name: 'AvSideNavigation' }).props('items')
      expect(items[0].id).toBe('PUBLICATION')
    })
  })

  BddTest().when('mounted', () => {
    beforeEach(() => {
      wrapper = mount(AddNationalActivitySideNavigation, {
        props: { activeTab: EditActivityTabIndex.CONTENT },
        global: {
          stubs: {
            AvSideNavigation: AvSideNavigationStub,
          }
        }
      })
    })

    BddTest().then('it should initialize selectedItem as empty', () => {
      const selectedItem = wrapper.findComponent({ name: 'AvSideNavigation' }).props('selectedItem')
      expect(selectedItem.itemId).toBe('')
    })
  })
})
