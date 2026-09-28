<script lang="ts" setup>
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useTutorial } from '@/common/components/overlay/tooltips/Tutorial/use-tutorial'
import { useModal } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { CUIDA_ICONS, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { type Config, driver } from 'driver.js'
import { useI18n } from 'vue-i18n'
import 'driver.js/dist/driver.css'

const { t } = useI18n()
const route = useRoute()
const { modalOpened, openModal, closeModal } = useModal()
const { markTutorialAsSeen, hasSeenTutorial, replayRequested } = useTutorial()

const commonDriverProps: Partial<Config> = {
  allowClose: false,
  disableActiveInteraction: true,
  nextBtnText: t('global.buttons.next'),
  prevBtnText: t('global.buttons.previous'),
  doneBtnText: t('global.buttons.close'),
  onDestroyed: () => {
    skipTutorial()
  }
}

const staffDriverObj = driver({
  ...commonDriverProps,
  steps: [
    {
      element: '#update-profile-button',
      popover: {
        title: t('global.overlay.Tutorial.staff.update-profile-button.title'),
        description: t('global.overlay.Tutorial.staff.update-profile-button.description')
      }
    },
    {
      element: '#feedbacks-widget',
      popover: {
        title: t('global.overlay.Tutorial.staff.feedbacks-widget.title'),
        description: t('global.overlay.Tutorial.staff.feedbacks-widget.description')
      }
    },
    {
      element: '#draft-activities-widget',
      popover: {
        title: t('global.overlay.Tutorial.staff.draft-activities-widget.title'),
        description: t('global.overlay.Tutorial.staff.draft-activities-widget.description')
      }
    },
    {
      element: '#published-activities-widget',
      popover: {
        title: t('global.overlay.Tutorial.staff.published-activities-widget.title'),
        description: t('global.overlay.Tutorial.staff.published-activities-widget.description')
      }
    },
    {
      element: '#nav-activities',
      popover: {
        title: t('global.overlay.Tutorial.staff.nav-activities.title'),
        description: t('global.overlay.Tutorial.staff.nav-activities.description')
      }
    },
    {
      element: '#trigger-nav-student-tracking-menu',
      popover: {
        title: t('global.overlay.Tutorial.staff.trigger-nav-student-tracking-menu.title'),
        description: t('global.overlay.Tutorial.staff.trigger-nav-student-tracking-menu.description')
      }
    },
    {
      element: '#notifications-popover',
      popover: {
        title: t('global.overlay.Tutorial.staff.notifications-popover.title'),
        description: t('global.overlay.Tutorial.staff.notifications-popover.description')
      }
    },
    {
      element: '#profile-dropdown',
      popover: {
        title: t('global.overlay.Tutorial.common.profile-dropdown.title'),
        description: t('global.overlay.Tutorial.common.profile-dropdown.description')
      }
    },
    {
      element: '#language-selector',
      popover: {
        title: t('global.overlay.Tutorial.common.language-selector.title'),
        description: t('global.overlay.Tutorial.common.language-selector.description')
      }
    },
  ]
})

const studentDriverObj = driver({
  ...commonDriverProps,
  steps: [
    {
      element: '#update-profile-button',
      popover: {
        title: t('global.overlay.Tutorial.student.update-profile-button.title'),
        description: t('global.overlay.Tutorial.student.update-profile-button.description')
      }
    },
    {
      element: '#library-activities-widget',
      popover: {
        title: t('global.overlay.Tutorial.student.library-activities-widget.title'),
        description: t('global.overlay.Tutorial.student.library-activities-widget.description')
      }
    },
    {
      element: '#library-activities-widget #see-all-button',
      popover: {
        title: t('global.overlay.Tutorial.student.library-activities-widget-see-all-button.title'),
        description: t('global.overlay.Tutorial.student.library-activities-widget-see-all-button.description')
      }
    },
    {
      element: '#new-activities-widget',
      popover: {
        title: t('global.overlay.Tutorial.student.new-activities-widget.title'),
        description: t('global.overlay.Tutorial.student.new-activities-widget.description')
      }
    },
    {
      element: '#traces-widget',
      popover: {
        title: t('global.overlay.Tutorial.student.traces-widget.title'),
        description: t('global.overlay.Tutorial.student.traces-widget.description')
      }
    },
    {
      element: '#nav-activities',
      popover: {
        title: t('global.overlay.Tutorial.student.nav-activities.title'),
        description: t('global.overlay.Tutorial.student.nav-activities.description')
      }
    },
    {
      element: '#nav-skills',
      popover: {
        title: t('global.overlay.Tutorial.student.nav-skills.title'),
        description: t('global.overlay.Tutorial.student.nav-skills.description')
      },
    },
    {
      element: '#trigger-nav-life-project-menu',
      popover: {
        title: t('global.overlay.Tutorial.student.trigger-nav-life-project-menu.title'),
        description: t('global.overlay.Tutorial.student.trigger-nav-life-project-menu.description')
      }
    },
    {
      element: '#trigger-nav-tools-menu',
      popover: {
        title: t('global.overlay.Tutorial.student.trigger-nav-tools-menu.title'),
        description: t('global.overlay.Tutorial.student.trigger-nav-tools-menu.description')
      }
    },
    {
      element: '#notifications-popover',
      popover: {
        title: t('global.overlay.Tutorial.student.notifications-popover.title'),
        description: t('global.overlay.Tutorial.student.notifications-popover.description')
      }
    },
    {
      element: '#profile-dropdown',
      popover: {
        title: t('global.overlay.Tutorial.common.profile-dropdown.title'),
        description: t('global.overlay.Tutorial.common.profile-dropdown.description')
      }
    },
    {
      element: '#language-selector',
      popover: {
        title: t('global.overlay.Tutorial.common.language-selector.title'),
        description: t('global.overlay.Tutorial.common.language-selector.description')
      }
    },
    {
      element: '#new-activities-widget',
      popover: {
        title: t('global.overlay.Tutorial.student.startTutoActivity.title'),
        description: t('global.overlay.Tutorial.student.startTutoActivity.description')
      }
    }
  ]
})

const driverObj = computed(() => route.name === ROUTES.STAFF.HOME.name ? staffDriverObj : studentDriverObj)

function startTutorial () {
  closeModal()
  driverObj.value.drive()
}

function skipTutorial () {
  markTutorialAsSeen()
  closeModal()
}

watch(hasSeenTutorial, (newValue) => {
  if (!newValue) {
    openModal()
  }
}, { immediate: true })

watch(replayRequested, (requested) => {
  if (requested) {
    openModal()
    replayRequested.value = false
  }
})
</script>

<template>
  <ConfirmationModal
    :opened="modalOpened"
    :aria-label="t('global.overlay.Tutorial.modal.title')"
    :title="t('global.overlay.Tutorial.modal.title')"
    :description="t('global.overlay.Tutorial.modal.description')"
    :close-button-label="t('global.overlay.Tutorial.modal.cancel')"
    :confirm-button-label="t('global.overlay.Tutorial.modal.confirm')"
    :close-button-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
    :confirm-button-icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
    @close="skipTutorial"
    @confirm="startTutorial"
  />
</template>

<style lang="scss">
.driver-popover {
  background: var(--light-background-primary1);
  color: var(--dark-background-primary1);

  .driver-popover-arrow {
    border-top-color: var(--light-background-primary1) !important;
    border-right-color: var(--light-background-primary1) !important;
    border-bottom-color: var(--light-background-primary1) !important;
    border-left-color: var(--light-background-primary1) !important;

    &-side {
      &-top {
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        border-left-color: transparent !important;
      }
      &-right {
        border-top-color: transparent !important;
        border-bottom-color: transparent !important;
        border-left-color: transparent !important;
      }
      &-bottom {
        border-top-color: transparent !important;
        border-right-color: transparent !important;
        border-left-color: transparent !important;
      }
      &-left {
        border-top-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
      }
    }
  }
}
</style>
