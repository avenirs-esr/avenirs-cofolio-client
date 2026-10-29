import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import AssessmentsView from '@/features/staff/assessments/views/AssessmentsView/AssessmentsView.vue'
import { AssessmentsListStub } from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.stub'

BddTest().given('an assessments view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentsView>>

  const stubs = {
    PageTitle: PageTitleStub,
    AssessmentsList: AssessmentsListStub,
  }

  const mountWith = async () => {
    wrapper = mountComponent(AssessmentsView, {
      global: { stubs },
    })
    await flushPromises()
  }

  BddTest().when('the view is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render PageTitle with correct title', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Toutes mes évaluations')
    })

    BddTest().then('it should render AssessmentsList', () => {
      expect(wrapper.findComponent(AssessmentsListStub).exists()).toBe(true)
    })
  })
})
