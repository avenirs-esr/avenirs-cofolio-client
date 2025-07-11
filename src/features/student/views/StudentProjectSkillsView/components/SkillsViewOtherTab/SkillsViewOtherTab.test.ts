import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import SkillsViewOtherTab from './SkillsViewOtherTab.vue'

describe('skillsViewOtherTab', () => {
  describe('given a skills view other tab component', () => {
    let wrapper: ReturnType<typeof mount<typeof SkillsViewOtherTab>>

    beforeEach(() => {
      wrapper = mount<typeof SkillsViewOtherTab>(SkillsViewOtherTab, {
        global: {
          stubs: {
            AvButton: {
              template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
              emits: ['click']
            }
          }
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the main container with correct class', () => {
        const container = wrapper.find('.skills-view-other-tab')
        expect(container.exists()).toBe(true)
      })

      it('then it should render the button container with correct class', () => {
        const buttonContainer = wrapper.find('.skills-view-other-tab__button-container')
        expect(buttonContainer.exists()).toBe(true)
      })

      it('then it should render the content placeholder', () => {
        const contentPlaceholder = wrapper.find('.skills-view-other-tab__content-placeholder')
        expect(contentPlaceholder.exists()).toBe(true)
        expect(contentPlaceholder.text()).toBe('TODO #416 Placeholder...')
      })
    })

    describe('when the add skill button is rendered', () => {
      it('then it should have the correct variant and theme', () => {
        const button = wrapper.find('button')
        expect(button.exists()).toBe(true)
        expect(button.attributes('variant')).toBe('OUTLINED')
        expect(button.attributes()).toHaveProperty('variant', 'OUTLINED')
      })

      it('then it should have the correct label', () => {
        const button = wrapper.find('button')
        expect(button.attributes('label')).toBe('Ajouter une compétence')
      })

      it('then it should have the correct icon', () => {
        const button = wrapper.find('button')
        expect(button.attributes('icon')).toBe('mdi:plus-circle-outline')
      })
    })

    describe('when the add skill button is clicked', () => {
      it('then it should emit the click event', async () => {
        const button = wrapper.find('button')
        await button.trigger('click')

        expect(button.exists()).toBe(true)
      })
    })
  })
})
