import type { DeclaredSkillProgressDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { EDeclaredSkillLevel, EExternalSkillType } from '@/api/avenir-esr'
import { DeclaredSkillLevelBadgeStub } from '@/features/student/declaredSkills/components/badges/DeclaredSkillLevelBadge/DeclaredSkillLevelBadge.stub'
import { DeclaredSkillMacroSkillBadgeStub } from '@/features/student/declaredSkills/components/badges/DeclaredSkillMacroSkillBadge/DeclaredSkillMacroSkillBadge.stub'
import { DeclaredSkillTypeBadgeStub } from '@/features/student/declaredSkills/components/badges/DeclaredSkillTypeBadge/DeclaredSkillTypeBadge.stub'
import ValorizedDeclaredSkillItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredSkillItem/ValorizedDeclaredSkillItem.vue'
import { ValorizedItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
  ValorizedItem: ValorizedItemStub,
  DeclaredSkillTypeBadge: DeclaredSkillTypeBadgeStub,
  DeclaredSkillLevelBadge: DeclaredSkillLevelBadgeStub,
  DeclaredSkillMacroSkillBadge: DeclaredSkillMacroSkillBadgeStub,
}

function mountValorizedDeclaredSkillItem (declaredSkill: DeclaredSkillProgressDTO) {
  return mountComponent(ValorizedDeclaredSkillItem, {
    props: { declaredSkill },
    global: { stubs }
  })
}

BddTest().given('a valorized declared skill item', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedDeclaredSkillItem>>
  let valorizedItem: VueWrapper<InstanceType<typeof ValorizedItemStub>>

  BddTest().when('the declared skill is not from the ROME4 referential', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredSkillItem(BASE_DECLARED_SKILL)
      await flushPromises()
      valorizedItem = wrapper.findComponent(ValorizedItemStub)
    })

    BddTest().then('it should render the wrapped ValorizedItem with the skill title', () => {
      expect(valorizedItem.exists()).toBe(true)
      expect(valorizedItem.props('title')).toBe(BASE_DECLARED_SKILL.title)
    })

    BddTest().then('it should link the declared skill to ValorizedItem', () => {
      expect(valorizedItem.props('itemId')).toBe(BASE_DECLARED_SKILL.id)
    })

    BddTest().then('it should render the type and level badges', () => {
      const typeLabel = wrapper.findComponent(DeclaredSkillTypeBadgeStub).props('label')
      expect(typeLabel).toBe('XXIᵉ onisep')
      const levelLabel = wrapper.findComponent(DeclaredSkillLevelBadgeStub).props('level')
      expect(levelLabel).toBe(EDeclaredSkillLevel.INTERMEDIATE)
    })

    BddTest().then('it should not render the macro skill badge', () => {
      expect(wrapper.findComponent(DeclaredSkillMacroSkillBadgeStub).exists()).toBe(false)
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
      const macroSkillBadge = wrapper.findComponent(DeclaredSkillMacroSkillBadgeStub)
      expect(macroSkillBadge.exists()).toBe(true)
      expect(macroSkillBadge.text()).toContain('Domaine > Enjeu')
    })

    BddTest().then('it should render the type and level badges', () => {
      const typeLabel = wrapper.findComponent(DeclaredSkillTypeBadgeStub).props('label')
      expect(typeLabel).toBe('Rome 4.0')
      const levelLabel = wrapper.findComponent(DeclaredSkillLevelBadgeStub).props('level')
      expect(levelLabel).toBe(EDeclaredSkillLevel.INTERMEDIATE)
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
      expect(wrapper.findComponent(DeclaredSkillMacroSkillBadgeStub).exists()).toBe(false)
    })
  })
})
