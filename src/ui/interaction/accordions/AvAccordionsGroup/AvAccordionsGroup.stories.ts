import type { Meta, StoryFn } from '@storybook/vue3'
import AvAccordion from '@/ui/interaction/accordions/AvAccordion/AvAccordion.vue'
import AvAccordionsGroup from '@/ui/interaction/accordions/AvAccordionsGroup/AvAccordionsGroup.vue'

/**
 * <h2 class="n2">🌟 Introduction</h2>
 *
 * <p>
 *   <span class="b2-regular">
 *     The <code>AvAccordionsGroup</code> component implements VueDSFR <code>DsfrAccordionsGroup</code> while automatically managing
 *     the addition of <code>DsfrAccordion</code> according to the <code>AvAccordion</code> present in the <code>default</code> slot.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     Accordions allow users to show and hide sections of content presented on a page.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     The accordions group lets you group several accordions into a single coherent unit. It manages active selection logic between
 *     child accordions, allowing you to open one accordion while closing the others. This component is essential for organizing
 *     interactively linked accordion sets.
 *   </span>
 * </p>
 *
 * <p>
 *   <span class="b2-regular">
 *     🏅 Documentation on <code>DsfrAccordionsGroup</code> can be found at
 *     <a href="https://vue-ds.fr/composants/DsfrAccordionsGroup" target="_blank">VueDSFR</a>
 *   </span>
 * </p>
 *
 * <h2 class="n2">📐 Structure</h2>
 *
 * <ul class="b2-regular">
 *   <li>A header (<code>title</code> prop, type <code>string</code>) — mandatory, represents the section title.</li>
 *   <li>A left icon (<code>icon</code> prop, type <code>string</code>) — optional, must follow VICon naming convention.</li>
 *   <li>A right icon — <code>v</code> when the panel is closed, <code>^</code> when open.</li>
 *   <li>A separator.</li>
 *   <li>A content zone — hidden by default and shown when expanded, accepting any content via the default <code>slot</code>.</li>
 * </ul>
 */
const meta: Meta = {
  title: 'Components/Interaction/Accordions/AvAccordionsGroup',
  component: AvAccordionsGroup,
  tags: ['autodocs'],
}

export default meta

const Template: StoryFn = () => ({
  components: { AvAccordionsGroup, AvAccordion },
  setup () {
    return {}
  },
  template: `
    <AvAccordionsGroup>
      <AvAccordion
        title="Accordion 1"
        icon="mdi:file-document-multiple-outline"
      >
        <span>First accordion content</span>
      </AvAccordion>
      <AvAccordion
        title="Accordion 2"
        icon="mdi:plus-circle-outline"
      >
        <span>Second accordion content</span>
      </AvAccordion>
    </AvAccordionsGroup>
  `,
})

export const Default = Template.bind({})
Default.args = {}
Default.parameters = {
  docs: {
    source: {
      code: `
        <AvAccordionsGroup>
          <AvAccordion
            title="Accordion 1"
            icon="mdi:file-document-multiple-outline"
          >
            <span>First accordion content</span>
          </AvAccordion>
          <AvAccordion
            title="Accordion 2"
            icon="mdi:plus-circle-outline"
          >
            <span>Second accordion content</span>
          </AvAccordion>
        </AvAccordionsGroup>
      `
    }
  }
}
