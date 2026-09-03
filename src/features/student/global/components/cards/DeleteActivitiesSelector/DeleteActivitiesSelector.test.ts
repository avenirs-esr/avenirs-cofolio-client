import { buildAssociation } from '@/__mocks__/fixtures/student/activities.fixtures'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { DeclaredActivityStatusBadgeStub } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.stub'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import { CompactCardSelectorStub } from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.stub'
import DeleteActivitiesSelector, { type DeleteActivitiesSelectorProps } from '@/features/student/global/components/cards/DeleteActivitiesSelector/DeleteActivitiesSelector.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a delete activities selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteActivitiesSelector>>

  const stubs = {
    CompactCardSelector: CompactCardSelectorStub,
    DeclaredActivityStatusBadge: DeclaredActivityStatusBadgeStub
  }

  BddTest().when('the component is mounted with a deletable and a non-deletable association', () => {
    const props: DeleteActivitiesSelectorProps = {
      associations: [
        buildAssociation({ associationId: '1', status: EDeclaredActivityStatus.SUBSCRIBED }),
        buildAssociation({ associationId: '2', status: EDeclaredActivityStatus.SUBMITTED })
      ]
    }

    beforeEach(() => {
      wrapper = mount(DeleteActivitiesSelector, { props, global: { stubs } })
    })

    BddTest().then('it should map each association disabled state from isDeletableDeclaredActivityAssociation', () => {
      const compactCardSelector = wrapper.findComponent(CompactCardSelectorStub)
      const elements = compactCardSelector.props('elements')

      expect(elements).toEqual([
        expect.objectContaining({ id: '1', disabled: false }),
        expect.objectContaining({ id: '2', disabled: true })
      ])
    })

    BddTest().then('it should render a status badge for every association', () => {
      const badges = wrapper.findAllComponents(DeclaredActivityStatusBadge)
      expect(badges).toHaveLength(props.associations.length)
      expect(badges[0].props('status')).toBe(EDeclaredActivityStatus.SUBSCRIBED)
      expect(badges[1].props('status')).toBe(EDeclaredActivityStatus.SUBMITTED)
    })
  })

  BddTest().when('an association is selected', () => {
    const props: DeleteActivitiesSelectorProps = {
      associations: [
        buildAssociation({ associationId: '1', status: EDeclaredActivityStatus.SUBSCRIBED })
      ]
    }

    beforeEach(() => {
      wrapper = mount(DeleteActivitiesSelector, { props, global: { stubs } })
    })

    BddTest().then('it should update the model with the association id', async () => {
      const compactCardSelector = wrapper.findComponent(CompactCardSelectorStub)
      await compactCardSelector.vm.$emit('update:modelValue', ['1'])

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['1'])
    })
  })

  BddTest().when('the component is mounted in readonly mode', () => {
    const props: DeleteActivitiesSelectorProps = {
      associations: [
        buildAssociation({ associationId: '1', status: EDeclaredActivityStatus.SUBSCRIBED })
      ],
      readonly: true
    }

    beforeEach(() => {
      wrapper = mount(DeleteActivitiesSelector, { props, global: { stubs } })
    })

    BddTest().then('it should pass readonly down to the compact card selector', () => {
      const compactCardSelector = wrapper.findComponent(CompactCardSelectorStub)
      expect(compactCardSelector.props('readonly')).toBe(true)
    })
  })
})
