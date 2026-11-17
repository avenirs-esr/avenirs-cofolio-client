import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, beforeEach, expect } from 'vitest'
import PendingItemsList from '@/features/student/associations/components/overlays/modals/ConfirmManageAssociationModal/PendingItemsList.vue'

BddTest().given('a pending items list', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof PendingItemsList>>

  afterEach(() => wrapper?.unmount())

  BddTest().when('the list is empty', () => {
    beforeEach(() => {
      wrapper = mountComponent(PendingItemsList, { props: { items: [] } })
    })

    BddTest().then('it should render nothing', () => {
      expect(wrapper.find('[data-testid="confirm-associate-modal__items-list"]').exists()).toBe(false)
      expect(wrapper.text()).toBe('')
    })
  })

  const cases: Array<[EAssociationContextType, string, string]> = [
    [EAssociationContextType.TRACE, '1 trace', '2 traces'],
    [EAssociationContextType.DECLARED_ACTIVITY, '1 activité', '2 activités'],
    [EAssociationContextType.DECLARED_SKILL, '1 compétence', '2 compétences'],
    [EAssociationContextType.DECLARED_EXPERIENCE, '1 expérience', '2 expériences'],
    [EAssociationContextType.DECLARED_PROGRAM, '1 formation', '2 formations']
  ]

  cases.forEach(([contextType, singular, plural]) => {
    BddTest().when(`the list contains one ${contextType} item`, () => {
      const first = { id: '1', title: 'First item', contextType }

      beforeEach(() => {
        wrapper = mountComponent(PendingItemsList, { props: { items: [first] } })
      })

      BddTest().then('it should render the singular count and item title', () => {
        expect(wrapper.text()).toContain(singular)
        expect(wrapper.findAll('li').map(item => item.text())).toEqual(['First item'])
      })

      BddTest().and('another item is added', () => {
        beforeEach(async () => {
          await wrapper.setProps({ items: [first, { id: '2', title: 'Second item', contextType }] })
        })

        BddTest().then('it should render the plural count and both item titles', () => {
          expect(wrapper.text()).toContain(plural)
          expect(wrapper.findAll('li').map(item => item.text())).toEqual(['First item', 'Second item'])
        })
      })
    })
  })
})
