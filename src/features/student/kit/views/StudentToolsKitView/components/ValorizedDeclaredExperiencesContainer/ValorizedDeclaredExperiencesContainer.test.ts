import type { GetDeclaredExperienceViewParams, PagedResponseDeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { createMockedDeclaredExperiencesPagedResponse, mockedDeclaredExperiences } from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import { createDeclaredExperienceViewHandler, declaredExperiencesQueryErrorHandler } from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { EExperienceType } from '@/api/avenir-esr'
import { ValorizedElementsCardContainerStub } from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.stub'
import { ValorizedDeclaredExperienceItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperienceItem/ValorizedDeclaredExperienceItem.stub'
import ValorizedDeclaredExperiencesContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperiencesContainer/ValorizedDeclaredExperiencesContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

interface ExperienceTypeScenario {
  experienceType: EExperienceType
  pluralTitle: (count: number) => string
  singularTitle: string
  singularTotalElements: number
  seeAllLabel: string
}

const SCENARIOS: ExperienceTypeScenario[] = [
  {
    experienceType: EExperienceType.PROFESSIONAL,
    pluralTitle: count => `Mes expériences professionnelles (${count})`,
    singularTitle: 'Mon expérience professionnelle (1)',
    singularTotalElements: 1,
    seeAllLabel: 'Voir toutes mes expériences professionnelles'
  },
  {
    experienceType: EExperienceType.PERSONAL,
    pluralTitle: count => `Autres expériences (${count})`,
    singularTitle: 'Autre expérience (1)',
    singularTotalElements: 2,
    seeAllLabel: 'Voir toutes mes autres expériences'
  }
]

function countOf (mockedResponse: PagedResponseDeclaredExperienceViewDTO, experienceType: EExperienceType) {
  return mockedResponse.data.filter(experience => experience.experienceType === experienceType).length
}

function pagedResponseWithoutType (experienceType: EExperienceType): PagedResponseDeclaredExperienceViewDTO {
  const data = mockedDeclaredExperiences.filter(experience => experience.experienceType !== experienceType)

  return {
    data,
    page: { page: 0, pageSize: 100, totalElements: data.length, totalPages: 1 }
  }
}

SCENARIOS.forEach(({ experienceType, pluralTitle, singularTitle, singularTotalElements, seeAllLabel }) => {
  BddTest().given(`a valorized declared experiences container for ${experienceType} experiences`, () => {
    let wrapper: VueWrapper<InstanceType<typeof ValorizedDeclaredExperiencesContainer>>
    let requestedParams: GetDeclaredExperienceViewParams

    const stubs = {
      ValorizedElementsCardContainer: ValorizedElementsCardContainerStub,
      ValorizedDeclaredExperienceItem: ValorizedDeclaredExperienceItemStub
    }

    const mountDeclaredExperiencesContainer = async () => {
      wrapper = mountComponent(ValorizedDeclaredExperiencesContainer, {
        props: { experienceType },
        global: { stubs }
      })
      await flushPromises()
    }

    BddTest().when('the request succeeds with a mix of personal and professional experiences', () => {
      const mockedResponse = createMockedDeclaredExperiencesPagedResponse(100, 10, 0)
      const expectedCount = countOf(mockedResponse, experienceType)

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

      BddTest().then('it should render the title with the count of experiences of that type only', () => {
        const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
        expect(container.exists()).toBe(true)
        expect(container.props('title')).toBe(pluralTitle(expectedCount))
      })

      BddTest().then('it should not be loading, have no error and not be empty once fetched', () => {
        const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
        expect(container.props('isLoading')).toBe(false)
        expect(container.props('error')).toBe(null)
        expect(container.props('isEmpty')).toBe(false)
      })

      BddTest().then('it should render one ValorizedDeclaredExperienceItem per experience of that type only', () => {
        const items = wrapper.findAllComponents(ValorizedDeclaredExperienceItemStub)
        expect(items).toHaveLength(expectedCount)
        items.forEach((item) => {
          expect(item.props('declaredExperience').experienceType).toBe(experienceType)
        })
      })

      BddTest().then('it should pass the empty state message and see all link to the exhaustive experiences list', () => {
        const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
        expect(container.props('emptyStateMessage')).toBe('Vous n\'avez pas encore valorisé ce type de contenu, ajoutez et valorisez une expérience afin de constituer votre kit')
        expect(container.props('seeAllLabel')).toBe(seeAllLabel)
        expect(container.props('seeAllTo')).toEqual({ name: 'personal-career-experiences' })
      })
    })

    BddTest().when('the request succeeds with a single experience of that type', () => {
      const mockedResponse = createMockedDeclaredExperiencesPagedResponse(100, singularTotalElements, 0)

      beforeEach(async () => {
        expect(countOf(mockedResponse, experienceType)).toBe(1)
        server.use(createDeclaredExperienceViewHandler(mockedResponse))

        await mountDeclaredExperiencesContainer()
      })

      BddTest().then('it should render the title in the singular form', () => {
        expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe(singularTitle)
      })

      BddTest().then('it should render a single ValorizedDeclaredExperienceItem', () => {
        expect(wrapper.findAllComponents(ValorizedDeclaredExperienceItemStub)).toHaveLength(1)
      })
    })

    BddTest().when('the request succeeds with experiences of the other type only', () => {
      beforeEach(async () => {
        server.use(createDeclaredExperienceViewHandler(pagedResponseWithoutType(experienceType)))

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
})
