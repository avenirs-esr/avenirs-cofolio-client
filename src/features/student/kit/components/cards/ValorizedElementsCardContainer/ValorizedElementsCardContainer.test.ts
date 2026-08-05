import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { BaseApiException } from '@/common/exceptions'
import ValorizedElementsCardContainer, {
  type ValorizedElementsCardContainerProps
} from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a valorized elements card container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedElementsCardContainer>>

  const stubs = {
    Card: CardStub,
    QuerySuspense: QuerySuspenseStub,
    AvButton: AvButtonStub
  }

  const props: ValorizedElementsCardContainerProps = {
    title: 'Mes traces associées (3)'
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(ValorizedElementsCardContainer, { props, global: { stubs } })
    })

    BddTest().then('it should render the card as collapsible', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.exists()).toBe(true)
      expect(card.props('collapsible')).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      expect(wrapper.find('[data-testid="card-stub-title"]').text()).toBe(props.title)
    })

    BddTest().then('it should render the slot content', () => {
      wrapper = mount(ValorizedElementsCardContainer, {
        props,
        global: { stubs },
        slots: { default: '<p data-testid="slot-content">Contenu</p>' },
      })
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true)
    })

    BddTest().then('it should not be loading and not have an error by default', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)
      expect(querySuspense.props('isLoading')).toBe(false)
      expect(querySuspense.props('error')).toBe(null)
    })
  })

  BddTest().when('it is loading', () => {
    beforeEach(() => {
      wrapper = mount(ValorizedElementsCardContainer, {
        props: { ...props, isLoading: true },
        global: { stubs },
      })
    })

    BddTest().then('it should forward isLoading to QuerySuspense', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('isLoading')).toBe(true)
    })
  })

  BddTest().when('an error occurred', () => {
    const error = new BaseApiException('error', 500)

    beforeEach(() => {
      wrapper = mount(ValorizedElementsCardContainer, {
        props: { ...props, error },
        global: { stubs },
      })
    })

    BddTest().then('it should forward the error to QuerySuspense', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('error')).toEqual(error)
    })
  })

  BddTest().when('it is empty with a custom empty state message', () => {
    beforeEach(() => {
      wrapper = mount(ValorizedElementsCardContainer, {
        props: { ...props, isEmpty: true, emptyStateMessage: 'Aucun élément valorisé' },
        global: { stubs },
      })
    })

    BddTest().then('it should forward isEmpty and emptyStateMessage to QuerySuspense', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)
      expect(querySuspense.props('isEmpty')).toBe(true)
      expect(querySuspense.props('emptyStateMessage')).toBe('Aucun élément valorisé')
    })
  })

  BddTest().when('seeAllLabel and seeAllTo are provided', () => {
    beforeEach(() => {
      wrapper = mount(ValorizedElementsCardContainer, {
        props: { ...props, seeAllLabel: 'Voir tout', seeAllTo: { name: 'some-route' } },
        global: { stubs },
      })
    })

    BddTest().then('it should render the see all button in the card title, right-aligned next to the title', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(true)
      expect(button.props('label')).toBe('Voir tout')
      expect(button.props('to')).toEqual({ name: 'some-route' })
      expect(wrapper.find('[data-testid="card-stub-title"]').findComponent(AvButtonStub).exists()).toBe(true)
    })
  })

  BddTest().when('seeAllLabel and seeAllTo are not provided', () => {
    beforeEach(() => {
      wrapper = mount(ValorizedElementsCardContainer, { props, global: { stubs } })
    })

    BddTest().then('it should not render a see all button', () => {
      expect(wrapper.find('[data-testid="see-all-button"]').exists()).toBe(false)
    })
  })
})
