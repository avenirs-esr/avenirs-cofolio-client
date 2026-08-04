import type { GetDeclaredSkillsProgressesParams } from '@/api/avenir-esr'
import { createMockedPagedResponseDeclaredSkillProgressDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createDeclaredSkillsProgressViewHandler, declaredSkillsProgressViewErrorHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { ValorizedElementsCardContainerStub } from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.stub'
import { ValorizedDeclaredSkillItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredSkillItem/ValorizedDeclaredSkillItem.stub'
import ValorizedDeclaredSkillsContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredSkillsContainer/ValorizedDeclaredSkillsContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a valorized declared skills container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedDeclaredSkillsContainer>>
  let requestedParams: GetDeclaredSkillsProgressesParams

  const stubs = {
    ValorizedElementsCardContainer: ValorizedElementsCardContainerStub,
    ValorizedDeclaredSkillItem: ValorizedDeclaredSkillItemStub
  }

  const mountDeclaredSkillsContainer = async () => {
    wrapper = mountComponent(ValorizedDeclaredSkillsContainer, { global: { stubs } })
    await flushPromises()
  }

  BddTest().when('the declared skills progresses request succeeds with 3 declared skills', () => {
    const mockedResponse = createMockedPagedResponseDeclaredSkillProgressDTO(100, 3, 0)

    beforeEach(async () => {
      server.use(createDeclaredSkillsProgressViewHandler(mockedResponse, (params) => {
        requestedParams = params
      }))

      await mountDeclaredSkillsContainer()
    })

    BddTest().then('it should fetch declared skills progresses with isValorized true and pageSize 100', () => {
      expect(requestedParams.isValorized).toBe(true)
      expect(requestedParams.pageSize).toBe(100)
    })

    BddTest().then('it should render the title with the total elements count', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.exists()).toBe(true)
      expect(container.props('title')).toBe('Mes compétences déclarées valorisées (3)')
    })

    BddTest().then('it should not be loading and have no error once fetched', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.props('isLoading')).toBe(false)
      expect(container.props('error')).toBe(null)
    })

    BddTest().then('it should render one ValorizedDeclaredSkillItem per declared skill', () => {
      const items = wrapper.findAllComponents(ValorizedDeclaredSkillItemStub)
      expect(items).toHaveLength(3)
      mockedResponse.data.forEach((declaredSkill, index) => {
        expect(items[index].props('declaredSkill')).toEqual(declaredSkill)
      })
    })
  })

  BddTest().when('the declared skills progresses request succeeds with a single declared skill', () => {
    const mockedResponse = createMockedPagedResponseDeclaredSkillProgressDTO(100, 1, 0)

    beforeEach(async () => {
      server.use(createDeclaredSkillsProgressViewHandler(mockedResponse))

      await mountDeclaredSkillsContainer()
    })

    BddTest().then('it should render the title in the singular form', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Ma compétence déclarée valorisée (1)')
    })

    BddTest().then('it should render a single ValorizedDeclaredSkillItem', () => {
      expect(wrapper.findAllComponents(ValorizedDeclaredSkillItemStub)).toHaveLength(1)
    })
  })

  BddTest().when('the declared skills progresses request succeeds with 0 declared skills', () => {
    const mockedResponse = createMockedPagedResponseDeclaredSkillProgressDTO(100, 0, 0)

    beforeEach(async () => {
      server.use(createDeclaredSkillsProgressViewHandler(mockedResponse))

      await mountDeclaredSkillsContainer()
    })

    BddTest().then('it should render no ValorizedDeclaredSkillItem', () => {
      expect(wrapper.findAllComponents(ValorizedDeclaredSkillItemStub)).toHaveLength(0)
    })
  })

  BddTest().when('the declared skills progresses request fails', () => {
    beforeEach(async () => {
      server.use(declaredSkillsProgressViewErrorHandler)

      await mountDeclaredSkillsContainer()
    })

    BddTest().then('it should forward the error to the card container', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('error')).toBeTruthy()
    })
  })
})
