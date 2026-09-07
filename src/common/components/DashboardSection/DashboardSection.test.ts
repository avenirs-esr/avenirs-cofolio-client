import type { VueWrapper } from '@vue/test-utils'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import DashboardSection from '@/common/components/DashboardSection/DashboardSection.vue'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { BaseApiException } from '@/common/exceptions'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a DashboardSection component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DashboardSection>>

  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const slots = {
    default: '<div data-testid="slot-content">Contenu</div>',
  }

  BddTest().when('mounted with the title only', () => {
    beforeEach(() => {
      wrapper = mountComponent(DashboardSection, {
        props: { title: 'Tableau de bord' },
        slots,
        global: { stubs },
      })
    })

    BddTest().then('it should render IconTitleCardContainer with the given title', () => {
      const container = wrapper.findComponent(IconTitleCardContainerStub)
      expect(container.exists()).toBe(true)
      expect(container.props('title')).toBe('Tableau de bord')
    })

    BddTest().then('it should fallback to the dashboard icon', () => {
      const container = wrapper.findComponent(IconTitleCardContainerStub)
      expect(container.props('titleIcon')).toBe(RI_ICONS.DASHBOARD_2_LINE)
    })

    BddTest().then('it should default the loading and error state of QuerySuspense', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)
      expect(querySuspense.exists()).toBe(true)
      expect(querySuspense.props('isLoading')).toBe(false)
      expect(querySuspense.props('error')).toBeNull()
    })

    BddTest().then('it should render the default slot content', () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true)
    })
  })

  BddTest().when('mounted with a custom title icon', () => {
    beforeEach(() => {
      wrapper = mountComponent(DashboardSection, {
        props: { title: 'Tableau de bord', titleIcon: MDI_ICONS.CHECK_CIRCLE },
        slots,
        global: { stubs },
      })
    })

    BddTest().then('it should forward the custom icon to IconTitleCardContainer', () => {
      expect(wrapper.findComponent(IconTitleCardContainerStub).props('titleIcon')).toBe(MDI_ICONS.CHECK_CIRCLE)
    })
  })

  BddTest().when('mounted in a loading state', () => {
    beforeEach(() => {
      wrapper = mountComponent(DashboardSection, {
        props: { title: 'Tableau de bord', isLoading: true },
        slots,
        global: { stubs },
      })
    })

    BddTest().then('it should forward the loading state to QuerySuspense', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('isLoading')).toBe(true)
    })

    BddTest().then('it should not render the default slot content', () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(false)
    })
  })

  BddTest().when('mounted with an error', () => {
    const error = new BaseApiException('Une erreur est survenue')

    beforeEach(() => {
      wrapper = mountComponent(DashboardSection, {
        props: { title: 'Tableau de bord', error },
        slots,
        global: { stubs },
      })
    })

    BddTest().then('it should forward the error to QuerySuspense', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('error')).toBe(error)
    })

    BddTest().then('it should not render the default slot content', () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(false)
    })
  })
})
