import type { ProBasedExperienceType } from '@/features/student/global/types/experiences.types'
import ExperienceTypeMultiselect from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/ExperienceTypeMultiselect/ExperienceTypeMultiselect.vue'
import { AvMultiselectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const route = reactive<{ query: { type: ProBasedExperienceType } | undefined }>({
  query: undefined,
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => route,
  }
})

vi.mock('@/common/composables', () => ({
  useWatchQueryParam: vi.fn()
}))

BddTest().given('a ExperienceTypeMultiselect component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ExperienceTypeMultiselect>>

  const stubs = { AvMultiselect: AvMultiselectStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(ExperienceTypeMultiselect, { global: { stubs } })
    })

    BddTest().then('it should render the multiselect with the correct options', () => {
      const options = wrapper.findAll('option')
      expect(options).toHaveLength(3)
      expect(options[0].text()).toBe('Expérience professionnelle')
      expect(options[1].text()).toBe('Expérience personnelle')
      expect(options[2].text()).toBe('Engagement et/ou bénévolat')
    })

    BddTest().and('when the user selects some options', () => {
      beforeEach(async () => {
        const select = wrapper.find('select')
        await select.setValue(['PROFESSIONAL', 'PERSONAL', 'VOLUNTEER'])
      })

      BddTest().then('it should emit the correct modelValue', () => {
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        const emittedValue = wrapper.emitted('update:modelValue')![0][0]
        expect(emittedValue).toEqual([
          { label: 'Expérience professionnelle', value: 'PROFESSIONAL' },
          { label: 'Expérience personnelle', value: 'PERSONAL' },
          { label: 'Engagement et/ou bénévolat', value: 'VOLUNTEER' }
        ])
      })
    })
  })
})
