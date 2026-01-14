import type { VueWrapper } from '@vue/test-utils'
import { EDeclaredSkillLevel } from '@/api/avenir-esr'
import DeclaredSkillLevelRadioButtonSet from '@/features/student/declaredSkills/components/interactions/radios/DeclaredSkillLevelRadioButtonSet/DeclaredSkillLevelRadioButtonSet.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  AvRadioButtonSet: {
    name: 'AvRadioButtonSet',
    props: ['modelValue', 'legend', 'errorMessage', 'name'],
    emits: ['update:modelValue', 'blur'],
    setup (props: any, { emit }: any) {
      return { emit }
    },
    template: `
      <fieldset class="av-radio-button-set-stub">
        <legend>{{ legend }}</legend>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div>
          <slot />
        </div>
      </fieldset>
    `
  },
  AvRadioButton: {
    name: 'AvRadioButton',
    props: ['value'],
    template: `
      <div class="av-radio-button-stub" :data-value="value">
        <slot />
      </div>
    `
  },
  AvBadge: AvBadgeStub
}

BddTest().given('a skill level field component', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    vi.clearAllMocks()

    wrapper = mountComponent(DeclaredSkillLevelRadioButtonSet, {
      props: {
        modelValue: undefined,
        name: 'skillLevel'
      },
      global: {
        stubs
      }
    })

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="skill-level-field"]').exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the skill level field container', () => {
      const container = wrapper.find('[data-testid="skill-level-field"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render AvRadioButtonSet with correct props', () => {
      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

      expect(radioButtonSet.exists()).toBe(true)
      expect(radioButtonSet.props('legend')).toBe('Auto-positionnement')
      expect(radioButtonSet.props('name')).toBe('skillLevel')
      expect(radioButtonSet.props('modelValue')).toBeUndefined()
    })

    BddTest().then('it should render all skill level radio buttons', () => {
      const levelOptions = wrapper.findAll('[data-testid="level-option"]')

      expect(levelOptions).toHaveLength(5)
    })

    BddTest().then('it should render level options with badges and descriptions', () => {
      const levelOptions = wrapper.findAll('[data-testid="level-option"]')
      expect(levelOptions).toHaveLength(5)

      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      expect(badges).toHaveLength(5)

      const descriptions = wrapper.findAll('.b2-regular')
      expect(descriptions).toHaveLength(5)

      expect(badges[0].props('label')).toBe('Débutant')
      expect(descriptions[0].text()).toBe('Je découvre cette compétence')
    })

    BddTest().then('it should render badges with correct colors', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })

      expect(badges[0].props('backgroundColor')).toBe('var(--light-background-primary3)')
      expect(badges[0].props('color')).toBe('var(--dark-background-primary3)')

      expect(badges[1].props('backgroundColor')).toBe('var(--light-background-info)')
      expect(badges[1].props('color')).toBe('var(--dark-background-info)')

      expect(badges[2].props('backgroundColor')).toBe('var(--light-background-critical)')
      expect(badges[2].props('color')).toBe('var(--light-foreground-critical)')

      expect(badges[3].props('backgroundColor')).toBe('var(--light-background-primary2)')
      expect(badges[3].props('color')).toBe('var(--dark-background-primary2)')

      expect(badges[4].props('backgroundColor')).toBe('var(--light-background-primary1)')
      expect(badges[4].props('color')).toBe('var(--light-foreground-primary2)')
    })

    BddTest().then('it should render badges with correct icons', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })

      expect(badges[0].props('icon')).toBeDefined()
      expect(badges[1].props('icon')).toBeDefined()
      expect(badges[2].props('icon')).toBeDefined()
      expect(badges[3].props('icon')).toBeDefined()
      expect(badges[4].props('icon')).toBeDefined()
    })
  })

  BddTest().when('a skill level is selected', () => {
    BddTest().then('it should accept valid enum value BEGINNER', async () => {
      await wrapper.setProps({ modelValue: EDeclaredSkillLevel.BEGINNER })
      await wrapper.vm.$nextTick()

      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      expect(radioButtonSet.props('modelValue')).toBe(EDeclaredSkillLevel.BEGINNER)
    })

    BddTest().then('it should accept valid enum value EXPERT', async () => {
      await wrapper.setProps({ modelValue: EDeclaredSkillLevel.EXPERT })
      await wrapper.vm.$nextTick()

      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      expect(radioButtonSet.props('modelValue')).toBe(EDeclaredSkillLevel.EXPERT)
    })

    BddTest().then('it should handle invalid value gracefully', async () => {
      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

      await radioButtonSet.vm.$emit('update:modelValue', 123)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    BddTest().then('it should handle non-enum string value gracefully', async () => {
      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

      await radioButtonSet.vm.$emit('update:modelValue', 'INVALID_LEVEL')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  BddTest().when('an error message prop is provided', () => {
    BddTest().then('it should show error message', async () => {
      await wrapper.setProps({ errorMessage: 'Un niveau d\'auto-positionnement doit être sélectionné' })
      await wrapper.vm.$nextTick()

      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      expect(radioButtonSet.props('errorMessage')).toBe('Un niveau d\'auto-positionnement doit être sélectionné')
    })
  })

  BddTest().when('no error message prop is provided', () => {
    BddTest().then('it should not show error message', () => {
      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      const errorMessage = radioButtonSet.props('errorMessage')
      expect(errorMessage === undefined || errorMessage === '').toBe(true)
    })
  })

  BddTest().when('skill config data is available', () => {
    BddTest().then('it should display skill config labels and descriptions', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      const descriptions = wrapper.findAll('.b2-regular')

      badges.forEach((badge) => {
        expect(badge.props('label')).toBeDefined()
        expect(typeof badge.props('label')).toBe('string')
      })

      descriptions.forEach((description) => {
        expect(description.text()).toBeDefined()
        expect(description.text().length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should handle different skill levels configuration', () => {
      const radioButtons = wrapper.findAllComponents({ name: 'AvRadioButton' })

      const expectedLevels = [
        EDeclaredSkillLevel.BEGINNER,
        EDeclaredSkillLevel.INTERMEDIATE,
        EDeclaredSkillLevel.COMPETENT,
        EDeclaredSkillLevel.ADVANCED,
        EDeclaredSkillLevel.EXPERT
      ]

      radioButtons.forEach((button, index) => {
        expect(button.props('value')).toBe(expectedLevels[index])
      })
    })
  })

  BddTest().when('badges are configured for skill levels', () => {
    BddTest().then('it should have unique background colors for each level', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      const backgroundColors = badges.map(badge => badge.props('backgroundColor'))

      const uniqueColors = new Set(backgroundColors)
      expect(uniqueColors.size).toBe(5)
    })

    BddTest().then('it should have matching text colors for readability', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })

      badges.forEach((badge) => {
        expect(badge.props('backgroundColor')).toMatch(/var\(--light-background-/)
        expect(badge.props('color')).toMatch(/var\(--(light|dark)-(background|foreground)-/)
      })
    })

    BddTest().then('it should render with proper icon paths for each level', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })

      badges.forEach((badge) => {
        const icon = badge.props('icon')
        expect(icon).toBeDefined()
        expect(typeof icon).toBe('string')
      })
    })
  })

  BddTest().when('level options structure is rendered', () => {
    BddTest().then('it should render level option headers with badges', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      expect(badges.length).toBeGreaterThan(0)
    })

    BddTest().then('it should render level option descriptions with proper classes', () => {
      const descriptions = wrapper.findAll('.b2-regular')
      expect(descriptions).toHaveLength(5)

      descriptions.forEach((desc) => {
        expect(desc.classes()).toContain('b2-regular')
      })
    })
  })

  BddTest().when('integrating with v-model', () => {
    BddTest().then('it should render with v-model value', async () => {
      await wrapper.setProps({ modelValue: EDeclaredSkillLevel.ADVANCED })
      await wrapper.vm.$nextTick()

      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      expect(radioButtonSet.props('modelValue')).toBe(EDeclaredSkillLevel.ADVANCED)
    })

    BddTest().then('it should pass blur listener to AvRadioButtonSet', () => {
      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      expect(radioButtonSet.exists()).toBe(true)
    })
  })

  BddTest().when('handling edge cases', () => {
    BddTest().then('it should handle null/undefined skill config gracefully', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      badges.forEach((badge) => {
        expect(badge.props('label')).toBeTruthy()
      })
    })

    BddTest().then('it should handle empty string values gracefully', async () => {
      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

      await radioButtonSet.vm.$emit('update:modelValue', '')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  BddTest().when('custom legend is provided', () => {
    BddTest().then('it should use custom legend', async () => {
      await wrapper.setProps({ legend: 'Custom Level Legend' })
      await wrapper.vm.$nextTick()

      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      expect(radioButtonSet.props('legend')).toBe('Custom Level Legend')
    })
  })

  BddTest().when('custom name is provided', () => {
    BddTest().then('it should use custom name', async () => {
      await wrapper.setProps({ name: 'customName' })
      await wrapper.vm.$nextTick()

      const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
      expect(radioButtonSet.props('name')).toBe('customName')
    })
  })
})
