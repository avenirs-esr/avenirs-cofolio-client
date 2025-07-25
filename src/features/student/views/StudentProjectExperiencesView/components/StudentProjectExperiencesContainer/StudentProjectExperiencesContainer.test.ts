import { mount, type VueWrapper } from '@vue/test-utils'
import StudentProjectExperiencesContainer from 'src/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesContainer/StudentProjectExperiencesContainer.vue'
import { ProjectExperienceItems } from 'src/features/student/views/StudentProjectExperiencesView/types'
import { beforeEach, describe, expect, it } from 'vitest'

const stubs = {
  AvSideMenu: {
    name: 'AvSideMenu',
    props: ['collapsed', 'collapsedWidth'],
    emits: ['update:collapsed'],
    template: '<div class="av-side-menu-stub" @click="$emit(\'update:collapsed\', !collapsed)"><slot /></div>'
  },
  StudentProjectExperiencesSideMenuContent: {
    name: 'StudentProjectExperiencesSideMenuContent',
    props: ['selectedItem', 'isSideMenuCollapsed'],
    emits: ['update:selectedItem'],
    template: '<div class="side-menu-content-stub" @click="$emit(\'update:selectedItem\', \'EDUCATIONS\')" />'
  },
  StudentProjectExperiencesCareersSection: {
    name: 'StudentProjectExperiencesCareersSection',
    template: '<div class="careers-section-stub">Careers Section</div>'
  },
  StudentProjectExperiencesEducationsSection: {
    name: 'StudentProjectExperiencesEducationsSection',
    template: '<div class="educations-section-stub">Educations Section</div>'
  },
  StudentProjectExperiencesExperiencesSection: {
    name: 'StudentProjectExperiencesExperiencesSection',
    template: '<div class="experiences-section-stub">Experiences Section</div>'
  },
  StudentProjectExperiencesActivitiesSection: {
    name: 'StudentProjectExperiencesActivitiesSection',
    template: '<div class="activities-section-stub">Activities Section</div>'
  }
}

describe('studentProjectExperiencesContainer', () => {
  describe('given a project experiences container component', () => {
    let wrapper: VueWrapper<InstanceType<typeof StudentProjectExperiencesContainer>>

    beforeEach(() => {
      wrapper = mount(StudentProjectExperiencesContainer, {
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the main container with correct class', () => {
        expect(wrapper.find('.student-project-experiences-container').exists()).toBe(true)
      })

      it('then it should render an AvSideMenu component', () => {
        const sideMenu = wrapper.findComponent({ name: 'AvSideMenu' })
        expect(sideMenu.exists()).toBe(true)
        expect(sideMenu.props('collapsedWidth')).toBe('3.5rem')
        expect(sideMenu.props('collapsed')).toBe(false)
      })

      it('then it should render the side menu content component', () => {
        const sideMenuContent = wrapper.findComponent({ name: 'StudentProjectExperiencesSideMenuContent' })
        expect(sideMenuContent.exists()).toBe(true)
        expect(sideMenuContent.props('isSideMenuCollapsed')).toBe(false)
        expect(sideMenuContent.props('selectedItem')).toBe(ProjectExperienceItems.CAREERS)
      })

      it('then it should render the content area', () => {
        const contentArea = wrapper.find('.student-project-experiences-container__content')
        expect(contentArea.exists()).toBe(true)
      })

      it('then it should display the careers section by default', () => {
        const careersSection = wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' })
        expect(careersSection.exists()).toBe(true)
      })
    })

    describe('when the side menu is collapsed', () => {
      beforeEach(async () => {
        const sideMenu = wrapper.findComponent({ name: 'AvSideMenu' })
        await sideMenu.trigger('click')
      })

      it('then the side menu should be collapsed', () => {
        const sideMenu = wrapper.findComponent({ name: 'AvSideMenu' })
        expect(sideMenu.props('collapsed')).toBe(true)
      })

      it('then the side menu content should receive collapsed state', () => {
        const sideMenuContent = wrapper.findComponent({ name: 'StudentProjectExperiencesSideMenuContent' })
        expect(sideMenuContent.props('isSideMenuCollapsed')).toBe(true)
      })
    })

    describe('when different menu items are selected', () => {
      it('then it should display educations section when EDUCATIONS is selected', async () => {
        const sideMenuContent = wrapper.findComponent({ name: 'StudentProjectExperiencesSideMenuContent' })
        await sideMenuContent.trigger('click')

        const educationsSection = wrapper.findComponent({ name: 'StudentProjectExperiencesEducationsSection' })
        expect(educationsSection.exists()).toBe(true)
      })

      it('then it should display experiences section when EXPERIENCES is selected', async () => {
        const sideMenuContent = wrapper.findComponent({ name: 'StudentProjectExperiencesSideMenuContent' })
        await sideMenuContent.vm.$emit('update:selectedItem', ProjectExperienceItems.EXPERIENCES)

        const experiencesSection = wrapper.findComponent({ name: 'StudentProjectExperiencesExperiencesSection' })
        expect(experiencesSection.exists()).toBe(true)
      })

      it('then it should display activities section when ACTIVITIES is selected', async () => {
        const sideMenuContent = wrapper.findComponent({ name: 'StudentProjectExperiencesSideMenuContent' })
        await sideMenuContent.vm.$emit('update:selectedItem', ProjectExperienceItems.ACTIVITIES)

        const activitiesSection = wrapper.findComponent({ name: 'StudentProjectExperiencesActivitiesSection' })
        expect(activitiesSection.exists()).toBe(true)
      })

      it('then it should display careers section when CAREERS is selected', async () => {
        const sideMenuContent = wrapper.findComponent({ name: 'StudentProjectExperiencesSideMenuContent' })
        await sideMenuContent.vm.$emit('update:selectedItem', ProjectExperienceItems.CAREERS)

        const careersSection = wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' })
        expect(careersSection.exists()).toBe(true)
      })
    })

    describe('when the displayed section changes', () => {
      it('then only one section should be displayed at a time', async () => {
        expect(wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentProjectExperiencesEducationsSection' }).exists()).toBe(false)

        const sideMenuContent = wrapper.findComponent({ name: 'StudentProjectExperiencesSideMenuContent' })
        await sideMenuContent.vm.$emit('update:selectedItem', ProjectExperienceItems.EDUCATIONS)

        expect(wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' }).exists()).toBe(false)
        expect(wrapper.findComponent({ name: 'StudentProjectExperiencesEducationsSection' }).exists()).toBe(true)
      })
    })
  })
})
