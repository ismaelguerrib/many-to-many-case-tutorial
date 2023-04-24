import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import {
  BreadcrumbService,
  CaseDetailComponent,
  FlashMessageService,
  ResourceDefinition,
  ResourceService,
} from '@casejs/angular-library'

import { actorDefinition } from '../actor.definition'

@Component({ 
  templateUrl: './actor-detail.component.html',
  styleUrls: ['./actor-detail.component.scss']
 })
export class ActorDetailComponent extends CaseDetailComponent implements OnInit {
  definition: ResourceDefinition = actorDefinition

  constructor(
    breadcrumbService: BreadcrumbService,
    resourceService: ResourceService,
    flashMessageService: FlashMessageService,
    activatedRoute: ActivatedRoute,
  ) {
    super(
      breadcrumbService,
      resourceService,
      flashMessageService,
      activatedRoute
    )
  }

  async ngOnInit(): Promise<void> {
    await this.initDetailView()
    console.log(this.item)
  }
}
