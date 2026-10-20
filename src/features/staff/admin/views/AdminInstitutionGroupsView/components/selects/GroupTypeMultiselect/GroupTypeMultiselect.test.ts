import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect, vi } from 'vitest'
import { EGroupType } from '@/api/avenir-esr'
import GroupTypeMultiselect from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/selects/GroupTypeMultiselect/GroupTypeMultiselect.vue'

BddTest().given('a GroupTypeMultiselect component', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupTypeMultiselect>>

  const mountWith = (typesSelected: EGroupType[] = []) => {
    wrapper = mount(GroupTypeMultiselect, {
      props: {
        modelValue: typesSelected
      },
      global: {
        stubs: {
          AvSelect: AvSelectStub
        }
      }
    })
  }

  const getMultiselect = () => wrapper.findComponent(AvSelectStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the multiselect with the group type options', () => {
      expect(getMultiselect().props('options')).toEqual([
        {
          value: EGroupType.PROGRAM,
          label: 'Formation',
          icon: MDI_ICONS.SCHOOL_OUTLINE
        },
        {
          value: EGroupType.PROGRAM_OPTION,
          label: 'Option de formation',
          icon: MDI_ICONS.BOOK_OPEN_BLANK_VARIANT_OUTLINE
        },
        {
          value: EGroupType.STUDENT_GROUP,
          label: 'Ensemble d\'apprenant(e)s',
          icon: MDI_ICONS.PEOPLE_GROUP_OUTLINE
        }
      ])
    })

    BddTest().then('it should expose the expected select props', () => {
      expect(getMultiselect().props()).toMatchObject({
        multiple: true,
        dense: true,
        width: 'var(--dimension-7xl)',
        height: '2.5rem',
        label: expect.any(String),
        placeholder: expect.any(String)
      })
    })

    BddTest().then('it should expose the group type multiselect test identifier', () => {
      expect(wrapper.find('[data-testid="group-type-multiselect"]').exists()).toBe(true)
    })

    BddTest().and('when the user selects some options', () => {
      beforeEach(() => {
        getMultiselect().vm.$emit('update:modelValue', [
          { label: 'Formation', value: EGroupType.PROGRAM },
          { label: 'Ensemble d\'apprenant(e)s', value: EGroupType.STUDENT_GROUP }
        ])
      })

      BddTest().then('it should emit the selected group types', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
            [EGroupType.PROGRAM, EGroupType.STUDENT_GROUP]
          ])
        })
      })
    })
  })

  BddTest().when('the component is mounted with selected group types', () => {
    beforeEach(() => {
      mountWith([EGroupType.PROGRAM, EGroupType.PROGRAM_OPTION])
    })

    BddTest().then('it should initialize the selected options from the model', () => {
      expect(getMultiselect().props('modelValue')).toEqual([])
    })
  })
})
