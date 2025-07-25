import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { ProjectExperienceItems } from '../../types'
import StudentProjectExperiencesSideMenuContent from './StudentProjectExperiencesSideMenuContent.vue'

const stubs = {
  AvList: {
    name: 'AvList',
    props: ['size'],
    template: '<div class="av-list-stub"><slot /></div>'
  },
  AvListItem: {
    name: 'AvListItem',
    props: ['title', 'icon', 'iconSize', 'selected', 'tag', 'clickable'],
    emits: ['click'],
    template: '<div class="av-list-item-stub" @click="$emit(\'click\')" />'
  }
}

describe('studentProjectExperiencesSideMenuContent', () => {
  describe('given a side menu content component', () => {
    let wrapper: VueWrapper<InstanceType<typeof StudentProjectExperiencesSideMenuContent>>

    beforeEach(() => {
      wrapper = mount(StudentProjectExperiencesSideMenuContent, {
        props: {
          'isSideMenuCollapsed': false,
          'selectedItem': ProjectExperienceItems.CAREERS,
          'onUpdate:selectedItem': (value: ProjectExperienceItems) => wrapper.setProps({ selectedItem: value })
        },
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render an AvList component', () => {
        const avList = wrapper.findComponent({ name: 'AvList' })
        expect(avList.exists()).toBe(true)
        expect(avList.props('size')).toBe('small')
      })

      it('then it should render 4 menu items', () => {
        const menuItems = wrapper.findAllComponents({ name: 'AvListItem' })
        expect(menuItems).toHaveLength(4)
      })

      it('then each menu item should have correct props when not collapsed', () => {
        const menuItems = wrapper.findAllComponents({ name: 'AvListItem' })

        expect(menuItems[0].props('title')).toBe('Mon parcours')
        expect(menuItems[0].props('icon')).toBe('mdi:briefcase-variant-outline')
        expect(menuItems[0].props('selected')).toBe(true)

        expect(menuItems[1].props('title')).toBe('Mes formations')
        expect(menuItems[1].props('icon')).toBe('mdi:school-outline')
        expect(menuItems[1].props('selected')).toBe(false)

        expect(menuItems[2].props('title')).toBe('Mes expériences')
        expect(menuItems[2].props('icon')).toBe('mdi:vector-polygon-variant')
        expect(menuItems[2].props('selected')).toBe(false)

        expect(menuItems[3].props('title')).toBe('Mes activités')
        expect(menuItems[3].props('icon')).toBe('mdi:target-arrow')
        expect(menuItems[3].props('selected')).toBe(false)
      })

      it('then all menu items should have common attributes', () => {
        const menuItems = wrapper.findAllComponents({ name: 'AvListItem' })

        menuItems.forEach((item) => {
          expect(item.props('iconSize')).toBe(1.8)
          expect(item.props('tag')).toBe('button')
          expect(item.props('clickable')).toBe('')
          expect(item.classes()).toContain('student-project-experiences-container__menu-item')
        })
      })
    })

    describe('when the side menu is collapsed', () => {
      beforeEach(() => {
        wrapper.setProps({ isSideMenuCollapsed: true })
      })

      it('then menu items should not have title attribute', () => {
        const menuItems = wrapper.findAllComponents({ name: 'AvListItem' })

        menuItems.forEach((item) => {
          expect(item.props('title')).toBeUndefined()
        })
      })

      it('then menu items should have collapsed class', () => {
        const menuItems = wrapper.findAllComponents({ name: 'AvListItem' })

        menuItems.forEach((item) => {
          expect(item.classes()).toContain('student-project-experiences-container__menu-item--collapsed')
        })
      })
    })

    describe('when a menu item is clicked', () => {
      it('then it should update the selected item for valid enum value', async () => {
        const menuItems = wrapper.findAllComponents({ name: 'AvListItem' })

        await menuItems[1].trigger('click')

        expect(wrapper.props('selectedItem')).toBe(ProjectExperienceItems.EDUCATIONS)
      })

      it('then the newly selected item should be marked as selected', async () => {
        await wrapper.setProps({ selectedItem: ProjectExperienceItems.EXPERIENCES })

        const menuItems = wrapper.findAllComponents({ name: 'AvListItem' })

        expect(menuItems[0].props('selected')).toBe(false)
        expect(menuItems[1].props('selected')).toBe(false)
        expect(menuItems[2].props('selected')).toBe(true)
        expect(menuItems[3].props('selected')).toBe(false)
      })
    })
  })
})
