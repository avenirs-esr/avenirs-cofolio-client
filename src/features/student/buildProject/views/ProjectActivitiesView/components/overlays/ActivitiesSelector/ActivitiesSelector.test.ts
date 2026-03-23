import { EActivityThematic } from '@/api/avenir-esr'
import { ActivityCompactCardStub } from '@/features/student/buildProject/views/ProjectActivitiesView/components/cards/ActivityCompactCard/ActivityCompactCard.stub'
import ActivitiesSelector, { type ActivitiesSelectorProps } from '@/features/student/buildProject/views/ProjectActivitiesView/components/overlays/ActivitiesSelector/ActivitiesSelector.vue'
import { SelectorOverlayStub } from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.stub'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activities selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesSelector>>

  const stubs = {
    AvIcon: AvIconStub,
    ActivityCompactCard: ActivityCompactCardStub,
    SelectorOverlay: SelectorOverlayStub
  }

  BddTest().and('no activities are given', () => {
    const props: ActivitiesSelectorProps = {
      activities: [],
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(ActivitiesSelector, { props, global: { stubs } })
      })

      BddTest().then('it should render no elements', () => {
        const cards = wrapper.findAllComponents(ActivityCompactCardStub)
        expect(cards).toHaveLength(0)
      })
    })
  })

  BddTest().and('one element is given', () => {
    const props: ActivitiesSelectorProps = {
      activities: [
        {
          id: '1',
          title: 'Activity 1',
          thematic: EActivityThematic.TRANSVERSAL
        }
      ],
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(ActivitiesSelector, { props, global: { stubs } })
      })

      BddTest().then('it should render the activity', () => {
        const card = wrapper.findComponent(ActivityCompactCardStub)
        expect(card.exists()).toBe(true)
        expect(card.props('activity')).toEqual({ id: props.activities[0].id, title: props.activities[0].title })
      })

      BddTest().and('the activity is clicked', () => {
        beforeEach(async () => {
          expect(wrapper.find('[data-testid="selector-overlay"]').exists()).toBe(true)
          await wrapper.find('[data-testid="selector-overlay"]').trigger('click')
        })

        BddTest().then('it should update the model with the activity id', () => {
          expect(wrapper.emitted('update:modelValue')).toBeTruthy()
          expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([props.activities[0].id])
        })

        BddTest().and('the activity is clicked again', () => {
          beforeEach(async () => {
            expect(wrapper.find('[data-testid="selector-overlay"]').exists()).toBe(true)
            await wrapper.find('[data-testid="selector-overlay"]').trigger('click')
          })

          BddTest().then('it should update the model to remove the activity id', () => {
            expect(wrapper.emitted('update:modelValue')?.[1][0]).toEqual([])
          })
        })
      })
    })
  })

  BddTest().and('many activities are given', () => {
    const props: ActivitiesSelectorProps = {
      activities: [
        {
          id: '1',
          title: 'Activity 1',
          thematic: EActivityThematic.TRANSVERSAL
        },
        {
          id: '2',
          title: 'Activity 2',
          thematic: EActivityThematic.TRANSVERSAL
        }
      ],
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(ActivitiesSelector, { props, global: { stubs } })
      })

      BddTest().then('it should render the activities', () => {
        const cards = wrapper.findAllComponents(ActivityCompactCardStub)
        expect(cards).toHaveLength(2)
        expect(cards[0].props('activity')).toEqual({ id: props.activities[0].id, title: props.activities[0].title })
        expect(cards[1].props('activity')).toEqual({ id: props.activities[1].id, title: props.activities[1].title })
      })
    })
  })

  BddTest().and('readonly is given', () => {
    const props: ActivitiesSelectorProps = {
      activities: [
        {
          id: '1',
          title: 'Activity 1',
          thematic: EActivityThematic.TRANSVERSAL
        }
      ],
      readonly: true
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mount(ActivitiesSelector, { props, global: { stubs } })
      })

      BddTest().then('it should not render the overlay', () => {
        expect(wrapper.find('[data-testid="selector-overlay"]').exists()).toBe(false)
      })
    })
  })
})
