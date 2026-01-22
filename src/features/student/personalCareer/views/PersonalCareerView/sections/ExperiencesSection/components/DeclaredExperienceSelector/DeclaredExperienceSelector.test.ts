import { SelectorOverlayStub } from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.stub'
import { DeclaredExperienceCompactCardStub } from '@/features/student/personalCareer/components/cards/DeclaredExperienceCompactCard/DeclaredExperienceCompactCard.stub'
import DeclaredExperienceSelector, { type DeclaredExperienceSelectorProps } from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperienceSelector/DeclaredExperienceSelector.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a declared experience selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceSelector>>

  const stubs = {
    AvIcon: AvIconStub,
    DeclaredExperienceCompactCard: DeclaredExperienceCompactCardStub,
    SelectorOverlay: SelectorOverlayStub
  }

  BddTest().when('the component is mounted with no declared experiences', () => {
    const props: DeclaredExperienceSelectorProps = {
      declaredExperiences: []
    }

    beforeEach(() => {
      wrapper = mount(DeclaredExperienceSelector, { props, global: { stubs } })
    })

    BddTest().then('it should render no experiences', () => {
      const experienceCards = wrapper.findAllComponents(DeclaredExperienceCompactCardStub)
      expect(experienceCards).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with declared experiences', () => {
    const props: DeclaredExperienceSelectorProps = {
      declaredExperiences: [
        { label: 'Experience 1', value: 'experience-1' },
        { label: 'Experience 2', value: 'experience-2' }
      ]
    }

    beforeEach(() => {
      wrapper = mount(DeclaredExperienceSelector, { props, global: { stubs } })
    })

    BddTest().then('it should render the declared experiences', () => {
      const experienceCards = wrapper.findAllComponents({ name: 'DeclaredExperienceCompactCard' })
      expect(experienceCards).toHaveLength(2)
      expect(experienceCards[0].props('title')).toBe('Experience 1')
      expect(experienceCards[1].props('title')).toBe('Experience 2')
    })

    BddTest().and('a experience card is clicked', () => {
      beforeEach(async () => {
        const toggle = wrapper.findAll('a[role="button"]')[0]
        await toggle.trigger('click')
      })

      BddTest().then('it should emit the select event with the correct experience id', () => {
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['experience-1'])
      })

      BddTest().and('the same experience card is clicked again', () => {
        beforeEach(async () => {
          const toggle = wrapper.findAll('a[role="button"]')[0]
          await toggle.trigger('click')
        })

        BddTest().then('it should emit the deselect event with the correct experience id', () => {
          expect(wrapper.emitted('update:modelValue')?.[1][0]).toEqual([])
        })
      })
    })

    BddTest().and('a experience card receives the keydown event for Enter key', () => {
      beforeEach(async () => {
        const toggle = wrapper.findAll('a[role="button"]')[0]
        await toggle.trigger('keydown.enter')
      })

      BddTest().then('it should emit the select event with the correct experience id', () => {
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['experience-1'])
      })
    })

    BddTest().and('a experience card receives the keydown event for Space key', () => {
      beforeEach(async () => {
        const toggle = wrapper.findAll('a[role="button"]')[0]
        await toggle.trigger('keydown.space')
      })

      BddTest().then('it should emit the select event with the correct experience id', () => {
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(['experience-1'])
      })
    })
  })
})
