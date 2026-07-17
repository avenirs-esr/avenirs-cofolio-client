import type { FileDTO } from '@/api/avenir-esr'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { ImageUploadStub } from '@/common/components/ImageUpload/ImageUploadStub'
import ActivityBannerFormField from '@/features/staff/activities/components/interactions/formFields/ActivityBannerFormField/ActivityBannerFormField.vue'
import { EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const props = {
  modelValue: null,
  remoteBanner: { url: '/test/banner.jpg', fileName: 'banner.jpg' } as FileDTO
}

const TestWrapper = createFormFieldTestWrapper<EditActivityFormData, 'bannerAction'>({
  formFieldComponent: ActivityBannerFormField,
  fieldName: 'bannerAction',
  defaultValue: EditActivityFormDataBannerAction.NONE,
  extraProps: props
})

BddTest().given('an ActivityBannerFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    ImageUpload: ImageUploadStub,
  }

  const getFieldValue = () => wrapper.vm.form.state.values.bannerAction

  const getImageUpload = () => wrapper.findComponent(ImageUploadStub)

  const getBannerFormField = () => wrapper.findComponent(ActivityBannerFormField)

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should have an empty initial model value', () => {
      expect(getImageUpload().props('modelValue')).toBeNull()
    })

    BddTest().then('it should render the ImageUpload component', () => {
      expect(getImageUpload().exists()).toBe(true)
    })

    BddTest().then('it should pass the remote banner as default image', () => {
      expect(getFieldValue()).toBe(EditActivityFormDataBannerAction.NONE)
      expect(getImageUpload().props('defaultImageUrl')).toBe(props.remoteBanner.url)
      expect(getImageUpload().props('defaultImageName')).toBe(props.remoteBanner.fileName)
    })
  })

  BddTest().when('the modelValue changes and is non-null', () => {
    const file = new File(['banner'], 'banner.jpg', { type: 'image/jpeg' })

    beforeEach(async () => {
      const onUpdate = getImageUpload().props('onUpdate') as (file: File) => void
      onUpdate(file)
    })

    BddTest().then('it should update the field value to UPDATE and emit autosave', () => {
      expect(getFieldValue()).toBe(EditActivityFormDataBannerAction.UPDATE)
      expect(getBannerFormField().emitted('autosave')).toEqual([[]])
    })

    BddTest().then('it should no longer pass the remote banner as default image', () => {
      expect(getImageUpload().props('defaultImageUrl')).toBeUndefined()
      expect(getImageUpload().props('defaultImageName')).toBeUndefined()
    })
  })

  BddTest().when('the modelValue changes and is null', () => {
    beforeEach(async () => {
      const onDeleteImage = getImageUpload().props('onDeleteImage') as () => void
      onDeleteImage()
    })

    BddTest().then('it should update the field value to DELETE and emit autosave', () => {
      expect(getFieldValue()).toBe(EditActivityFormDataBannerAction.DELETE)
      expect(getBannerFormField().emitted('autosave')).toEqual([[]])
    })

    BddTest().then('it should no longer pass the remote banner as default image', () => {
      expect(getImageUpload().props('defaultImageUrl')).toBeUndefined()
      expect(getImageUpload().props('defaultImageName')).toBeUndefined()
    })
  })
})
