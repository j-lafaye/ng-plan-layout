import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Md3IconButtonModule } from '@md3/components/icon-button/icon-button.module';
import { PlanLayoutComponent } from './plan-layout.component';
import { PlanLayoutMilestoneComponent } from "./plan-layout-milestone/plan-layout-milestone.component";

@NgModule({
  declarations: [
    PlanLayoutComponent,
    PlanLayoutMilestoneComponent
  ],
  exports: [
    PlanLayoutComponent,
    PlanLayoutMilestoneComponent
  ],
  imports: [
    CommonModule,
    Md3IconButtonModule
  ]
})
export class PlanLayoutModule { }
