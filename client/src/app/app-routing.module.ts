import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { caseRoutes, AuthGuard } from '@casejs/angular-library'
import { HomeComponent } from './pages/home/home.component'
import { userRoutes } from './resources/user/user.routes'

import { actorRoutes } from './resources/actor/actor.routes'
import { movieRoutes } from './resources/movie/movie.routes'
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  ...userRoutes,
    ...actorRoutes,
  ...movieRoutes,
...(caseRoutes as Routes)
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
