import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// Components:
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component';
// Routes:
import { appRoutes } from './app.routes';
// Shared:
import { Constants } from './shared/Constants';

@NgModule({
  imports: [RouterModule.forRoot([
    { path: '', redirectTo: Constants.appEndpoints.DASHBOARD_URL, pathMatch: 'full' },
    { path: appRoutes.dashboard.path, component: DashboardComponent },
    { path: appRoutes.login.path, component: LoginComponent },
    { path: '**', component: NotFoundPageComponent }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
