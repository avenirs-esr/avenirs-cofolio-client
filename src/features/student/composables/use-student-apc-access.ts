import { useStudentNavigationAccessControlQuery } from '@/features/student/queries'

function useStudentApcAccess () {
  const { data } = useStudentNavigationAccessControlQuery()

  const isApcVisible = computed(() => {
    return data.value?.APC?.enabledByInstitution === true
  })

  const showApcGenericInfoPage = computed(() => {
    return (
      data.value?.APC?.enabledByInstitution === true
      && data.value?.APC.hasProgram === false
    )
  })

  const showApcSubmenus = computed(() => {
    return (
      data.value?.APC?.enabledByInstitution === true
      && data.value?.APC.hasProgram === true
    )
  })

  return {
    isApcVisible,
    showApcGenericInfoPage,
    showApcSubmenus,
  }
}

export { useStudentApcAccess }
