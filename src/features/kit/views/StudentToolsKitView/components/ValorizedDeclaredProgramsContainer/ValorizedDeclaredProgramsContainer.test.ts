import type { GetDeclaredProgramsParams } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { createMockedDeclaredProgramsPagedResponse } from '@/__mocks__/fixtures/student/declaredPrograms.fixtures'
import { createDeclaredProgramsViewHandler, declaredProgramsQueryErrorHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { ValorizedElementsCardContainerStub } from '@/features/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.stub'
import { ValorizedDeclaredProgramItemStub } from '@/features/kit/views/StudentToolsKitView/components/ValorizedDeclaredProgramItem/ValorizedDeclaredProgramItem.stub'
import ValorizedDeclaredProgramsContainer from '@/features/kit/views/StudentToolsKitView/components/ValorizedDeclaredProgramsContainer/ValorizedDeclaredProgramsContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { vi } from 'vitest'

BddTest().given('a valorized declared programs container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedDeclaredProgramsContainer>>
  let requestedParams: GetDeclaredProgramsParams

  const stubs = {
    ValorizedElementsCardContainer: ValorizedElementsCardContainerStub,
    ValorizedDeclaredProgramItem: ValorizedDeclaredProgramItemStub
  }

  const mountDeclaredProgramsContainer = async () => {
    wrapper = mountComponent(ValorizedDeclaredProgramsContainer, { global: { stubs } })
    await vi.waitFor(() => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('isLoading')).toBe(false)
    })
  }

  BddTest().when('the request succeeds with 3 declared programs', () => {
    const mockedResponse = createMockedDeclaredProgramsPagedResponse(100, 3, 0)

    beforeEach(async () => {
      server.use(createDeclaredProgramsViewHandler(mockedResponse, (params) => {
        requestedParams = params
      }))

      await mountDeclaredProgramsContainer()
    })

    BddTest().then('it should fetch declared programs with isValorized true and pageSize 100', () => {
      expect(requestedParams.isValorized).toBe(true)
      expect(requestedParams.pageSize).toBe(100)
    })

    BddTest().then('it should render the title with the total elements count', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.exists()).toBe(true)
      expect(container.props('title')).toBe('Formations (3)')
    })

    BddTest().then('it should not be loading, have no error and not be empty once fetched', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.props('isLoading')).toBe(false)
      expect(container.props('error')).toBe(null)
      expect(container.props('isEmpty')).toBe(false)
    })

    BddTest().then('it should render one ValorizedDeclaredProgramItem per declared program', () => {
      const items = wrapper.findAllComponents(ValorizedDeclaredProgramItemStub)
      expect(items).toHaveLength(3)
      mockedResponse.data.forEach((declaredProgram, index) => {
        expect(items[index].props('declaredProgram')).toEqual(declaredProgram)
      })
    })

    BddTest().then('it should pass the empty state message and see all link to the exhaustive declared programs list', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.props('emptyStateMessage')).toBe('Vous n\'avez pas encore valorisé ce type de contenu, ajoutez et valorisez une formation afin de constituer votre kit')
      expect(container.props('seeAllLabel')).toBe('Voir toutes mes formations')
      expect(container.props('seeAllTo')).toEqual({ name: 'personal-career-declared-programs' })
    })
  })

  BddTest().when('the request succeeds with a single declared program', () => {
    const mockedResponse = createMockedDeclaredProgramsPagedResponse(100, 1, 0)

    beforeEach(async () => {
      server.use(createDeclaredProgramsViewHandler(mockedResponse))

      await mountDeclaredProgramsContainer()
    })

    BddTest().then('it should render the title in the singular form', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Formation (1)')
    })

    BddTest().then('it should render a single ValorizedDeclaredProgramItem', () => {
      expect(wrapper.findAllComponents(ValorizedDeclaredProgramItemStub)).toHaveLength(1)
    })
  })

  BddTest().when('the request succeeds with 0 declared programs', () => {
    const mockedResponse = createMockedDeclaredProgramsPagedResponse(100, 0, 0)

    beforeEach(async () => {
      server.use(createDeclaredProgramsViewHandler(mockedResponse))

      await mountDeclaredProgramsContainer()
    })

    BddTest().then('it should render no ValorizedDeclaredProgramItem', () => {
      expect(wrapper.findAllComponents(ValorizedDeclaredProgramItemStub)).toHaveLength(0)
    })

    BddTest().then('it should mark the container as empty', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('isEmpty')).toBe(true)
    })
  })

  BddTest().when('the request fails', () => {
    beforeEach(async () => {
      server.use(declaredProgramsQueryErrorHandler)

      await mountDeclaredProgramsContainer()
    })

    BddTest().then('it should forward the error to the card container', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('error')).toBeTruthy()
    })
  })
})
