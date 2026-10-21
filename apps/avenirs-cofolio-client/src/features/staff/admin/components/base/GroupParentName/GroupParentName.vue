<script lang="ts" setup>
import type { GroupDTO, GroupOverviewDTO } from '@/api/avenir-esr'
import { AvIcon, AvTooltip, MDI_ICONS, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { ROUTES } from '@/common/constants'

export interface GroupParentNameProps {
  group: GroupDTO | GroupOverviewDTO
  withNav?: boolean
}

const { group, withNav = false } = defineProps<GroupParentNameProps>()

const parentNameRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(parentNameRef)

const to = computed(() => ({
  name: ROUTES.STAFF.ADMIN.GROUP.DEFAULT.name,
  params: { id: group.parent?.id ?? '' }
}))

const routerProps = computed(() => withNav
  ? {
      to: to.value,
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  : {})
</script>

<template>
  <div
    v-if="group.parent"
    class="group-parent-name av-col av-gap-xs"
    data-testid="group-parent-name"
    :data-group-id="group.parent.id"
  >
    <AvTooltip
      :disabled="!isTruncated"
      :content="group.parent.name"
    >
      <component
        :is="withNav ? 'RouterLink' : 'div'"
        v-bind="routerProps"
        class="name av-row av-gap-xxs"
        :class="{ 'name--hoverable': withNav }"
        data-testid="group-name"
        :data-group-id="group.id"
      >
        <span
          ref="parentNameRef"
          class="av-max-lines b2-regular av-text-text1"
          data-testid="parent-name"
        >
          {{ group.parent.name }}
        </span>
        <AvIcon
          v-if="withNav"
          :name="MDI_ICONS.EXTERNAL_LINK"
        />
      </component>
    </AvTooltip>
  </div>
</template>

<style lang="scss" scoped>
.group-parent-name {
  --max-lines: 2;

  :deep(.name--hoverable:hover) > * {
    color: var(--light-foreground-primary2);
    text-decoration: underline;
  }
}
</style>
