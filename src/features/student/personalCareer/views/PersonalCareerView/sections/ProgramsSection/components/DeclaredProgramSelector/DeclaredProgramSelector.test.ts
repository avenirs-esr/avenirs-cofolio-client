import { CompactCardSelectorStub } from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.stub'
import DeclaredProgramSelector, { type DeclaredProgramSelectorProps } from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeclaredProgramSelector/DeclaredProgramSelector.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a declared program selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramSelector>>

  const stubs = {
    AvIcon: AvIconStub,
    CompactCardSelector: CompactCardSelectorStub,
  }

  BddTest().when('the component is mounted with declared programs', () => {
    const props: DeclaredProgramSelectorProps = {
      declaredPrograms: [
        { label: 'Program 1', value: 'program-1' },
        { label: 'Program 2', value: 'program-2' }
      ]
    }

    beforeEach(() => {
      wrapper = mount(DeclaredProgramSelector, { props, global: { stubs } })
    })

    BddTest().and('the user selects programs to delete from the selector', () => {
      beforeEach(() => {
        const selector = wrapper.findComponent(CompactCardSelectorStub)
        selector.vm.$emit('update:modelValue', ['program-1', 'program-2'])
      })

      BddTest().then('the selectedIds should be updated accordingly', () => {
        expect(wrapper.findComponent(CompactCardSelectorStub).props('modelValue')).toEqual(['program-1', 'program-2'])
      })
    })
  })
})
