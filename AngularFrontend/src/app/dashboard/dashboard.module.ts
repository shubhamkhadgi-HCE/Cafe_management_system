import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MaterialModule } from "../shared/material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from "@angular/router";
import { DashboardRoutes } from "./dashboard.routing";
import { DashboardComponent } from "./dashboard.component";

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        RouterModule.forChild(DashboardRoutes)
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule { }