import type { PropType } from 'vue'

export const ImageUploadStub = defineComponent({
  name: 'ImageUpload',
  props: {
    modelValue: {
      type: [Object, null] as PropType<File | null>,
      required: true
    },
    defaultImageUrl: String,
    defaultImageName: String,
    imageAlt: {
      type: String,
      required: true
    },
    onDeleteImage: Function,
    onUpdate: Function,
  },
  emits: ['update:modelValue'],
  template: '<div class="image-upload" data-testid="activity-image-upload" />',
})
