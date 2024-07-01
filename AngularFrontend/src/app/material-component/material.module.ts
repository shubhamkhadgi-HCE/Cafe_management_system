import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MaterialRoutes } from "./material.routing";
import { MaterialModule } from "../shared/material.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import {CdkTableModule} from '@angular/cdk/table';
import { ViewBillProductsComponent } from "./dialog/view-bill-products/view-bill-products.component";

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(MaterialRoutes),
        MaterialModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        CdkTableModule
    ],
    providers:[],
    declarations:[
        ViewBillProductsComponent
    ]
})
export class MaterialComponentsModule {}