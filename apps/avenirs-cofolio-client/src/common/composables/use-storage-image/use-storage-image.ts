import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, toValue } from 'vue'
import { useGetDefaultCoverPicture, useGetDefaultProfilePicture, useGetResourceByFileId } from '@/api/avenir-esr'

/**
 * Récupère une image du storage et l'expose sous forme d'URL d'objet (blob).
 * Si aucun `fileId` n'est fourni, l'image par défaut correspondant à `defaultPicture` est utilisée.
 * L'URL d'objet précédente est révoquée à chaque changement et au démontage du composant.
 *
 * @param fileId - Identifiant du fichier (valeur, ref ou getter).
 * @param defaultPicture - Type d'image par défaut à charger quand `fileId` est absent.
 * @returns `url` : URL d'objet de l'image, `undefined` tant qu'aucune image n'est disponible.
 */
export function useStorageImage (fileId: MaybeRefOrGetter<string | undefined>, defaultPicture?: 'profile' | 'cover') {
  const hasFile = computed(() => !!toValue(fileId))
  const isDefaultEnabled = (kind: 'profile' | 'cover') => computed(() => !hasFile.value && defaultPicture === kind)

  const { data: file } = useGetResourceByFileId(() => toValue(fileId) ?? '', { query: { enabled: hasFile } })
  const { data: defaultProfile } = useGetDefaultProfilePicture({ query: { enabled: isDefaultEnabled('profile') } })
  const { data: defaultCover } = useGetDefaultCoverPicture({ query: { enabled: isDefaultEnabled('cover') } })

  const blob = computed(() => file.value ?? (defaultPicture === 'profile' ? defaultProfile.value : defaultCover.value))
  const url = ref<string>()

  const revoke = () => url.value && URL.revokeObjectURL(url.value)

  watch(blob, (newBlob) => {
    revoke()
    url.value = newBlob ? URL.createObjectURL(newBlob) : undefined
  }, { immediate: true })

  onBeforeUnmount(revoke)

  return { url }
}
