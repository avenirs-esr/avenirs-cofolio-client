import { capitalize } from 'lodash-es'

/**
 * Converts the first and last names into a full name with capitalized words.
 * @param firstName The first name of the user
 * @param lastName The last name of the user
 * @returns The full name of the user with capitalized first and last names
 */
export function toFullName (firstName: string | undefined, lastName: string | undefined) {
  return `${capitalize(firstName)} ${capitalize(lastName)}`.trim()
}
