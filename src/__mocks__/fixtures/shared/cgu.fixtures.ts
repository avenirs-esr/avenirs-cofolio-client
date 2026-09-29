import type { CguDTO } from '@/api/avenir-esr'

export const mockedCgu: CguDTO = {
  id: 'ec7d4c6a-1f54-4e9c-9a9b-0f3c2b5d7a11',
  version: 3,
  uploadedAt: '2026-03-12T09:30:00Z',
  content: `
    <h2>Article 1 - Objet</h2>
    <p>Les présentes conditions générales d'utilisation ont pour objet de définir les modalités de mise à disposition du service Cofolio et les conditions d'utilisation par l'utilisateur.</p>
    <h2>Article 2 - Accès au service</h2>
    <p>L'accès au service est réservé aux utilisateurs disposant d'un compte fourni par leur établissement d'enseignement supérieur.</p>
    <h2>Article 3 - Données personnelles</h2>
    <p>Les données collectées sont traitées conformément à la politique de protection des <a href="https://avenirs-esr.fr/">données personnelles</a>.</p>
  `
}
