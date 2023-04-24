import { LinkType, ResourceDefinition, ActionType } from '@casejs/angular-library'

export const actorDefinition: ResourceDefinition = {
  title: 'Actors',
  nameSingular: 'actor',
  namePlural: 'actors',
  className: 'Actor',
  mainIdentifier: 'id',
  slug: 'actors',
  path: 'actors',
  icon: 'icon-grid',
  hasDetailPage: true,
  hasListPage: true,
  buttons: [LinkType.CREATE, LinkType.EXPORT],
  defaultLink: LinkType.DETAIL,
  childrenThatPreventDelete: [],
  dropdownLinks: [
    {
      label: 'Edit',
      permission: 'editActors',
      action: (actor) => ({
        type: ActionType.Link,
        link: {
          path: `${actorDefinition.path}/${actor.id}/edit`
        }
      })
    },
    {
      label: 'Delete',
      permission: 'deleteActors',
      action: (actor) => ({
        type: ActionType.Delete,
        delete: {
          itemToDelete: actor,
          definition: actorDefinition
        }
      })
    }
  ]
}
