export function useModal () {
  const showModal = ref(false)

  function displayModal () {
    showModal.value = true
  }

  function hideModal () {
    showModal.value = false
  }

  return {
    showModal,
    displayModal,
    hideModal
  }
}
