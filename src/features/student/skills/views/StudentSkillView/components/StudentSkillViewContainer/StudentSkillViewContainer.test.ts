import type { SkillDetailedDTO } from '@/api/avenir-esr'
import type { SectionNavigationItem } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import { SectionNavigationLayoutStub } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.stub'
import StudentSkillDetailedSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillDetailedSection/StudentSkillDetailedSection.vue'
import StudentSkillEvaluateSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillEvaluateSection/StudentSkillEvaluateSection.vue'
import StudentSkillLevelDetailedSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillLevelDetailedSection/StudentSkillLevelDetailedSection.vue'
import StudentSkillProgressSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillProgressSection/StudentSkillProgressSection.vue'
import StudentSkillViewContainer
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillViewContainer/StudentSkillViewContainer.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student skill view container component', () => {
  let wrapper: VueWrapper

  const mockSkillDetailed: SkillDetailedDTO = {
    id: 'skill-2-2',
    name: 'Compétence A',
    skillLevels: [
      { id: '1', name: 'Niveau 1' },
      { id: '2', name: 'Niveau 2' },
    ],
  }

  const stubs = {
    SectionNavigationLayout: SectionNavigationLayoutStub,
    StudentSkillDetailedSection: {
      name: 'StudentSkillDetailedSection',
      template: '<div class="skill-detailed-section-stub">Skill Detailed Section</div>',
    },
    StudentSkillLevelDetailedSection: {
      name: 'StudentSkillLevelDetailedSection',
      template: '<div class="skill-level-detailed-section-stub">Skill Level Detailed Section</div>',
    },
    StudentSkillProgressSection: {
      name: 'StudentSkillProgressSection',
      template: '<div class="skill-progress-section-stub">Skill Progress Section</div>',
    },
    StudentSkillEvaluateSection: {
      name: 'StudentSkillEvaluateSection',
      template: '<div class="skill-evaluate-section-stub">Skill Evaluate Section</div>',
    },
  }

  beforeEach(() => {
    wrapper = mount(StudentSkillViewContainer, {
      props: { skillDetailed: mockSkillDetailed },
      global: { stubs },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main container with correct class', () => {
      expect(wrapper.find('.student-skill-view-container').exists()).toBe(true)
    })

    BddTest().then('it should render the section navigation layout', () => {
      const sectionNavigationLayout = wrapper.findComponent({ name: 'SectionNavigationLayout' })

      expect(sectionNavigationLayout.exists()).toBe(true)
    })

    BddTest().then('it should pass the expected default section', () => {
      const sectionNavigationLayout = wrapper.findComponent({ name: 'SectionNavigationLayout' })

      expect(sectionNavigationLayout.props('defaultSection')).toBe('SKILL_DETAILED')
    })

    BddTest().then('it should pass the expected select placeholder', () => {
      const sectionNavigationLayout = wrapper.findComponent({ name: 'SectionNavigationLayout' })

      expect(sectionNavigationLayout.props('selectPlaceholder')).toBe('Accéder à')
    })

    BddTest().then('it should pass the expected select label', () => {
      const sectionNavigationLayout = wrapper.findComponent({ name: 'SectionNavigationLayout' })

      expect(sectionNavigationLayout.props('selectLabel')).toBe('Accéder à')
    })

    BddTest().then('it should pass the expected navigation items', () => {
      const sectionNavigationLayout = wrapper.findComponent({ name: 'SectionNavigationLayout' })
      const items = sectionNavigationLayout.props('items') as SectionNavigationItem[]

      expect(items).toEqual([
        {
          id: 'SKILL_DETAILED',
          label: 'COMPÉTENCE A',
          icon: MDI_ICONS.STAR_SHOOTING_OUTLINE,
        },
        {
          id: 'level:1',
          label: 'NIVEAU 1',
          icon: MDI_ICONS.FILE_TREE_OUTLINE,
        },
        {
          id: 'level:2',
          label: 'NIVEAU 2',
          icon: MDI_ICONS.FILE_TREE_OUTLINE,
        },
        {
          id: 'SKILL_PROGRESS',
          label: expect.any(String),
          icon: MDI_ICONS.CHART_TIMELINE_VARIANT_SHIMMER,
        },
        {
          id: 'SKILL_EVALUATE',
          label: expect.any(String),
          icon: MDI_ICONS.NOTEBOOK_CHECK,
        },
      ])
    })

    BddTest().then('it should pass the expected section components map', () => {
      const sectionNavigationLayout = wrapper.findComponent({ name: 'SectionNavigationLayout' })
      const componentBySection = sectionNavigationLayout.props('componentBySection') as Record<string, unknown>

      expect(componentBySection.SKILL_DETAILED).toBe(StudentSkillDetailedSection)
      expect(componentBySection['level:1']).toBe(StudentSkillLevelDetailedSection)
      expect(componentBySection['level:2']).toBe(StudentSkillLevelDetailedSection)
      expect(componentBySection.SKILL_PROGRESS).toBe(StudentSkillProgressSection)
      expect(componentBySection.SKILL_EVALUATE).toBe(StudentSkillEvaluateSection)
    })

    BddTest().then('it should pass the expected props by section', () => {
      const sectionNavigationLayout = wrapper.findComponent({ name: 'SectionNavigationLayout' })
      const propsBySection = sectionNavigationLayout.props('propsBySection') as Record<string, Record<string, unknown>>

      expect(propsBySection).toEqual({
        SKILL_DETAILED: {
          skillName: 'Compétence A',
        },
      })
    })
  })

  BddTest().when('demo mode is enabled', () => {
    beforeEach(() => {
      vi.stubGlobal('__DEMO_MODE__', true)

      wrapper = mount(StudentSkillViewContainer, {
        props: { skillDetailed: mockSkillDetailed },
        global: { stubs },
      })
    })

    BddTest().then('it should only pass the first item', () => {
      const sectionNavigationLayout = wrapper.findComponent({ name: 'SectionNavigationLayout' })
      const items = sectionNavigationLayout.props('items') as SectionNavigationItem[]

      expect(items).toEqual([
        {
          id: 'SKILL_DETAILED',
          label: 'COMPÉTENCE A',
          icon: MDI_ICONS.STAR_SHOOTING_OUTLINE,
        },
      ])
    })

    BddTest().then('it should keep skill detailed as default section', () => {
      const sectionNavigationLayout = wrapper.findComponent({ name: 'SectionNavigationLayout' })

      expect(sectionNavigationLayout.props('defaultSection')).toBe('SKILL_DETAILED')
    })
  })
})
