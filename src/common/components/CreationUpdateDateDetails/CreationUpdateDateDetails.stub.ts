export const CreationUpdateDateDetailsStub = defineComponent({
  name: 'CreationUpdateDateDetails',
  props: {
    createdAt: {
      type: String,
      required: false
    },
    updatedAt: {
      type: String,
      required: false
    },
    createdAtPrefix: {
      type: String,
      required: false
    }
  },
  template: `
    <div class="creation-update-date-details-stub">
      <div v-if="createdAt" class="created-at">{{ createdAtPrefix }}{{ createdAt }}</div>
      <div v-if="updatedAt" class="updated-at">{{ updatedAt }}</div>
    </div>
  `
})
