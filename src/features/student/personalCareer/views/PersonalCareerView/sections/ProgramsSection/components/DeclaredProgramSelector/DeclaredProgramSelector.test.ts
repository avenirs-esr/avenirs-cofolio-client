import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { SelectorOverlayStub } from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.stub'
import DeclaredProgramSelector, { type DeclaredProgramSelectorProps } from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeclaredProgramSelector/DeclaredProgramSelector.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a declared program selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramSelector>>

  const stubs = {
    AvIcon: AvIconStub,
    FloatingIconCard: FloatingIconCardStub,
    SelectorOverlay: SelectorOverlayStub
  }

  BddTest().when('the component is mounted with no declared programs', () => {
    const props: DeclaredProgramSelectorProps = {
      declaredPrograms: []
    }

    beforeEach(() => {
      wrapper = mount(DeclaredProgramSelector, { props, global: { stubs } })
    })

    BddTest().then('it should render no programs', () => {
      const programCards = wrapper.findAllComponents(FloatingIconCardStub)
      expect(programCards).toHaveLength(0)
    })
  })

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

    BddTest().then('it should render the declared programs', () => {
      const programCards = wrapper.findAllComponents(FloatingIconCardStub)
      expect(programCards).toHaveLength(2)
      expect(programCards[0].props('title')).toBe('Program 1')
      expect(programCards[1].props('title')).toBe('Program 2')
    })

    BddTest().and('a program card is clicked', () => {
      beforeEach(async () => {
        const toggle = wrapper.findAll('a[role="button"]')[0]
        await toggle.trigger('click')
      })

      BddTest().then('it should emit the select event with the correct program id', () => {
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['program-1'])
      })

      BddTest().and('the same program card is clicked again', () => {
        beforeEach(async () => {
          const toggle = wrapper.findAll('a[role="button"]')[0]
          await toggle.trigger('click')
        })

        BddTest().then('it should emit the deselect event with the correct program id', () => {
          expect(wrapper.emitted('update:modelValue')?.[1][0]).toEqual([])
        })
      })
    })

    BddTest().and('a program card receives the keydown event for Enter key', () => {
      beforeEach(async () => {
        const toggle = wrapper.findAll('a[role="button"]')[0]
        await toggle.trigger('keydown.enter')
      })

      BddTest().then('it should emit the select event with the correct program id', () => {
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['program-1'])
      })
    })

    BddTest().and('a program card receives the keydown event for Space key', () => {
      beforeEach(async () => {
        const toggle = wrapper.findAll('a[role="button"]')[0]
        await toggle.trigger('keydown.space')
      })

      BddTest().then('it should emit the select event with the correct program id', () => {
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['program-1'])
      })
    })
  })
})
