import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { EAuthorizationEntityType } from '@/api/avenir-esr'
import AuthorizationEntityTypeSelect from '@/features/staff/admin/views/InstitutionUserDetailedView/components/selects/AuthorizationEntityTypeSelect/AuthorizationEntityTypeSelect.vue'

const stubs = {
  AvSelect: AvSelectStub,
}

const entityTypeLabels: Record<EAuthorizationEntityType, string> = {
  [EAuthorizationEntityType.ACTIVITY]: 'Activité',
  [EAuthorizationEntityType.ACTIVITY_DRAFT]: 'Brouillon d\'activité',
}

function mountSelect (
  modelValue: EAuthorizationEntityType | undefined = EAuthorizationEntityType.ACTIVITY,
  userId = 'USER_ALL_TYPES_ID',
) {
  return mountComponent(AuthorizationEntityTypeSelect, {
    props: {
      modelValue,
      user: {
        ...mockExternalUserDetail,
        id: userId,
      },
    },
    global: { stubs },
  })
}

BddTest().given('an authorization entity type select', () => {
  let wrapper: ReturnType<typeof mountSelect>

  const getAvSelect = () => wrapper.findComponent(AvSelectStub)

  BddTest().when('the user has available authorization entity types', () => {
    beforeEach(() => {
      wrapper = mountSelect()
    })

    BddTest().then('it should render the select with its translated label and placeholder', async () => {
      await vi.waitFor(() => {
        expect(getAvSelect().exists()).toBe(true)
      })

      expect(getAvSelect().props('label')).toBe('Type d\'entité')
      expect(getAvSelect().props('placeholder')).toBe('Sélectionnez un type d\'entité')
    })

    BddTest().then('it should forward the required and width props', async () => {
      await vi.waitFor(() => {
        expect(getAvSelect().exists()).toBe(true)
      })

      expect(getAvSelect().props('required')).toBe(true)
      expect(getAvSelect().props('width')).toBe('100%')
    })

    BddTest().then('it should map the available entity types to translated options', async () => {
      await vi.waitFor(() => {
        expect(getAvSelect().props('options')).toEqual(
          Object.values(EAuthorizationEntityType).map(type => ({
            value: type,
            label: entityTypeLabels[type],
          })),
        )
      })
    })

    BddTest().then('it should select the entity type of the model', async () => {
      await vi.waitFor(() => {
        expect(getAvSelect().props('modelValue')).toEqual({
          value: EAuthorizationEntityType.ACTIVITY,
          label: 'Activité',
        })
      })
    })

    BddTest().and('the model changes', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          modelValue: EAuthorizationEntityType.ACTIVITY_DRAFT,
        })
      })

      BddTest().then('it should select the new entity type', async () => {
        await vi.waitFor(() => {
          expect(getAvSelect().props('modelValue')).toEqual({
            value: EAuthorizationEntityType.ACTIVITY_DRAFT,
            label: 'Brouillon d\'activité',
          })
        })
      })
    })

    BddTest().and('the user selects another entity type', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          expect(getAvSelect().exists()).toBe(true)
        })

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

  BddTest().when('the user has only one available authorization entity type', () => {
    beforeEach(() => {
      wrapper = mountSelect(
        EAuthorizationEntityType.ACTIVITY,
        'USER_ACTIVITY_ID',
      )
    })

    BddTest().then('it should only display the available entity type', async () => {
      await vi.waitFor(() => {
        expect(getAvSelect().props('options')).toEqual([
          {
            value: EAuthorizationEntityType.ACTIVITY,
            label: 'Activité',
          },
        ])
      })
    })
  })

  BddTest().when('the user has no available authorization entity types', () => {
    beforeEach(() => {
      wrapper = mountSelect(
        EAuthorizationEntityType.ACTIVITY,
        'USER_NONE_ID',
      )
    })

    BddTest().then('it should not render the select', async () => {
      await vi.waitFor(() => {
        expect(getAvSelect().exists()).toBe(false)
      })
    })
  })

  BddTest().when('the API returns an error', () => {
    beforeEach(() => {
      wrapper = mountSelect(
        EAuthorizationEntityType.ACTIVITY,
        'INVALID_USER_ID',
      )
    })

    BddTest().then('it should not render the select', async () => {
      await vi.waitFor(() => {
        expect(getAvSelect().exists()).toBe(false)
      })
    })
  })
})
