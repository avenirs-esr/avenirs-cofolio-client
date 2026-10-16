<script lang="ts" setup>
import type { GroupOverviewDTO } from '@/api/avenir-esr'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { ROUTES } from '@/common/constants'

export interface GroupsListNameProps {
  group: GroupOverviewDTO
}

const { group } = defineProps<GroupsListNameProps>()

const nameRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(nameRef)

const to = computed(() => ({
  name: ROUTES.STAFF.ADMIN.GROUP.name,
  params: { id: group.id }
}))
</script>

<template>
  <div
    class="group-list-table-name av-col av-gap-xs"
    data-testid="group-list-table-name"
    :data-group-id="group.id"
  >
    <AvTooltip
      :disabled="!isTruncated"
      :content="group.name"
    >
      <RouterLink
        :to
        class="name"
        data-testid="group-list-table-name-link"
        :data-group-id="group.id"
      >
        <span
          ref="nameRef"
          class="av-max-lines b1-bold av-text-text1"
        >
          {{ group.name }}
        </span>
      </RouterLink>
    </AvTooltip>
  </div>
</template>

<style lang="scss" scoped>
.group-list-table-name {
  --max-lines: 2;

  .name:hover > * {
    color: var(--light-foreground-primary2);
    text-decoration: underline;
  }
}
</style>
