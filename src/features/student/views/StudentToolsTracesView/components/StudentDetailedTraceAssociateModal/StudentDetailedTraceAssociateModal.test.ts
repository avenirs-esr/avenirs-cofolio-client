import type { VueWrapper } from '@vue/test-utils'
import StudentDetailedTraceAssociateModal from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceAssociateModal/StudentDetailedTraceAssociateModal.vue'
import { BddTest, mountComponent } from 'tests/utils'
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

vi.mock('@/api/avenir-esr', async () => ({ ETraceAssociationType: { SKILL_LEVEL: 'SKILL_LEVEL' } }))

vi.mock('@/store', () => ({
  useToasterStore: () => ({ addSuccessMessage: addSuccessMessageSpy }),
}))

vi.mock(
  '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceAssociateModal/components/use-associate-trace-form/use-associate-trace-form',
  () => ({
    useAssociateTraceForm: (opts: { onAssociated?: () => void }) => {
      const form = {
        handleSubmit: () => {
          handleSubmitSpy()
          opts?.onAssociated?.()
        },
        reset: resetSpy,
        useStore: (sel: any) => sel(formStoreRef),
      }
      return { form, isFormValid: isFormValidRef, isSubmitting: isSubmittingRef }
    },
  })
)

interface AvButtonProps {
  variant?: string
  theme?: string
  label?: string
  icon?: string
  size?: string
  disabled?: boolean | { value: boolean }
  isLoading?: boolean | { value: boolean }
  onClick?: () => void
}

const stubs = {
  AvModal: {
    name: 'AvModal',
    props: ['opened', 'closeButtonLabel'],
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
    props: {
      variant: { type: String, default: 'DEFAULT' },
      theme: { type: String, default: 'PRIMARY' },
      label: { type: String, default: '' },
      icon: { type: String, default: '' },
      size: { type: String, default: 'sm' },
      disabled: { type: [Boolean, Object] as any, default: false },
      isLoading: { type: [Boolean, Object] as any, default: false },
      onClick: { type: Function, default: undefined },
    },
    setup (props: AvButtonProps) {
      const toBool = (v: any) =>
        v && typeof v === 'object' && 'value' in v ? !!v.value : !!v
      const disabledBool = computed(() => toBool(props.disabled))
      const loadingBool = computed(() => toBool(props.isLoading))
      const handleClick = () => {
        if (!disabledBool.value && !loadingBool.value) {
          props.onClick?.()
        }
      }
      return { disabledBool, loadingBool, handleClick }
    },
    template: `
      <button
        class="av-button-stub"
        :disabled="disabledBool || loadingBool"
        @click="handleClick"
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
    onConfirmAssociateTrace: { type: Function, required: true },
    onClose: { type: Function, required: true },
  },
  setup () {
    const trace = { id: 't-001', title: 'Ma super trace' } as any
    const show = true
    return { trace, show }
  },
  template: `
    <StudentDetailedTraceAssociateModal
      :trace="trace"
      :show="show"
      :on-confirm-associate-trace="onConfirmAssociateTrace"
      :on-close="onClose"
    />
  `,
}

BddTest().given('StudentDetailedTraceAssociateModal', () => {
  let wrapper: VueWrapper
  const onConfirmAssociateTrace = vi.fn()
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
      props: { onConfirmAssociateTrace, onClose },
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
    BddTest().then('it renders header and trace title', () => {
      expect(wrapper.find('.av-modal-stub').exists()).toBe(true)
      expect(wrapper.text()).toContain('Ma super trace')
    })

    BddTest().then('it renders the AssociateSkillAutocompleteField', () => {
      const child = wrapper.findComponent({ name: 'AssociateSkillAutocompleteField' })
      expect(child.exists()).toBe(true)
    })
  })

  BddTest().when('footer primary button is displayed', () => {
    BddTest().then('it is enabled when form is valid and not submitting', async () => {
      isFormValidRef.value = true
      isSubmittingRef.value = false
      formStoreRef.value.values.selectedAssociation = { id: 'sl-1', title: 'OK' }
      await nextTick()
      const btn = wrapper.find('.av-button-stub')
      expect((btn.element as HTMLButtonElement).disabled).toBe(false)
    })

    BddTest().then('it becomes disabled if form invalid or submitting', async () => {
      isFormValidRef.value = false
      await nextTick()
      let btn = wrapper.find('.av-button-stub')
      expect((btn.element as HTMLButtonElement).disabled).toBe(true)

      isFormValidRef.value = true
      isSubmittingRef.value = true
      await nextTick()
      btn = wrapper.find('.av-button-stub')
      expect((btn.element as HTMLButtonElement).disabled).toBe(true)
    })
  })

  BddTest().when('clicking the primary button', () => {
    BddTest().then('it calls form.handleSubmit, triggers success pipeline and closes modal', async () => {
      isFormValidRef.value = true
      isSubmittingRef.value = false
      formStoreRef.value.values.selectedAssociation = { id: 'sl-1', title: 'OK' }
      await nextTick()

      const btn = wrapper.find('.av-button-stub')
      await btn.trigger('click')

      expect(handleSubmitSpy).toHaveBeenCalled()
      expect(addSuccessMessageSpy).toHaveBeenCalled()
      expect(resetSpy).toHaveBeenCalled()
      expect(onConfirmAssociateTrace).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
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
