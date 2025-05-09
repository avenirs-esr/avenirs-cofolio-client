<script setup lang="ts">
import type { AvRoute } from '@/common/types/router.types'
import {
  studentEducationActivitiesRoute,
  studentEducationSkillsRoute,
  studentHomeRoute,
  studentProjectExperiencesRoute,
  studentProjectSkillsRoute,
  studentProjectTrajectoriesRoute,
  studentToolsPagesRoute,
  studentToolsResumesRoute,
  studentToolsTracksRoute
} from '@/features/student'
import { AvNavigation, MDI_ICONS } from '@/ui'

import { useId } from 'vue'

const route = useRoute()

function isRouteActive (routes: AvRoute[]): boolean {
  return routes.some(avRoute => avRoute.name === route.name)
}

const navItems = [
  {
    id: useId(),
    to: studentHomeRoute,
    text: 'ACCUEIL',
    icon: MDI_ICONS.HOME_VARIANT,
  },
  {
    title: 'RÉUSSIR MA FORMATION',
    get active () {
      return isRouteActive([studentEducationSkillsRoute, studentEducationActivitiesRoute])
    },
    links: [
      { to: studentEducationSkillsRoute, text: 'Mes compétences', icon: MDI_ICONS.STAR_SHOOTING },
      { to: studentEducationActivitiesRoute, text: 'Mes activités de mise en situation', icon: MDI_ICONS.GRADUATION_CAP },
    ],
  },
  {
    title: 'CONSTRUIRE MON PROJET DE VIE',
    get active () {
      return isRouteActive([studentProjectSkillsRoute, studentProjectExperiencesRoute, studentProjectTrajectoriesRoute])
    },
    links: [
      {
        to: studentProjectSkillsRoute,
        text: 'Toutes mes compétences',
        icon: MDI_ICONS.STARS,
      },
      {
        to: studentProjectExperiencesRoute,
        text: 'Mon parcours',
        icon: MDI_ICONS.BRIEFCASE_VARIANT,
      },
      { to: studentProjectTrajectoriesRoute, text: 'Bâtir mon projet', icon: MDI_ICONS.ARROW_DECISION },
    ],
  },
  {
    title: 'MES OUTILS',
    get active () {
      return isRouteActive([studentToolsTracksRoute, studentToolsPagesRoute, studentToolsResumesRoute])
    },
    links: [
      { to: studentToolsTracksRoute, text: 'Mes traces', icon: MDI_ICONS.ATTACH_FILE },
      { to: studentToolsPagesRoute, text: 'Mes pages libres', icon: MDI_ICONS.POST_IT_NOTES },
      { to: studentToolsResumesRoute, text: 'Mes CV', icon: MDI_ICONS.FILE_ACCOUNT },
    ],
  },
]
</script>

<template>
  <AvNavigation :nav-items="navItems" />
</template>

<style lang="scss" scoped>
</style>
