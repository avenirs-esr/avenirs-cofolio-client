import type { StudentFeatures } from '@/types'
import { useStudentFeaturesQuery } from '@/features/student/queries'

export function useStudentFeatures () {
  const { data: studentFeatures } = useStudentFeaturesQuery()

  const hasFeature = (feature: StudentFeatures) =>
    computed(() => studentFeatures.value?.includes(feature) ?? false)

  return {
    hasFeature,
    allFeatures: studentFeatures,
  }
}
