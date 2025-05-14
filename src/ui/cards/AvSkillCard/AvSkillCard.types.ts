import type { SkillDTO } from '@/types'
import type { RouteLocationRaw } from 'vue-router'

export interface AvSkillCardProps {
  skill: SkillDTO
  skillColor: string
  to?: RouteLocationRaw
}
