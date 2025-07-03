import type { Meta, StoryFn } from '@storybook/vue3'

const meta: Meta = {
  title: 'Foundations/1. Typography',
  argTypes: {},
}

export default meta

export const Titles: StoryFn = () => ({
  template: `
    <div style="padding: 1rem; display: flex; flex-direction: column; flex: 1;">
      <h1 class="n1">Headline Style 1 (n1)</h1>
      <h2 class="n2">Headline Style 2 (n2)</h2>
      <h3 class="n3">Headline Style 3 (n3)</h3>
      <h4 class="n4">Headline Style 4 (n4)</h4>
      <h5 class="n5">Headline Style 5 (n5)</h5>
      <h6 class="n6">Headline Style 6 (n6)</h6>
    </div>
  `,
})

export const Texts: StoryFn = () => ({
  template: `
    <div style="padding: 1rem; display: flex; flex-direction: column; flex: 1;">
      <span class="s1-light">Subtitle Style 1 (s1-light)</span>
      <span class="s1-regular">Subtitle Style 1 (s1-regular)</span>
      <span class="s1-bold">Subtitle Style 1 (s1-bold)</span>
      <span class="s2-light">Subtitle Style 2 (s2-light)</span>
      <span class="s2-regular">Subtitle Style 2 (s2-regular)</span>
      <span class="s2-bold">Subtitle Style 2 (s2-bold)</span>
      <span class="b1-light">Body Style 1 (b1-light)</span>
      <span class="b1-regular">Body Style 1 (b1-regular)</span>
      <span class="b1-bold">Body Style 1 (b1-bold)</span>
      <span class="b2-light">Body Style 2 (b2-light)</span>
      <span class="b2-regular">Body Style 2 (b2-regular)</span>
      <span class="b2-bold">Body Style 2 (b2-bold)</span>
      <span class="caption-light">Caption Style (caption-light)</span>
      <span class="caption-regular">Caption Style (caption-regular)</span>
      <span class="caption-bold">Caption Style (caption-bold)</span>
    </div>
  `,
})
