export const RatingStub = defineComponent({
  name: 'Rating',
  template: `
    <div class="rating">
      <span class="rating__value">{{ rating }}/{{ maxRating }}</span>
    </div>
  `,
  props: ['rating', 'maxRating']
})
