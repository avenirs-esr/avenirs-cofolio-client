import type { VueWrapper } from '@vue/test-utils'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { getGroupsEmptyHandler, getGroupsErrorHandler } from '@/__mocks__/msw/handlers/staffs/groups.handlers'
import { server } from '@/__mocks__/msw/server'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import InstitutionGroupsMultiselect from '@/features/staff/admin/views/AdminInstitutionUsersView/components/selects/InstitutionGroupsMultiselect/InstitutionGroupsMultiselect.vue'

BddTest().given('an institution groups multiselect', () => {
  let wrapper: VueWrapper<InstanceType<typeof InstitutionGroupsMultiselect>>

  const stubs = {
    AvSelect: AvSelectStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const mountWith = async () => {
    wrapper = mountComponent(InstitutionGroupsMultiselect, {

      global: { stubs },
    })

    await flushPromises()
  }

  const getAvSelect = () => wrapper.findComponent(AvSelectStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)

  BddTest().when('the groups are fetched successfully', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should forward the loading state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(false)
    })

    BddTest().then('it should render AvSelect with the expected props', () => {
      const select = getAvSelect()

      expect(select.exists()).toBe(true)
      expect(select.props('label')).toBe('Filtrer par groupes')
      expect(select.props('placeholder')).toBe('Sélectionnez un/des groupe(s)')
      expect(select.props('multiple')).toBe(true)
      expect(select.props('disabled')).toBe(false)
      expect(select.props('labelVisible')).toBe(true)
      expect(select.props('required')).toBe(true)
      expect(select.props('dense')).toBe(true)
      expect(select.props('height')).toBe('2.5rem')
      expect(select.props('collapseMaxHeight')).toBe('35vh')
      expect(select.props('width')).toBe('var(--dimension-8xl)')
    })

    BddTest().then('it should render the fetched groups as options', () => {
      const select = getAvSelect()
      const options = select.props('options')

      expect(options).toBeDefined()
      expect(options!.length).toBeGreaterThan(0)

      options!.forEach((option) => {
        expect(option).toEqual(expect.objectContaining({
          value: expect.any(String),
          label: expect.any(String),
        }))
      })
    })

    BddTest().then('it should initialize the selected options to null', () => {
      expect(getAvSelect().props('modelValue')).toBeNull()
    })
  })

  BddTest().when('the user selects groups', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should update the selected groups model with their ids', async () => {
      const select = getAvSelect()
      const options = select.props('options')!

      const selectedOptions = options.slice(0, 2)

      await select.vm.$emit('update:modelValue', selectedOptions)
      await flushPromises()

      expect(wrapper.findComponent(AvSelectStub).props('modelValue')).toEqual(selectedOptions)
    })

    BddTest().then('it should update the selected groups model when one group is selected', async () => {
      const select = getAvSelect()
      const option = select.props('options')![0]

      await select.vm.$emit('update:modelValue', option)
      await flushPromises()

      expect(wrapper.findComponent(AvSelectStub).props('modelValue')).toEqual(option)
    })

    BddTest().then('it should clear the selected groups model when the selection is empty', async () => {
      const select = getAvSelect()

      await select.vm.$emit('update:modelValue', [])
      await flushPromises()

      expect(wrapper.findComponent(AvSelectStub).props('modelValue')).toEqual([])
    })
  })

  BddTest().when('the groups request returns no groups', () => {
    beforeEach(async () => {
      server.use(getGroupsEmptyHandler)

      await mountWith()
    })

    BddTest().then('it should disable AvSelect', async () => {
      expect(getAvSelect().props('disabled')).toBe(true)
    })

    BddTest().then('it should render an empty list of options', async () => {
      expect(getAvSelect().props('options')).toEqual([])
    })
  })

  BddTest().when('the groups request fails', () => {
    beforeEach(async () => {
      server.use(getGroupsErrorHandler)

      await mountWith()
    })

    BddTest().then('it should forward the error to QuerySuspense', async () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('error')).toBeTruthy()
    })

    BddTest().then('it should not render AvSelect', async () => {
      expect(wrapper.findComponent(AvSelectStub).exists()).toBe(false)
    })
  })
})
