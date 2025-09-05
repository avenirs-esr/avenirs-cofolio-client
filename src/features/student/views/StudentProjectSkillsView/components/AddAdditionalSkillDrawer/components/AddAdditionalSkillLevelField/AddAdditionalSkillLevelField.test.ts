import type {
  AdditionalSkillFormData
} from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/types'
import type { VueWrapper } from '@vue/test-utils'
import { EAdditionalSkillLevel } from '@/api/avenir-esr'
import { useForm } from '@tanstack/vue-form'
import { mountComponent } from 'tests/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AddAdditionalSkillLevelField from './AddAdditionalSkillLevelField.vue'

const TestWrapper = {
  components: {
    AddAdditionalSkillLevelField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        selectedSkills: [],
        level: undefined
      } as unknown as AdditionalSkillFormData,
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              selectedSkills: (!value.selectedSkills || value.selectedSkills.length === 0)
                ? 'Une compétence doit être sélectionnée'
                : undefined,
              level: !value.level ? 'Un niveau d\'auto-positionnement doit être sélectionné' : undefined
            }
          }
        }
      }
    })
    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <AddAdditionalSkillLevelField :form="form" />
    </form>
  `
}

const stubs = {
  AvRadioButtonSet: {
    name: 'AvRadioButtonSet',
    props: ['modelValue', 'legend', 'errorMessage', 'name'],
    emits: ['update:modelValue'],
    template: `
      <fieldset class="av-radio-button-set-stub">
        <legend>{{ legend }}</legend>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <slot />
      </fieldset>
    `
  },
  AvRadioButton: {
    name: 'AvRadioButton',
    props: ['value'],
    template: `
      <div class="av-radio-button-stub" :data-value="value">
        <input type="radio" :value="value" @change="$parent.$emit('update:modelValue', value)" />
        <slot />
      </div>
    `
  },
  AvBadge: {
    name: 'AvBadge',
    props: ['label', 'backgroundColor', 'color', 'iconPath'],
    template: '<div class="badge-stub" :style="{ backgroundColor, color }">{{ label }}</div>'
  }
}

describe('addAdditionalSkillLevelField', () => {
  describe('given a skill level field component', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      vi.clearAllMocks()

      wrapper = mountComponent(TestWrapper, {
        global: {
          stubs
        }
      })

      await vi.waitFor(() => {
        expect(wrapper.find('.skill-level-field').exists()).toBe(true)
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the skill level field container', () => {
        const container = wrapper.find('.skill-level-field')
        expect(container.exists()).toBe(true)
      })

      it('then it should render AvRadioButtonSet with correct props', () => {
        const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

        expect(radioButtonSet.exists()).toBe(true)
        expect(radioButtonSet.props('legend')).toBe('Auto-positionnement')
        expect(radioButtonSet.props('name')).toBe('skillLevel')
        expect(radioButtonSet.props('modelValue')).toBeUndefined()
      })

      it('then it should render all skill level radio buttons', () => {
        const radioButtons = wrapper.findAllComponents({ name: 'AvRadioButton' })

        expect(radioButtons).toHaveLength(5)
        expect(radioButtons[0].props('value')).toBe(EAdditionalSkillLevel.BEGINNER)
        expect(radioButtons[1].props('value')).toBe(EAdditionalSkillLevel.INTERMEDIATE)
        expect(radioButtons[2].props('value')).toBe(EAdditionalSkillLevel.COMPETENT)
        expect(radioButtons[3].props('value')).toBe(EAdditionalSkillLevel.ADVANCED)
        expect(radioButtons[4].props('value')).toBe(EAdditionalSkillLevel.EXPERT)
      })

      it('then it should render level options with badges and descriptions', () => {
        const levelOptions = wrapper.findAll('.level-option')
        expect(levelOptions).toHaveLength(5)

        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        expect(badges).toHaveLength(5)

        const descriptions = wrapper.findAll('.b2-regular')
        expect(descriptions).toHaveLength(5)

        expect(badges[0].props('label')).toBe('Débutant')
        expect(descriptions[0].text()).toBe('Je découvre cette compétence')
      })

      it('then it should render badges with correct colors', () => {
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

      it('then it should render badges with correct icons', () => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })

        expect(badges[0].props('iconPath')).toBeDefined()
        expect(badges[1].props('iconPath')).toBeDefined()
        expect(badges[2].props('iconPath')).toBeDefined()
        expect(badges[3].props('iconPath')).toBeDefined()
        expect(badges[4].props('iconPath')).toBeDefined()
      })
    })

    describe('when a skill level is selected', () => {
      it('then it should update the form field value for BEGINNER', async () => {
        const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

        await radioButtonSet.vm.$emit('update:modelValue', EAdditionalSkillLevel.BEGINNER)
        await wrapper.vm.$nextTick()

        expect(radioButtonSet.props('modelValue')).toBe(EAdditionalSkillLevel.BEGINNER)
      })

      it('then it should update the form field value for EXPERT', async () => {
        const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

        await radioButtonSet.vm.$emit('update:modelValue', EAdditionalSkillLevel.EXPERT)
        await wrapper.vm.$nextTick()

        expect(radioButtonSet.props('modelValue')).toBe(EAdditionalSkillLevel.EXPERT)
      })

      it('then it should handle invalid value gracefully', async () => {
        const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

        await radioButtonSet.vm.$emit('update:modelValue', 123)
        await wrapper.vm.$nextTick()

        expect(radioButtonSet.props('modelValue')).toBeUndefined()
      })

      it('then it should handle non-enum string value gracefully', async () => {
        const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

        await radioButtonSet.vm.$emit('update:modelValue', 'INVALID_LEVEL')
        await wrapper.vm.$nextTick()

        expect(radioButtonSet.props('modelValue')).toBeUndefined()
      })
    })

    describe('when the form is validated with no level selected', () => {
      it('then it should show error message', async () => {
        await wrapper.find('form').trigger('submit')

        await vi.waitFor(() => {
          const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
          expect(radioButtonSet.props('errorMessage')).toBe('Un niveau d\'auto-positionnement doit être sélectionné')
        })
      })
    })

    describe('when the form is validated with level selected', () => {
      it('then it should not show error message', async () => {
        const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

        await radioButtonSet.vm.$emit('update:modelValue', EAdditionalSkillLevel.INTERMEDIATE)
        await wrapper.vm.$nextTick()

        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const errorMessage = radioButtonSet.props('errorMessage')
          expect(errorMessage === undefined || errorMessage === '').toBe(true)
        })
      })
    })

    describe('when skill config data is available', () => {
      it('then it should display skill config labels and descriptions', () => {
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

      it('then it should handle different skill levels configuration', () => {
        const radioButtons = wrapper.findAllComponents({ name: 'AvRadioButton' })

        const expectedLevels = [
          EAdditionalSkillLevel.BEGINNER,
          EAdditionalSkillLevel.INTERMEDIATE,
          EAdditionalSkillLevel.COMPETENT,
          EAdditionalSkillLevel.ADVANCED,
          EAdditionalSkillLevel.EXPERT
        ]

        radioButtons.forEach((button, index) => {
          expect(button.props('value')).toBe(expectedLevels[index])
        })
      })
    })

    describe('when badges are configured for skill levels', () => {
      it('then it should have unique background colors for each level', () => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        const backgroundColors = badges.map(badge => badge.props('backgroundColor'))

        const uniqueColors = new Set(backgroundColors)
        expect(uniqueColors.size).toBe(5)
      })

      it('then it should have matching text colors for readability', () => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })

        badges.forEach((badge) => {
          expect(badge.props('backgroundColor')).toMatch(/var\(--light-background-/)
          expect(badge.props('color')).toMatch(/var\(--(light|dark)-(background|foreground)-/)
        })
      })

      it('then it should render with proper icon paths for each level', () => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })

        badges.forEach((badge) => {
          const iconPath = badge.props('iconPath')
          expect(iconPath).toBeDefined()
          expect(typeof iconPath).toBe('string')
        })
      })
    })

    describe('when level options structure is rendered', () => {
      it('then it should render level option headers with badges', () => {
        const levelHeaders = wrapper.findAll('.level-option__header')
        expect(levelHeaders).toHaveLength(5)

        levelHeaders.forEach((header) => {
          const badge = header.findComponent({ name: 'AvBadge' })
          expect(badge.exists()).toBe(true)
        })
      })

      it('then it should render level option descriptions with proper classes', () => {
        const descriptions = wrapper.findAll('.b2-regular')
        expect(descriptions).toHaveLength(5)

        descriptions.forEach((desc) => {
          expect(desc.classes()).toContain('b2-regular')
        })
      })
    })

    describe('when integrating with form field', () => {
      it('then it should properly integrate with TanStack Form Field', () => {
        const container = wrapper.find('.skill-level-field')
        expect(container.exists()).toBe(true)
      })

      it('then it should handle form field state changes reactively', async () => {
        const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })
        const initialValue = radioButtonSet.props('modelValue')

        await radioButtonSet.vm.$emit('update:modelValue', EAdditionalSkillLevel.ADVANCED)
        await wrapper.vm.$nextTick()

        expect(radioButtonSet.props('modelValue')).not.toBe(initialValue)
        expect(radioButtonSet.props('modelValue')).toBe(EAdditionalSkillLevel.ADVANCED)
      })
    })

    describe('when handling edge cases', () => {
      it('then it should handle null/undefined skill config gracefully', () => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        badges.forEach((badge) => {
          expect(badge.props('label')).toBeTruthy()
        })
      })

      it('then it should handle empty string values gracefully', async () => {
        const radioButtonSet = wrapper.findComponent({ name: 'AvRadioButtonSet' })

        await radioButtonSet.vm.$emit('update:modelValue', '')
        await wrapper.vm.$nextTick()

        expect(radioButtonSet.props('modelValue')).toBe(undefined)
      })
    })
  })
})
