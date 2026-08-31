import type { ActivityDraftCreationForm } from '@/features/activities/types/forms.types'
import ActivityTitleFormField from '@/features/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import { ActivityTitleInputStub } from '@/features/activities/components/interactions/inputs/ActivityTitleInput/ActivityTitleInput.stub'
import { ACTIVITY_TITLE_MAX_LENGTH } from '@/features/activities/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: { ActivityTitleFormField },
  setup () {
    const form = useForm({
      defaultValues: { title: '' },
    }) satisfies ActivityDraftCreationForm
    return { form }
  },
  template: '<form @submit.prevent="form.handleSubmit()"><ActivityTitleFormField :form="form" /></form>',
})

BddTest().given('an ActivityTitleFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>
  let titleFormField: VueWrapper<InstanceType<typeof ActivityTitleFormField>>

  const stubs = { ActivityTitleInput: ActivityTitleInputStub }

  const getInput = () => wrapper.findComponent(ActivityTitleInputStub) as VueWrapper<InstanceType<typeof ActivityTitleInputStub>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, { global: { stubs } })
    titleFormField = wrapper.findComponent(ActivityTitleFormField)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the ActivityTitleInput', () => {
      expect(getInput().exists()).toBe(true)
    })

    BddTest().then('it should have an empty initial model value', () => {
      expect(getInput().props('modelValue')).toBe('')
    })

    BddTest().then('it should have no initial error message', () => {
      expect(getInput().props('errorMessage')).toBeFalsy()
    })
  })

  BddTest().when('the input emits a valid title', () => {
    beforeEach(async () => {
      await getInput().vm.$emit('update:modelValue', 'Mon activité nationale')
    })

    BddTest().then('it should update the model value', async () => {
      await vi.waitFor(() => expect(getInput().props('modelValue')).toBe('Mon activité nationale'))
    })

    BddTest().then('it should not show an error message', async () => {
      await vi.waitFor(() => expect(getInput().props('errorMessage')).toBeFalsy())
    })

    BddTest().then('it should emit autosave with title payload', () => {
      expect(titleFormField.emitted('autosave')).toEqual([[{ title: 'Mon activité nationale' }]])
    })
  })

  BddTest().when('the input emits an empty value', () => {
    beforeEach(async () => {
      await getInput().vm.$emit('update:modelValue', '')
    })

    BddTest().then('it should show a required error message', async () => {
      await vi.waitFor(() => expect(getInput().props('errorMessage')).toBe('Ce champ est requis.'))
    })

    BddTest().then('it should not emit autosave', () => {
      expect(titleFormField.emitted('autosave')).toBeFalsy()
    })
  })

  BddTest().when('the input emits a title exceeding the max length', () => {
    beforeEach(async () => {
      await getInput().vm.$emit('update:modelValue', 'a'.repeat(ACTIVITY_TITLE_MAX_LENGTH + 1))
    })

    BddTest().then('it should show a max length error message', async () => {
      await vi.waitFor(() => {
        expect(getInput().props('errorMessage')).toBe(`Veuillez limiter votre saisie à ${ACTIVITY_TITLE_MAX_LENGTH} caractères`)
      })
    })
  })

  BddTest().when('the input emits blur', () => {
    beforeEach(async () => {
      await getInput().vm.$emit('blur')
    })

    BddTest().then('it should propagate the blur event', () => {
      expect(getInput().emitted('blur')).toBeTruthy()
    })
  })
})
