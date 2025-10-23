import { studentHomeRoute, studentProjectSkillsRoute } from '@/features/student/routes'
import StudentAdditionalSkillView from '@/features/student/views/StudentAdditionalSkillView/StudentAdditionalSkillView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const AdditionalSkillSettingDropdownStub = {
  name: 'AdditionalSkillSettingDropdown',
  emits: ['updateSelected', 'deleteAssociationSelected', 'deleteSelected'],
  template: '<div class="additional-skill-setting-popover-stub" />'
}

const AvTabsStub = {
  name: 'AvTabs',
  props: ['modelValue'],
  template: '<div class="av-tabs-stub"><slot /></div>'
}

const AvTabStub = {
  name: 'AvTab',
  props: ['title', 'icon'],
  template: '<div class="av-tab-stub"><slot /></div>'
}

const PageTitleStubWithBack = {
  name: 'PageTitle',
  template: '<div />',
  props: ['title', 'breadcrumbLinks', 'back']
}

const stubs = {
  PageTitle: PageTitleStubWithBack,
  AdditionalSkillSettingDropdown: AdditionalSkillSettingDropdownStub,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub
}

BddTest().given('a student additional skill view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentAdditionalSkillView>>

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentAdditionalSkillView, {
      props: {
        skillId: '123'
      },
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Détail de ma compétence déclarée')
      expect(pageTitle.props('back')).toBe(studentProjectSkillsRoute)

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbLinks).toHaveLength(4)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: studentHomeRoute
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Toutes mes compétences',
        to: studentProjectSkillsRoute
      })
      expect(breadcrumbLinks[3]).toEqual({
        text: 'Mes autres compétences et certifications déclarées'
      })
    })

    BddTest().then('it should render the skill title', () => {
      const title = wrapper.find('.student-additional-skill-view__title .n4')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Placeholder Skill Title')
    })

    BddTest().then('it should render AdditionalSkillSettingDropdown', () => {
      const settingPopover = wrapper.findComponent({ name: 'AdditionalSkillSettingDropdown' })
      expect(settingPopover.exists()).toBe(true)
    })

    BddTest().then('it should render AvTabs with two tabs', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(tabs.exists()).toBe(true)

      const tabComponents = wrapper.findAllComponents({ name: 'AvTab' })
      expect(tabComponents).toHaveLength(2)
    })
  })

  BddTest().when('the update selected event is emitted', () => {
    BddTest().then('it should handle the event', async () => {
      const settingPopover = wrapper.findComponent({ name: 'AdditionalSkillSettingDropdown' })
      await settingPopover.vm.$emit('updateSelected')
    })
  })

  BddTest().when('the delete association selected event is emitted', () => {
    BddTest().then('it should handle the event', async () => {
      const settingPopover = wrapper.findComponent({ name: 'AdditionalSkillSettingDropdown' })
      await settingPopover.vm.$emit('deleteAssociationSelected')
    })
  })

  BddTest().when('the delete selected event is emitted', () => {
    BddTest().then('it should handle the event', async () => {
      const settingPopover = wrapper.findComponent({ name: 'AdditionalSkillSettingDropdown' })
      await settingPopover.vm.$emit('deleteSelected')
    })
  })
})
