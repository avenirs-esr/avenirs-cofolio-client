import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { EExperienceType } from '@/api/avenir-esr'
import { ICONS, ROUTES } from '@/common/constants'
import ValorizedDeclaredExperienceItem from '@/features/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperienceItem/ValorizedDeclaredExperienceItem.vue'
import { AvBadgeStub, AvButtonStub, AvIconTextStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const BASE_DECLARED_EXPERIENCE: DeclaredExperienceViewDTO = {
  id: 'c1e6a6f0-1c2d-4f3e-9a1b-3f2b1c0d4e5f',
  title: 'Bénévole Associatif',
  experienceType: EExperienceType.PERSONAL,
  organization: 'Croix-Rouge',
  description: 'Distribution alimentaire hebdomadaire auprès des personnes en difficulté',
  startDate: '2023-01',
  endDate: '2023-06',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  declaredExperienceAssociationCountDTO: {
    traceAssociationsCount: 3,
    declaredSkillAssociationsCount: 1
  }
}

const stubs = {
  AvButton: AvButtonStub,
  AvTooltip: AvTooltipStub,
  AvBadge: AvBadgeStub,
  AvIconText: AvIconTextStub
}

function mountValorizedDeclaredExperienceItem (declaredExperience: DeclaredExperienceViewDTO) {
  return mountComponent(ValorizedDeclaredExperienceItem, {
    props: { declaredExperience },
    global: { stubs }
  })
}

BddTest().given('a valorized declared experience item', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedDeclaredExperienceItem>>

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredExperienceItem(BASE_DECLARED_EXPERIENCE)
      await flushPromises()
    })

    BddTest().then('it should render the wrapped ValorizedItem with the experience title', () => {
      expect(wrapper.find('[data-testid="valorized-item"]').exists()).toBe(true)
      expect(wrapper.find('.title').text()).toBe(BASE_DECLARED_EXPERIENCE.title)
    })

    BddTest().then('it should render the access button pointing to the declared experience route', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.props('to')).toEqual({
        name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
        params: { id: BASE_DECLARED_EXPERIENCE.id }
      })
    })

    BddTest().then('it should render the organization badge with the period appended', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain(`${BASE_DECLARED_EXPERIENCE.organization} • 01/2023 - 06/2023`)
    })

    BddTest().then('it should render the skill and trace association counts', () => {
      const iconTexts = wrapper.findAllComponents(AvIconTextStub)
      expect(iconTexts.map(iconText => iconText.props('text'))).toEqual(['1 compétence', '3 traces'])
      expect(iconTexts.map(iconText => iconText.props('icon'))).toEqual([ICONS.SKILLS, ICONS.TRACES])
    })

    BddTest().then('it should render the experience type badge', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain('Expérience personnelle')
    })

    BddTest().then('it should render the description', () => {
      expect(wrapper.text()).toContain(BASE_DECLARED_EXPERIENCE.description)
    })
  })

  BddTest().when('the experience has no description', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredExperienceItem({
        ...BASE_DECLARED_EXPERIENCE,
        description: undefined
      })
      await flushPromises()
    })

    BddTest().then('it should not render a description', () => {
      expect(wrapper.text()).not.toContain(BASE_DECLARED_EXPERIENCE.description)
    })
  })

  BddTest().when('the experience has no experience type', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredExperienceItem({
        ...BASE_DECLARED_EXPERIENCE,
        experienceType: undefined
      })
      await flushPromises()
    })

    BddTest().then('it should not render the experience type badge', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).not.toContain('Expérience personnelle')
    })
  })

  BddTest().when('the experience has no associated skill', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredExperienceItem({
        ...BASE_DECLARED_EXPERIENCE,
        declaredExperienceAssociationCountDTO: {
          traceAssociationsCount: 3,
          declaredSkillAssociationsCount: 0
        }
      })
      await flushPromises()
    })

    BddTest().then('it should only render the trace association count', () => {
      const iconTexts = wrapper.findAllComponents(AvIconTextStub)
      expect(iconTexts.map(iconText => iconText.props('text'))).toEqual(['3 traces'])
    })
  })

  BddTest().when('the experience has no associated trace', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredExperienceItem({
        ...BASE_DECLARED_EXPERIENCE,
        declaredExperienceAssociationCountDTO: {
          traceAssociationsCount: 0,
          declaredSkillAssociationsCount: 1
        }
      })
      await flushPromises()
    })

    BddTest().then('it should only render the skill association count', () => {
      const iconTexts = wrapper.findAllComponents(AvIconTextStub)
      expect(iconTexts.map(iconText => iconText.props('text'))).toEqual(['1 compétence'])
    })
  })

  BddTest().when('the experience has no end date', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredExperienceItem({
        ...BASE_DECLARED_EXPERIENCE,
        endDate: undefined
      })
      await flushPromises()
    })

    BddTest().then('it should render the organization badge with an ongoing period', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain(`${BASE_DECLARED_EXPERIENCE.organization} • 01/2023 - En cours`)
    })
  })
})
