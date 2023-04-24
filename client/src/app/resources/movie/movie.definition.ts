import { LinkType, ResourceDefinition, ActionType } from '@casejs/angular-library'

export const movieDefinition: ResourceDefinition = {
  title: 'Movies',
  nameSingular: 'movie',
  namePlural: 'movies',
  className: 'Movie',
  mainIdentifier: 'id',
  slug: 'movies',
  path: 'movies',
  icon: 'icon-grid',
  hasDetailPage: true,
  hasListPage: true,
  buttons: [LinkType.CREATE, LinkType.EXPORT],
  defaultLink: LinkType.DETAIL,
  childrenThatPreventDelete: [],
  dropdownLinks: [
    {
      label: 'Edit',
      permission: 'editMovies',
      action: (movie) => ({
        type: ActionType.Link,
        link: {
          path: `${movieDefinition.path}/${movie.id}/edit`
        }
      })
    },
    {
      label: 'Delete',
      permission: 'deleteMovies',
      action: (movie) => ({
        type: ActionType.Delete,
        delete: {
          itemToDelete: movie,
          definition: movieDefinition
        }
      })
    }
  ]
}
