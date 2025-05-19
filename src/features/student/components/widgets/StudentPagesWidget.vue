<script setup lang="ts">
import type { PageDTO } from '@/types'
import type { AvLocale } from '@/types/i18n.types'
import { useNavigation } from '@/common/composables/use-navigation'
import { formatDateToLocaleString, parseDateISO } from '@/common/utils'
import { AvButton, AvCard, AvRichButton, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { pages } = defineProps<{ pages: Array<PageDTO> }>()

const { locale, t } = useI18n()

const renderedPages = computed(() => pages.slice(0, 3))

const { navigateToStudentPages } = useNavigation()

function getFormattedUpdatedAt (page: PageDTO) {
  const parsedDate = parseDateISO(page.updatedAt)
  return formatDateToLocaleString(parsedDate, locale.value as AvLocale)
}
</script>

<template>
  <AvCard
    background-color="--white"
    title-background="--white"
  >
    <template #title>
      <div class="pages-widget-container__title">
        <VIcon
          :name="MDI_ICONS.FILE_ACCOUNT"
          color="var(--foreground-icon)"
          scale="1.5"
        />
        <span class="s1-bold">
          {{ t('student.widgets.pages.title') }}
        </span>
      </div>
    </template>
    <template #body>
      <div class="pages-widget-container__body">
        <ul class="pages-widget__actions">
          <li
            v-for="page in renderedPages"
            :key="page.id"
          >
            <AvRichButton
              :icon-right="MDI_ICONS.ARROW_RIGHT"
              custom-padding="0.5rem"
              :on-click="() => {}"
            >
              <div class="pages-widget-action__body">
                <div class="pages-widget-action__leftIcon">
                  <VIcon
                    :name="MDI_ICONS.FILE_ACCOUNT"
                    color="var(--white)"
                    scale="1.25"
                  />
                </div>
                <div class="pages-widget-action__description">
                  <span class="resume-name b1-regular">{{ page.name }}</span>
                  <span class="resume-info caption-light">
                    {{ t('student.widgets.pages.updatedAt', { date: getFormattedUpdatedAt(page) }) }}
                  </span>
                </div>
              </div>
            </AvRichButton>
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <div class="pages-widget-container__footer">
        <AvButton
          :label="t('student.widgets.pages.buttons.seeAll')"
          :on-click="navigateToStudentPages"
          :icon="MDI_ICONS.ARROW_RIGHT"
          size="sm"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.pages-widget-container__title {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  padding-left: 0.75rem;
}

.pages-widget-container__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.pages-widget__actions {
  list-style-type:none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: 1rem;
}

.pages-widget-action__leftIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: var(--dark-background-primary1);
}

.pages-widget-action__description {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.pages-widget-action__body {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.pages-widget-container__footer {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 1.25rem;
}

.resume-name,
.resume-info {
  display: block;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  width: 15rem;
}
</style>
