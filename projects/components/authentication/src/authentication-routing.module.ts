import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { RouterModule } from '@angular/router';
import { AuthenticationDialogComponent } from "./view/authentication-dialog.component";


const routes: Routes = [
    { 
        path: "login", 
        component: AuthenticationDialogComponent 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
