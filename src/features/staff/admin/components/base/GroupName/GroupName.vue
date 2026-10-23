<script lang="ts" setup>
import type { GroupDTO, GroupOverviewDTO } from '@/api/avenir-esr'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { ROUTES } from '@/common/constants'

export interface GroupNameProps {
  group: GroupDTO | GroupOverviewDTO
  withNav?: boolean
}

const { group, withNav = false } = defineProps<GroupNameProps>()

const nameRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(nameRef)

const to = computed(() => ({
  name: ROUTES.STAFF.ADMIN.GROUP.DEFAULT.name,
  params: { id: group.id }
}))

const routerProps = computed(() => withNav ? { to: to.value } : {})
</script>

<template>
  <div
    class="group-name av-col av-gap-xs"
    data-testid="group-name"
    :data-group-id="group.id"
  >
    <AvTooltip
      :disabled="!isTruncated"
      :content="group.name"
    >
      <component
        :is="withNav ? 'RouterLink' : 'div'"
        v-bind="routerProps"
        class="name"
        :class="{ 'name--hoverable': withNav }"
        data-testid="group-name-content"
        :data-group-id="group.id"
      >
        <span
          ref="nameRef"
          class="av-max-lines b1-bold av-text-text1"
        >
          {{ group.name }}
        </span>
      </component>
    </AvTooltip>
  </div>
</template>

<style lang="scss" scoped>
.group-name {
  --max-lines: 2;

  .name--hoverable:hover > * {
    color: var(--light-foreground-primary2);
    text-decoration: underline;
  }
}
</style>
