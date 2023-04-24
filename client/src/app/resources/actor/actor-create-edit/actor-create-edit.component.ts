import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'

import {
  CaseCreateEditComponent,
  ResourceDefinition,
  Field,
  InputType,
  BreadcrumbService,
  FlashMessageService,
  ResourceService,
  caseCreateEditTemplate
} from '@casejs/angular-library'

import { environment } from '../../../../environments/environment'
import { actorDefinition } from '../actor.definition'
import { movieDefinition } from '../../movie/movie.definition'

@Component({ template: caseCreateEditTemplate })
export class ActorCreateEditComponent
  extends CaseCreateEditComponent
  implements OnInit
{
  // Remove this property to hide onboarding message.
  isOnboarding = environment.isOnboarding

  definition: ResourceDefinition = actorDefinition
  fields: Field[] = [
    {
      label: 'name',
      property: 'name',
      required: true,
      inputType: InputType.Text
    },
    {
      label: 'Movies',
      properties: {
        movieIds: 'movieIds'
      },
      className: 'is-6',
      searchResources: [movieDefinition],
      inputType: InputType.MultiSearch
    }
  ]

  constructor(
    formBuilder: FormBuilder,
    router: Router,
    activatedRoute: ActivatedRoute,
    resourceService: ResourceService,
    breadcrumbService: BreadcrumbService,
    flashMessageService: FlashMessageService
  ) {
    super(
      formBuilder,
      router,
      breadcrumbService,
      resourceService,
      flashMessageService,
      activatedRoute
    )
  }

  ngOnInit() {
    this.initCreateEditView()
  }
}
