import type { VueWrapper } from '@vue/test-utils'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect, vi } from 'vitest'
import { EActivityAssessmentStatus } from '@/api/avenir-esr'
import AssessmentStatusMultiselect from '@/features/staff/assessments/views/AssessmentsView/components/selects/AssessmentStatusMultiselect.vue'

BddTest().given('an assessment status multiselect', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentStatusMultiselect>>

  const mountWith = (selectedStatuses: string[] = []) => {
    wrapper = mount(AssessmentStatusMultiselect, {
      props: {
        modelValue: selectedStatuses,
      },
      global: {
        stubs: {
          AvSelect: AvSelectStub,
        },
      },
    })
  }

  const getAvSelect = () => wrapper.findComponent(AvSelectStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the multiselect with the assessment status options', () => {
      expect(getAvSelect().props('options')).toEqual([
        {
          value: EActivityAssessmentStatus.NEW,
          label: 'Nouvelle',
        },
        {
          value: EActivityAssessmentStatus.OPENED,
          label: 'Non traitée',
        },
        {
          value: EActivityAssessmentStatus.SENT,
          label: 'Envoyée',
        },
      ])
    })

    BddTest().then('it should expose the expected select props', () => {
      expect(getAvSelect().props()).toMatchObject({
        label: 'Filtrer par statut',
        placeholder: 'Sélectionnez un/des statut(s)',
        multiple: true,
        disabled: false,
        labelVisible: true,
        required: true,
        dense: true,
        height: '2.5rem',
        collapseMaxHeight: '35vh',
        width: 'var(--dimension-8xl)',
      })
    })

    BddTest().then('it should initialize the selected options to null', () => {
      expect(getAvSelect().props('modelValue')).toBeNull()
    })

    BddTest().and('when the user selects multiple options', () => {
      beforeEach(() => {
        getAvSelect().vm.$emit('update:modelValue', [
          { label: 'Nouvelle', value: EActivityAssessmentStatus.NEW },
          { label: 'Envoyée', value: EActivityAssessmentStatus.SENT },
        ])
      })

      BddTest().then('it should emit the selected statuses', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
            [EActivityAssessmentStatus.NEW, EActivityAssessmentStatus.SENT],
          ])
        })
      })
    })

    BddTest().and('when the user selects a single option', () => {
      beforeEach(() => {
        getAvSelect().vm.$emit('update:modelValue', {
          label: 'Ouverte',
          value: EActivityAssessmentStatus.OPENED,
        })
      })

      BddTest().then('it should emit the selected status in an array', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
            [EActivityAssessmentStatus.OPENED],
          ])
        })
      })
    })

    BddTest().and('when the user clears the selection', () => {
      beforeEach(() => {
        getAvSelect().vm.$emit('update:modelValue', [])
      })

      BddTest().then('it should emit an empty array', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
        })
      })
    })
  })
})
