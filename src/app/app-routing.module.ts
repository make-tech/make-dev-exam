import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';

const routes: Routes = [
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: 'login', loadChildren: './login/login.module#LoginModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: false, useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
