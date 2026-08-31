import { type DeclaredSkillProgressDTO, EDeclaredSkillLevel, EExternalSkillType, type ExternalSkillDTO } from '@/api/avenir-esr'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import StudentDetailedDeclaredSkillCard from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/components/StudentDetailedDeclaredSkillCard/StudentDetailedDeclaredSkillCard.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const mockSkill: ExternalSkillDTO = {
  id: 'declared-skill-1',
  title: 'Accueillir des enfants',
  type: EExternalSkillType.ROME4,
  pathSegments: ['Relation client', 'Accueillir et orienter']
}

const mockDeclaredSkillProgress: DeclaredSkillProgressDTO = {
  id: 'declared-skill-progress-1',
  title: 'Accueillir des enfants',
  type: EExternalSkillType.ROME4,
  pathSegments: ['Relation client', 'Accueillir et orienter'],
  level: EDeclaredSkillLevel.BEGINNER,
  valorized: true,
  associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
}

const stubs = {
  StudentDetailedSkillCard: {
    name: 'StudentDetailedSkillCard',
    props: ['id', 'name', 'skillColor', 'icon', 'color', 'to'],
    template: `<div class="student-detailed-skill-card"><slot /></div>`
  },
  AvBadge: AvBadgeStub,
  ValorizedBadge: ValorizedBadgeStub
}

function createWrapper (
  declaredSkill: ExternalSkillDTO | DeclaredSkillProgressDTO = mockSkill
) {
  return mount(StudentDetailedDeclaredSkillCard, {
    props: {
      declaredSkill
    },
    global: {
      stubs
    }
  })
}

BddTest().given('a student detailed declared skill card', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDetailedDeclaredSkillCard>>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should pass the correct props to StudentDetailedSkillCard including project declared skill route', () => {
      const card = wrapper.findComponent({ name: 'StudentDetailedSkillCard' })
      expect(card.exists()).toBe(true)
      expect(card.props('id')).toBe(mockSkill.id)
      expect(card.props('name')).toBe(mockSkill.title)
      expect(card.props('icon')).toBe('mdi:stars')
      expect(card.props('skillColor')).toBe('var(--dark-background-primary1)')
      expect(card.props('color')).toBe('var(--card2)')
      expect(card.props('to')).toBe('student-project-declared-skill')
    })

    BddTest().then('it should render the type badge with correct label', () => {
      const typeBadge = wrapper.findAllComponents({ name: 'AvBadge' })[0]
      expect(typeBadge.exists()).toBe(true)
      expect(typeBadge.props('label')).toBe('Rome 4.0')
    })

    BddTest().then('it should render the type badge with correct props', () => {
      const typeBadge = wrapper.findAllComponents({ name: 'AvBadge' })[0]
      expect(typeBadge.props('color')).toBe('var(--text1)')
      expect(typeBadge.props('borderColor')).toBe('var(--other-border-skill-card)')
      expect(typeBadge.props('backgroundColor')).toBe('var(--surface-background)')
      expect(typeBadge.props('small')).toBe(true)
      expect(typeBadge.props('ellipsis')).toBe(true)
    })

    BddTest().then('it should render the path badge with joined pathSegments', () => {
      const pathBadge = wrapper.findAllComponents({ name: 'AvBadge' })[1]
      expect(pathBadge.exists()).toBe(true)
      expect(pathBadge.props('label')).toBe(mockSkill.pathSegments.join(' > '))
    })

    BddTest().then('it should render the path badge with correct props', () => {
      const pathBadge = wrapper.findAllComponents({ name: 'AvBadge' })[1]
      expect(pathBadge.props('color')).toBe('var(--dark-background-accent)')
      expect(pathBadge.props('backgroundColor')).toBe('var(--light-background-accent)')
      expect(pathBadge.props('small')).toBe(true)
      expect(pathBadge.props('ellipsis')).toBe(true)
    })

    BddTest().then('it should render two badges', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      expect(badges).toHaveLength(2)
    })
  })

  BddTest().when('the component is mounted with single path segment', () => {
    beforeEach(() => {
      const singlePathSkill: ExternalSkillDTO = {
        ...mockSkill,
        pathSegments: ['Single Path']
      }
      wrapper = createWrapper(singlePathSkill)
    })

    BddTest().then('it should render the path badge with single segment', () => {
      const pathBadge = wrapper.findAllComponents({ name: 'AvBadge' })[1]
      expect(pathBadge.props('label')).toBe('Single Path')
    })
  })

  BddTest().when('the component is mounted with multiple path segments', () => {
    beforeEach(() => {
      const multiplePathSkill: ExternalSkillDTO = {
        ...mockSkill,
        pathSegments: ['Path 1', 'Path 2', 'Path 3']
      }
      wrapper = createWrapper(multiplePathSkill)
    })

    BddTest().then('it should render the path badge with all segments joined', () => {
      const pathBadge = wrapper.findAllComponents({ name: 'AvBadge' })[1]
      expect(pathBadge.props('label')).toBe('Path 1 > Path 2 > Path 3')
    })
  })

  BddTest().when('the component is mounted with a valorized declared skill', () => {
    beforeEach(() => {
      wrapper = createWrapper({
        ...mockDeclaredSkillProgress,
        valorized: true
      })
    })

    BddTest().then('it should render ValorizedBadge with valorized true', () => {
      const badge = wrapper.findComponent(ValorizedBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a non valorized declared skill', () => {
    beforeEach(() => {
      wrapper = createWrapper({
        ...mockDeclaredSkillProgress,
        valorized: false
      })
    })

    BddTest().then('it should render ValorizedBadge with valorized false', () => {
      const badge = wrapper.findComponent(ValorizedBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(false)
    })
  })
})
