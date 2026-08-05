import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { EExperienceType } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import ValorizedDeclaredExperienceItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperienceItem/ValorizedDeclaredExperienceItem.vue'
import { AvBadgeStub, AvButtonStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
    traceAssociationsCount: 0,
    declaredSkillAssociationsCount: 0
  }
}

const stubs = {
  AvButton: AvButtonStub,
  AvTooltip: AvTooltipStub,
  AvBadge: AvBadgeStub
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

    BddTest().then('it should render the period badge', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain('01/2023 - 06/2023')
    })

    BddTest().then('it should render the organization badge', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain(BASE_DECLARED_EXPERIENCE.organization)
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

  BddTest().when('the experience has no end date', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredExperienceItem({
        ...BASE_DECLARED_EXPERIENCE,
        endDate: undefined
      })
      await flushPromises()
    })

    BddTest().then('it should render the period badge as ongoing', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain('01/2023 - En cours')
    })
  })
})
