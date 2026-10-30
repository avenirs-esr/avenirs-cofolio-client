import type { AvSelectOption } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import { AvIconStub, AvSelectStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { EActivityRight, EAuthorization } from '@/api/avenir-esr'
import ActivityRightsUserRow
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityRightsUserRow/ActivityRightsUserRow.vue'
import { UserInfoStub } from '@/features/staff/admin/components/base/UserInfo/UserInfo.stub'
import { DeleteOverlayStub } from '@/features/student/global/components/interaction/DeleteOverlay/DeleteOverlay.stub'

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({ isMobile: mockIsMobile }),
  }
})

const user = { id: 'user-1', firstName: 'Alice', lastName: 'Dupont', email: 'alice@example.com' }

const stubs = {
  AvIcon: AvIconStub,
  AvSelect: AvSelectStub,
  AvTooltip: AvTooltipStub,
  DeleteOverlay: DeleteOverlayStub,
  UserInfo: UserInfoStub,
}

BddTest().given('an ActivityRightsUserRow component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityRightsUserRow>>

  const mountRow = (modelValue: EActivityRight[] = []) => {
    wrapper = mountComponent(ActivityRightsUserRow, { props: { user, modelValue }, global: { stubs } })
  }

  const getSelect = () => wrapper.findComponent(AvSelectStub)

  beforeEach(() => {
    mockIsMobile.value = false
  })

  BddTest().when('mounted without rights', () => {
    beforeEach(() => {
      mountRow()
    })

    BddTest().then('it should render the user and an empty authorizations select', () => {
      expect(wrapper.findComponent(UserInfoStub).props('user')).toEqual(user)
      expect(getSelect().props('multiple')).toBe(true)
      expect(getSelect().props('modelValue')).toEqual([])
      expect(getSelect().props('options')).toHaveLength(Object.values(EAuthorization).length)
    })

    BddTest().then('it should not render any authorization icon', () => {
      expect(wrapper.findAllComponents(AvIconStub)).toHaveLength(0)
    })

    BddTest().then('it should use the desktop layout', () => {
      expect(wrapper.find('.activity-rights-user-row--desktop').exists()).toBe(true)
    })
  })

  BddTest().when('mounted with rights', () => {
    beforeEach(() => {
      mountRow([EActivityRight.EDIT])
    })

    BddTest().then('it should select the matching option and display its icon', () => {
      expect(getSelect().props('modelValue')).toEqual([expect.objectContaining({ value: EAuthorization.EDIT })])
      expect(wrapper.findAllComponents(AvIconStub)).toHaveLength(1)
    })

    BddTest().then('it should describe each icon with a tooltip', () => {
      const editOption = (getSelect().props('options') as AvSelectOption[]).find(({ value }) => value === EAuthorization.EDIT)

      expect(editOption?.label).toBeTruthy()
      expect(wrapper.findComponent(AvTooltipStub).props('content')).toBe(editOption?.label)
    })
  })

  BddTest().when('the authorizations change', () => {
    beforeEach(() => {
      mountRow()
      getSelect().vm.$emit('update:modelValue', [{ value: EAuthorization.EDIT, label: 'Edit' }])
    })

    BddTest().then('it should emit the selected rights', () => {
      expect(wrapper.emitted('update:modelValue')).toEqual([[[EActivityRight.EDIT]]])
    })
  })

  BddTest().when('the delete overlay emits delete', () => {
    beforeEach(() => {
      mountRow()
      wrapper.findComponent(DeleteOverlayStub).vm.$emit('delete')
    })

    BddTest().then('it should emit delete', () => {
      expect(wrapper.emitted('delete')).toHaveLength(1)
    })
  })

  BddTest().when('the viewport is mobile', () => {
    beforeEach(() => {
      mockIsMobile.value = true
      mountRow()
    })

    BddTest().then('it should use the stacked layout', () => {
      expect(wrapper.find('.activity-rights-user-row--desktop').exists()).toBe(false)
    })
  })
})
