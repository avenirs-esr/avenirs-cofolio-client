import type { StudentPerspectiveCardProps } from '@/features/staff/feedbacks/components/cards/StudentPerspectiveCard/StudentPerspectiveCard.vue'
import type { VueWrapper } from '@vue/test-utils'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import StudentPerspectiveCard from '@/features/staff/feedbacks/components/cards/StudentPerspectiveCard/StudentPerspectiveCard.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student perspective card', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentPerspectiveCard>>

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub
  }

  const getContent = () =>
    wrapper.find('[data-testid="student-perspective-card-content"]')

  BddTest().when('the component is mounted with a perspective', () => {
    const props: StudentPerspectiveCardProps = {
      perspective: '<p>This is the student perspective</p>'
    }

    beforeEach(() => {
      wrapper = mountComponent(StudentPerspectiveCard, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render a collapsible card', () => {
      const card = wrapper.findComponent(CardStub)

      expect(card.exists()).toBe(true)
      expect(card.props('collapsible')).toBe(true)
      expect(card.props('collapsed')).toBe(false)
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.findComponent(AvIconTextStub)

      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe('Sa prise de recul')
    })

    BddTest().then('it should render the perspective content', () => {
      const content = getContent()

      expect(content.exists()).toBe(true)
      expect(content.html()).toContain('This is the student perspective')
    })
  })

  BddTest().when('the component is mounted without a perspective', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentPerspectiveCard, {
        global: { stubs }
      })
    })

    BddTest().then('it should render an empty content', () => {
      const content = getContent()

      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('')
    })
  })
})
