import type { SkillDTO } from '@/types'
import type { RouteLocationRaw } from 'vue-router'

export interface StudentSkillCardProps {
  skill: SkillDTO
  skillColor: string
  to?: RouteLocationRaw
}
