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
import { movieDefinition } from '../movie.definition'
import { actorDefinition } from '../../actor/actor.definition'

@Component({ template: caseCreateEditTemplate })
export class MovieCreateEditComponent
  extends CaseCreateEditComponent
  implements OnInit
{
  // Remove this property to hide onboarding message.
  isOnboarding = environment.isOnboarding

  definition: ResourceDefinition = movieDefinition
  fields: Field[] = [
    {
      label: 'name',
      property: 'name',
      required: true,
      inputType: InputType.Text
    },
    {
      label: 'Actors',
      properties: {
        actorIds: 'actorIds'
      },
      className: 'is-6',
      searchResources: [actorDefinition],
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
