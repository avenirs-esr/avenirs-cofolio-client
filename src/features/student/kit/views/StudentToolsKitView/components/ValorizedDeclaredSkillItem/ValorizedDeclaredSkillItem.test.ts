import type { DeclaredSkillProgressDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { EDeclaredSkillLevel, EExternalSkillType } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import ValorizedDeclaredSkillItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredSkillItem/ValorizedDeclaredSkillItem.vue'
import { AvBadgeStub, AvButtonStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const BASE_DECLARED_SKILL: DeclaredSkillProgressDTO = {
  id: 'c1e6a6f0-1c2d-4f3e-9a1b-3f2b1c0d4e5f',
  title: 'Analyser des données qualitatives',
  pathSegments: [],
  type: EExternalSkillType.XXI,
  level: EDeclaredSkillLevel.INTERMEDIATE,
  valorized: true,
  associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
}

const stubs = {
  AvButton: AvButtonStub,
  AvTooltip: AvTooltipStub,
  AvBadge: AvBadgeStub
}

function mountValorizedDeclaredSkillItem (declaredSkill: DeclaredSkillProgressDTO) {
  return mountComponent(ValorizedDeclaredSkillItem, {
    props: { declaredSkill },
    global: { stubs }
  })
}

BddTest().given('a valorized declared skill item', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedDeclaredSkillItem>>

  BddTest().when('the declared skill is not from the ROME4 referential', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredSkillItem(BASE_DECLARED_SKILL)
      await flushPromises()
    })

    BddTest().then('it should render the wrapped ValorizedItem with the skill title', () => {
      expect(wrapper.find('[data-testid="valorized-item"]').exists()).toBe(true)
      expect(wrapper.find('.title').text()).toBe(BASE_DECLARED_SKILL.title)
    })

    BddTest().then('it should render the access button pointing to the declared skill route', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.props('to')).toEqual({
        name: ROUTES.STUDENT.PROJECT_SKILL.name,
        params: { id: BASE_DECLARED_SKILL.id }
      })
    })

    BddTest().then('it should render the type and level badges', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toEqual(['XXIᵉ onisep', 'Intermédiaire'])
    })

    BddTest().then('it should not render the macro skill badge', () => {
      expect(wrapper.findAllComponents(AvBadgeStub)).toHaveLength(2)
    })
  })

  BddTest().when('the declared skill is from the ROME4 referential with path segments', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredSkillItem({
        ...BASE_DECLARED_SKILL,
        type: EExternalSkillType.ROME4,
        pathSegments: ['Domaine', 'Enjeu']
      })
      await flushPromises()
    })

    BddTest().then('it should render the macro skill badge with joined path segments', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain('Domaine > Enjeu')
    })

    BddTest().then('it should render three badges', () => {
      expect(wrapper.findAllComponents(AvBadgeStub)).toHaveLength(3)
    })
  })

  BddTest().when('the declared skill is from the ROME4 referential without path segments', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredSkillItem({
        ...BASE_DECLARED_SKILL,
        type: EExternalSkillType.ROME4,
        pathSegments: []
      })
      await flushPromises()
    })

    BddTest().then('it should not render the macro skill badge', () => {
      expect(wrapper.findAllComponents(AvBadgeStub)).toHaveLength(2)
    })
  })
})
