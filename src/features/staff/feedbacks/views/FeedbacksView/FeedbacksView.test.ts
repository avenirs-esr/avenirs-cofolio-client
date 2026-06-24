import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { FeedbackStatusPickerStub } from '@/features/staff/feedbacks/components/interaction/pickers/FeedbackStatusPicker/FeedbackStatusPicker.stub'
import { FeedbacksTableStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.stub'
import FeedbacksView from '@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a feedbacks view', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbacksView>>

  const stubs = {
    PageTitle: PageTitleStub,
    FeedbackStatusPicker: FeedbackStatusPickerStub,
    FeedbacksTable: FeedbacksTableStub,
  }

  beforeEach(() => {
    wrapper = mountComponent(FeedbacksView, {
      global: {
        stubs,
      },
    })
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Toutes mes demandes de feedback')

      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Suivi des apprenants' },
        { text: 'Toutes mes demandes de feedback' },
      ])
    })

    BddTest().then('it should render FeedbackStatusPicker', () => {
      expect(wrapper.findComponent(FeedbackStatusPickerStub).exists()).toBe(true)
    })

    BddTest().then('it should render FeedbacksTable', () => {
      expect(wrapper.findComponent(FeedbacksTableStub).exists()).toBe(true)
    })
  })
})
