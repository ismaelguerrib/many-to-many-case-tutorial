import { Route } from '@angular/router'

import { AuthGuard, PermissionGuard, ResourceMode  } from '@casejs/angular-library'

import { ActorCreateEditComponent } from './actor-create-edit/actor-create-edit.component'
import { ActorListComponent } from './actor-list/actor-list.component'
import { ActorDetailComponent } from './actor-detail/actor-detail.component'
import { actorDefinition } from './actor.definition'

export const actorRoutes: Route[] = [
  {
    path: 'actors',
    component: ActorListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permission: 'browseActors'
    }
  },
  {
    path: 'actors/create',
    component: ActorCreateEditComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      mode: ResourceMode.Create,
      permission: 'addActors'
    },
  },
  {
    path: 'actors/:id/edit',
    component: ActorCreateEditComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      mode: ResourceMode.Edit,
      permission: 'editActors'
    },
  },
]

if(actorDefinition.hasDetailPage) {
  actorRoutes.push(
    {
      path: 'actors/:id',
      component: ActorDetailComponent,
      canActivate: [AuthGuard, PermissionGuard],
      data: {
        permission: 'readActors'
      }
    }
  )
}
