import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { EAuthorizationEntityType } from '@/api/avenir-esr'
import AuthorizationEntityTypeSelect from '@/features/staff/admin/views/InstitutionUserDetailedView/components/selects/AuthorizationEntityTypeSelect/AuthorizationEntityTypeSelect.vue'

const stubs = {
  AvSelect: AvSelectStub,
}

function mountSelect (modelValue: EAuthorizationEntityType) {
  return mountComponent(AuthorizationEntityTypeSelect, {
    props: { modelValue },
    global: { stubs },
  })
}

BddTest().given('an authorization entity type select', () => {
  let wrapper: ReturnType<typeof mountSelect>

  const getAvSelect = () => wrapper.findComponent(AvSelectStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountSelect(EAuthorizationEntityType.ACTIVITY)
    })

    BddTest().then('it should render the select with its translated label and placeholder', () => {
      expect(getAvSelect().exists()).toBe(true)
      expect(getAvSelect().props('label')).toBe('Type d\'entité')
      expect(getAvSelect().props('placeholder')).toBe('Sélectionnez un type d\'entité')
    })

    BddTest().then('it should forward the required and width props', () => {
      expect(getAvSelect().props('required')).toBe(true)
      expect(getAvSelect().props('width')).toBe('100%')
    })

    BddTest().then('it should map every entity type to a translated option', () => {
      expect(getAvSelect().props('options')).toEqual(
        Object.values(EAuthorizationEntityType).map(type => ({
          value: type,
          label: ({
            [EAuthorizationEntityType.ACTIVITY]: 'Activité',
            [EAuthorizationEntityType.ACTIVITY_DRAFT]: 'Brouillon d\'activité',
          } as Record<EAuthorizationEntityType, string>)[type],
        })),
      )
    })

    BddTest().then('it should select the entity type of the model', () => {
      expect(getAvSelect().props('modelValue')).toEqual({
        value: EAuthorizationEntityType.ACTIVITY,
        label: 'Activité',
      })
    })

    BddTest().and('the model changes', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          modelValue: EAuthorizationEntityType.ACTIVITY_DRAFT,
        })
      })

      BddTest().then('it should select the new entity type', () => {
        expect(getAvSelect().props('modelValue')).toEqual({
          value: EAuthorizationEntityType.ACTIVITY_DRAFT,
          label: 'Brouillon d\'activité',
        })
      })
    })

    BddTest().and('the user selects another entity type', () => {
      beforeEach(async () => {
        await getAvSelect().vm.$emit('update:modelValue', {
          value: EAuthorizationEntityType.ACTIVITY_DRAFT,
          label: 'Brouillon d\'activité',
        })
      })

      BddTest().then('it should update the model with the selected entity type', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([
          [EAuthorizationEntityType.ACTIVITY_DRAFT],
        ])
      })

      BddTest().then('it should update the selected option', () => {
        expect(getAvSelect().props('modelValue')).toEqual({
          value: EAuthorizationEntityType.ACTIVITY_DRAFT,
          label: 'Brouillon d\'activité',
        })
      })
    })
  })
})
