<script lang="ts" setup>
import { AvIcon, AvTooltip, MDI_ICONS, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { EActivityStatus, EAuthorizationEntityType } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'

export interface AuthorizationEntityNameProps {
  entity: { id: string, name: string, type: EAuthorizationEntityType }
  withNav?: boolean
}

const { entity, withNav = false } = defineProps<AuthorizationEntityNameProps>()

const nameRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(nameRef)

const params = computed(() => {
  const id = entity.id

  switch (entity.type) {
    case EAuthorizationEntityType.ACTIVITY:
      return { id, status: EActivityStatus.PUBLISHED }
    case EAuthorizationEntityType.ACTIVITY_DRAFT:
    default:
      return { id, status: EActivityStatus.DRAFT }
  }
})

const to = computed(() => ({
  name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
  params: params.value
}))

const routerProps = computed(() => withNav
  ? { to: to.value, target: '_blank', rel: 'noopener noreferrer' }
  : {})
</script>

<template>
  <div
    class="authorization-entity-name av-col av-gap-xs"
    data-testid="entity-name"
    :data-entity-id="entity.id"
  >
    <AvTooltip
      :disabled="!isTruncated"
      :content="entity.name"
    >
      <component
        :is="withNav ? 'RouterLink' : 'div'"
        v-bind="routerProps"
        class="name av-row av-gap-xxs"
        :class="{ 'name--hoverable': withNav }"
        data-testid="entity-name-content"
        :data-entity-id="entity.id"
      >
        <span
          ref="nameRef"
          class="av-max-lines b1-bold av-text-text1"
        >
          {{ entity.name }}
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
.authorization-entity-name {
  --max-lines: 2;

  .name--hoverable:hover > * {
    color: var(--light-foreground-primary2);
    text-decoration: underline;
  }
}
</style>
