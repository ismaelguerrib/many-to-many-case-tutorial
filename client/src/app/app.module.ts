import { CommonModule } from '@angular/common'
import { ErrorHandler, NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { environment } from '../environments/environment'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './pages/home/home.component'
import { UserCreateEditComponent } from './resources/user/user-create-edit.component'
import { UserListComponent } from './resources/user/user-list.component'

import Bugsnag from '@bugsnag/js'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'
import { CaseModule } from '@casejs/angular-library';
import { ActorCreateEditComponent } from './resources/actor/actor-create-edit/actor-create-edit.component';
import { ActorListComponent } from './resources/actor/actor-list/actor-list.component';
import { ActorDetailComponent } from './resources/actor/actor-detail/actor-detail.component';
import { MovieCreateEditComponent } from './resources/movie/movie-create-edit/movie-create-edit.component';
import { MovieListComponent } from './resources/movie/movie-list/movie-list.component';
import { MovieDetailComponent } from './resources/movie/movie-detail/movie-detail.component'

if (environment.enableBugsnag) {
  Bugsnag.start({
    apiKey: environment.bugsnagApiKey,
    releaseStage: environment.envName
  })
}

// create a factory which will return the Bugsnag error handler
export function errorHandlerFactory() {
  return new BugsnagErrorHandler()
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    UserCreateEditComponent,
    ActorCreateEditComponent,
    ActorListComponent,
    ActorDetailComponent,
    MovieCreateEditComponent,
    MovieListComponent,
    MovieDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CaseModule.forRoot({
      baseUrl: environment.baseUrl,
      apiBaseUrl: environment.apiBaseUrl,
      storagePath: environment.storagePath,
      appName: environment.appName,
      tokenName: environment.tokenName,
      tokenAllowedDomains: environment.tokenAllowedDomains,
      production: environment.production,
      isOnboarding: environment.isOnboarding,
      googlePlacesAPIKey: 'myGoogleAPIKey'
    })
  ],
  providers: [{ provide: ErrorHandler, useFactory: errorHandlerFactory }],
  bootstrap: [AppComponent]
})
export class AppModule {}
