import type { VueWrapper } from '@vue/test-utils'
import { EExperienceType } from '@/api/avenir-esr'
import KitTextContentTab from '@/features/student/kit/views/StudentToolsKitView/components/KitTextContentTab/KitTextContentTab.vue'
import { ValorizedDeclaredExperiencesContainerStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperiencesContainer/ValorizedDeclaredExperiencesContainer.stub'
import { ValorizedDeclaredProgramsContainerStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredProgramsContainer/ValorizedDeclaredProgramsContainer.stub'
import { ValorizedDeclaredSkillsContainerStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredSkillsContainer/ValorizedDeclaredSkillsContainer.stub'
import { ValorizedSelfKnowledgeContainerStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedSelfKnowledgeContainer/ValorizedSelfKnowledgeContainer.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

const stubs = {
  ValorizedDeclaredSkillsContainer: ValorizedDeclaredSkillsContainerStub,
  ValorizedDeclaredExperiencesContainer: ValorizedDeclaredExperiencesContainerStub,
  ValorizedDeclaredProgramsContainer: ValorizedDeclaredProgramsContainerStub,
  ValorizedSelfKnowledgeContainer: ValorizedSelfKnowledgeContainerStub
}

BddTest().given('a kit text content tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof KitTextContentTab>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(KitTextContentTab, { global: { stubs } })
    })

    BddTest().then('it should render the valorized declared skills container', () => {
      expect(wrapper.findComponent(ValorizedDeclaredSkillsContainerStub).exists()).toBe(true)
    })

    BddTest().then('it should render a valorized declared experiences container per experience type, professional first', () => {
      const containers = wrapper.findAllComponents(ValorizedDeclaredExperiencesContainerStub)
      expect(containers.map(container => container.props('experienceType'))).toEqual([
        EExperienceType.PROFESSIONAL,
        EExperienceType.PERSONAL
      ])
    })

    BddTest().then('it should render the valorized declared programs container', () => {
      expect(wrapper.findComponent(ValorizedDeclaredProgramsContainerStub).exists()).toBe(true)
    })

    BddTest().then('it should render the interests self knowledge container then the other information one', () => {
      const containers = wrapper.findAllComponents(ValorizedSelfKnowledgeContainerStub)
      expect(containers.map(container => container.props('interestsOnly'))).toEqual([true, false])
    })

    BddTest().then('it should render both self knowledge containers with their own test id', () => {
      expect(wrapper.find('[data-testid="valorized-self-knowledge-interests-container-stub"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="valorized-self-knowledge-others-container-stub"]').exists()).toBe(true)
    })
  })
})
