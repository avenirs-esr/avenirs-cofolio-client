import type { VueWrapper } from '@vue/test-utils/dist/src'
import type { AvSelectOption } from 'node_modules/@avenirs-esr/avenirs-dsav/dist'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import UserCategoriesMultiselect from '@/features/staff/admin/views/AdminInstitutionUsersView/components/selects/UserCategoriesMultiselect/UserCategoriesMultiselect.vue'

BddTest().given('a user categories multiselect', () => {
  let wrapper: VueWrapper <InstanceType<typeof UserCategoriesMultiselect>>

  const stubs = {
    AvSelect: AvSelectStub,

  }
  const mountWith = async () => {
    wrapper = mountComponent(UserCategoriesMultiselect, {

      global: { stubs },
    })

    await flushPromises()
  }

  const getSelect = () => wrapper.findComponent(AvSelectStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => await mountWith())

    BddTest().then('it should expose one option per EUserCategory', () => {
      const options = getSelect().props('options')
      expect(options).toHaveLength(Object.values(EUserCategory).length)

      expect(
        options!
          .filter((option): option is AvSelectOption => 'value' in option)
          .map(option => option.value as EUserCategory)
      ).toEqual(expect.arrayContaining([
        EUserCategory.STAFF,
        EUserCategory.STUDENT,
      ]))
    })

    BddTest().then('it should be a multiple select', () => {
      expect(getSelect().props('multiple')).toBe(true)
    })
  })

  BddTest().when('the user selects categories', () => {
    beforeEach(async () => await mountWith())

    BddTest().then('it should update the model with the selected enum values', async () => {
      getSelect().vm.$emit('update:modelValue', [
        { value: EUserCategory.STAFF, label: 'Enseignant(e)' },
        { value: EUserCategory.STUDENT, label: 'Apprenant(e)' },
      ])
      await flushPromises()

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted?.at(-1)?.[0]).toStrictEqual([EUserCategory.STAFF, EUserCategory.STUDENT])
    })
  })
})
