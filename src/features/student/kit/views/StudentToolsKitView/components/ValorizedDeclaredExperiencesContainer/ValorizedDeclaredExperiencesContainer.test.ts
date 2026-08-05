import type { GetDeclaredExperienceViewParams } from '@/api/avenir-esr'
import { createMockedDeclaredExperiencesPagedResponse } from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import { createDeclaredExperienceViewHandler, declaredExperiencesQueryErrorHandler } from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { EExperienceType } from '@/api/avenir-esr'
import { ValorizedElementsCardContainerStub } from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.stub'
import { ValorizedDeclaredExperienceItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperienceItem/ValorizedDeclaredExperienceItem.stub'
import ValorizedDeclaredExperiencesContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperiencesContainer/ValorizedDeclaredExperiencesContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

function personalCount (mockedResponse: ReturnType<typeof createMockedDeclaredExperiencesPagedResponse>) {
  return mockedResponse.data.filter(experience => experience.experienceType === EExperienceType.PERSONAL).length
}

BddTest().given('a valorized declared experiences container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedDeclaredExperiencesContainer>>
  let requestedParams: GetDeclaredExperienceViewParams

  const stubs = {
    ValorizedElementsCardContainer: ValorizedElementsCardContainerStub,
    ValorizedDeclaredExperienceItem: ValorizedDeclaredExperienceItemStub
  }

  const mountDeclaredExperiencesContainer = async () => {
    wrapper = mountComponent(ValorizedDeclaredExperiencesContainer, { global: { stubs } })
    await flushPromises()
  }

  BddTest().when('the request succeeds with a mix of personal and professional experiences', () => {
    const mockedResponse = createMockedDeclaredExperiencesPagedResponse(100, 10, 0)
    const expectedPersonalCount = personalCount(mockedResponse)

    beforeEach(async () => {
      server.use(createDeclaredExperienceViewHandler(mockedResponse, (params) => {
        requestedParams = params
      }))

      await mountDeclaredExperiencesContainer()
    })

    BddTest().then('it should fetch declared experiences with isValorized true and pageSize 100', () => {
      expect(requestedParams.isValorized).toBe(true)
      expect(requestedParams.pageSize).toBe(100)
    })

    BddTest().then('it should render the title with the count of personal experiences only', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.exists()).toBe(true)
      expect(container.props('title')).toBe(`Autres expériences (${expectedPersonalCount})`)
    })

    BddTest().then('it should not be loading, have no error and not be empty once fetched', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.props('isLoading')).toBe(false)
      expect(container.props('error')).toBe(null)
      expect(container.props('isEmpty')).toBe(false)
    })

    BddTest().then('it should render one ValorizedDeclaredExperienceItem per personal experience only', () => {
      const items = wrapper.findAllComponents(ValorizedDeclaredExperienceItemStub)
      expect(items).toHaveLength(expectedPersonalCount)
      items.forEach((item) => {
        expect(item.props('declaredExperience').experienceType).toBe(EExperienceType.PERSONAL)
      })
    })

    BddTest().then('it should pass the empty state message and see all link to the exhaustive experiences list', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.props('emptyStateMessage')).toBe('Vous n\'avez pas encore valorisé ce type de contenu, ajoutez et valorisez une expérience afin de constituer votre kit')
      expect(container.props('seeAllLabel')).toBe('Voir toutes mes autres expériences')
      expect(container.props('seeAllTo')).toEqual({ name: 'personal-career-experiences' })
    })
  })

  BddTest().when('the request succeeds with a single personal experience', () => {
    const mockedResponse = createMockedDeclaredExperiencesPagedResponse(100, 2, 0)
    const expectedPersonalCount = personalCount(mockedResponse)

    beforeEach(async () => {
      server.use(createDeclaredExperienceViewHandler(mockedResponse))

      await mountDeclaredExperiencesContainer()
    })

    BddTest().then('it should render the title in the singular form', () => {
      expect(expectedPersonalCount).toBe(1)
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Autre expérience (1)')
    })

    BddTest().then('it should render a single ValorizedDeclaredExperienceItem', () => {
      expect(wrapper.findAllComponents(ValorizedDeclaredExperienceItemStub)).toHaveLength(1)
    })
  })

  BddTest().when('the request succeeds with only professional experiences', () => {
    const mockedResponse = createMockedDeclaredExperiencesPagedResponse(100, 1, 0)

    beforeEach(async () => {
      expect(personalCount(mockedResponse)).toBe(0)
      server.use(createDeclaredExperienceViewHandler(mockedResponse))

      await mountDeclaredExperiencesContainer()
    })

    BddTest().then('it should render no ValorizedDeclaredExperienceItem', () => {
      expect(wrapper.findAllComponents(ValorizedDeclaredExperienceItemStub)).toHaveLength(0)
    })

    BddTest().then('it should mark the container as empty', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('isEmpty')).toBe(true)
    })
  })

  BddTest().when('the request succeeds with 0 experiences', () => {
    const mockedResponse = createMockedDeclaredExperiencesPagedResponse(100, 0, 0)

    beforeEach(async () => {
      server.use(createDeclaredExperienceViewHandler(mockedResponse))

      await mountDeclaredExperiencesContainer()
    })

    BddTest().then('it should mark the container as empty', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('isEmpty')).toBe(true)
    })
  })

  BddTest().when('the request fails', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesQueryErrorHandler)

      await mountDeclaredExperiencesContainer()
    })

    BddTest().then('it should forward the error to the card container', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('error')).toBeTruthy()
    })
  })
})
