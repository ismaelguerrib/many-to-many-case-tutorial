import { Route } from '@angular/router'

import { AuthGuard, PermissionGuard, ResourceMode  } from '@casejs/angular-library'

import { MovieCreateEditComponent } from './movie-create-edit/movie-create-edit.component'
import { MovieListComponent } from './movie-list/movie-list.component'
import { MovieDetailComponent } from './movie-detail/movie-detail.component'
import { movieDefinition } from './movie.definition'

export const movieRoutes: Route[] = [
  {
    path: 'movies',
    component: MovieListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permission: 'browseMovies'
    }
  },
  {
    path: 'movies/create',
    component: MovieCreateEditComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      mode: ResourceMode.Create,
      permission: 'addMovies'
    },
  },
  {
    path: 'movies/:id/edit',
    component: MovieCreateEditComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      mode: ResourceMode.Edit,
      permission: 'editMovies'
    },
  },
]

if(movieDefinition.hasDetailPage) {
  movieRoutes.push(
    {
      path: 'movies/:id',
      component: MovieDetailComponent,
      canActivate: [AuthGuard, PermissionGuard],
      data: {
        permission: 'readMovies'
      }
    }
  )
}
