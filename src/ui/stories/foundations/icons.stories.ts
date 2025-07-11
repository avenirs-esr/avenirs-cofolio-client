import type { Meta, StoryFn } from '@storybook/vue3'
import { AvVIcon } from '@/ui/base'
import { MDI_ICONS, RI_ICONS } from '@/ui/tokens'

const meta: Meta = {
  title: 'Foundations/3. DSAV icons',
}

export default meta

export const AllIcons: StoryFn = () => ({
  components: { AvVIcon },
  setup () {
    const mdiIcons = Object.entries(MDI_ICONS).map(([key, icon]) => [`MDI_ICONS.${key}`, icon])
    const riIcons = Object.entries(RI_ICONS).map(([key, icon]) => [`RI_ICONS.${key}`, icon])
    const icons = [...mdiIcons, ...riIcons]
    return { icons }
  },
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
      <div 
        v-for="[key, icon] in icons" 
        :key="key" 
        style="display: flex; flex-direction: column; align-items: center; width: 10rem; word-break: break-word; text-align: center;"
      >
        <AvVIcon :name="icon" size="2" color="var(--icon)" />
        <span style="font-size: 0.75rem; text-align: center;">{{ key }}</span>
      </div>
    </div>
  `,
})

export const MdiIcons: StoryFn = () => ({
  components: { AvVIcon },
  setup () {
    return { icons: Object.entries(MDI_ICONS).map(([key, icon]) => [`MDI_ICONS.${key}`, icon]) }
  },
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
      <div 
        v-for="[key, icon] in icons" 
        :key="key" 
        style="display: flex; flex-direction: column; align-items: center; width: 10rem; word-break: break-word; text-align: center;"
      >
        <AvVIcon :name="icon" size="2" color="var(--icon)" />
        <span style="font-size: 0.75rem; text-align: center;">{{ key }}</span>
      </div>
    </div>
  `,
})

export const RiIcons: StoryFn = () => ({
  components: { AvVIcon },
  setup () {
    return { icons: Object.entries(RI_ICONS).map(([key, icon]) => [`RI_ICONS.${key}`, icon]) }
  },
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
      <div 
        v-for="[key, icon] in icons" 
        :key="key" 
        style="display: flex; flex-direction: column; align-items: center; width: 10rem; word-break: break-word; text-align: center;"
      >
        <AvVIcon :name="icon" size="2" color="var(--icon)" />
        <span style="font-size: 0.75rem; text-align: center;">{{ key }}</span>
      </div>
    </div>
  `,
})
