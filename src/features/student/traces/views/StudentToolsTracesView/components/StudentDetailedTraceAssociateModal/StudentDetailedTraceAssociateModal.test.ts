import type { VueWrapper } from '@vue/test-utils'
import StudentDetailedTraceAssociateModal from '@/features/student/traces/views/StudentToolsTracesView/components/StudentDetailedTraceAssociateModal/StudentDetailedTraceAssociateModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const addSuccessMessageSpy = vi.fn()
const resetSpy = vi.fn()
const handleSubmitSpy = vi.fn()
const isFormValidRef = { value: true }
const isSubmittingRef = { value: false }
const formStoreRef = ref({
  isValid: true,
  isValidating: false,
  isDirty: false,
  values: { selectedAssociation: null as null | { id: string, title: string } },
})

vi.mock('@/store', () => ({
  useToasterStore: () => ({ addSuccessMessage: addSuccessMessageSpy }),
}))

vi.mock(
  '@/features/student/traces/views/StudentToolsTracesView/components/StudentDetailedTraceAssociateModal/components/use-associate-trace-form/use-associate-trace-form',
  () => ({
    useAssociateTraceForm: (opts: { onAssociated?: () => void }) => {
      const form = {
        handleSubmit: () => {
          handleSubmitSpy()
          opts?.onAssociated?.()
        },
        reset: resetSpy,
        useStore: (sel: (s: typeof formStoreRef) => typeof formStoreRef) => sel(formStoreRef)
      }
      return { form, isFormValid: isFormValidRef, isSubmitting: isSubmittingRef }
    },
  })
)

const stubs = {
  AvModal: {
    name: 'AvModal',
    props: ['opened', 'closeButtonLabel', 'confirmButtonLabel', 'confirmButtonDisabled', 'isLoading'],
    emits: ['close'],
    template: `
      <div class="av-modal-stub">
        <button class="close-btn" @click="$emit('close')">X</button>
        <slot name="header" />
        <slot />
        <slot name="footer" />
      </div>
    `,
  },
  AvButton: {
    name: 'AvButton',
    props: ['variant', 'theme', 'label', 'icon', 'size', 'disabled', 'isLoading', 'onClick'],
    template: `
      <button
        class="av-button-stub"
        :disabled="(disabled && (disabled.value ?? disabled)) || (isLoading && (isLoading.value ?? isLoading))"
        @click="!((disabled && (disabled.value ?? disabled)) || (isLoading && (isLoading.value ?? isLoading))) && onClick && onClick()"
      >
        {{ label }}
      </button>
    `,
  },
  AvListItem: { name: 'AvListItem', template: '<div class="av-listitem-stub"><slot/></div>' },
  AssociateSkillAutocompleteField: {
    name: 'AssociateSkillAutocompleteField',
    props: ['form', 'fieldName', 'associationType'],
    template: '<div class="associate-skill-autocomplete-field-stub"></div>',
  },
}

const TestHost = {
  components: { StudentDetailedTraceAssociateModal },
  props: {
    onClose: { type: Function, required: true },
  },
  setup () {
    const trace = { id: 't-001', title: 'Ma super trace' }
    const show = true
    return { trace, show }
  },
  template: `
    <StudentDetailedTraceAssociateModal
      :trace="trace"
      :show="show"
      :on-close="onClose"
    />
  `,
}

BddTest().given('StudentDetailedTraceAssociateModal', () => {
  let wrapper: VueWrapper
  const onClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    isFormValidRef.value = true
    isSubmittingRef.value = false
    formStoreRef.value = {
      isValid: true,
      isValidating: false,
      isDirty: false,
      values: { selectedAssociation: null },
    }

    wrapper = mountComponent(TestHost, {
      props: { onClose },
      global: { stubs },
      useI18n: true,
      useTanstack: true,
      usePinia: true,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the modal is opened', () => {
    BddTest().then('it should render header and trace title', () => {
      expect(wrapper.find('.av-modal-stub').exists()).toBe(true)
      expect(wrapper.text()).toContain('Ma super trace')
    })

    BddTest().then('it should render the AssociateSkillAutocompleteField', () => {
      const child = wrapper.findComponent({ name: 'AssociateSkillAutocompleteField' })
      expect(child.exists()).toBe(true)
    })
  })

  BddTest().when('the submit button is displayed', () => {
    BddTest().and('form is valid and not submitting', async () => {
      BddTest().then('the submit button should be enabled', async () => {
        isFormValidRef.value = true
        isSubmittingRef.value = false
        formStoreRef.value.values.selectedAssociation = { id: 'sl-1', title: 'OK' }
        await nextTick()
        expect(wrapper.findComponent({ name: 'AvModal' }).props('confirmButtonDisabled')).toBe(false)
      })
    })

    BddTest().and('it becomes disabled if form invalid or submitting', () => {
      BddTest().then('the submit button should be disabled', async () => {
        isFormValidRef.value = false
        await nextTick()
        expect(wrapper.findComponent({ name: 'AvModal' }).props('isLoading').value).toBe(false)

        isFormValidRef.value = true
        isSubmittingRef.value = true
        await nextTick()
        expect(wrapper.findComponent({ name: 'AvModal' }).props('isLoading').value).toBe(true)
      })
    })
  })

  BddTest().when('clicking on the submit button', () => {
    BddTest().and('it calls form.handleSubmit', async () => {
      BddTest().then('the form should be submitted and modal closed', async () => {
        isFormValidRef.value = true
        isSubmittingRef.value = false
        formStoreRef.value.values.selectedAssociation = { id: 'sl-1', title: 'OK' }
        await nextTick()

        await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')

        expect(handleSubmitSpy).toHaveBeenCalled()
        expect(addSuccessMessageSpy).toHaveBeenCalled()
        expect(resetSpy).toHaveBeenCalled()
        expect(onClose).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('clicking the modal close button', () => {
    BddTest().then('it calls onClose', async () => {
      const closeBtn = wrapper.find('.close-btn')
      await closeBtn.trigger('click')
      expect(onClose).toHaveBeenCalled()
    })
  })
})
