import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
// Components:
import { AppComponent } from './components/app/app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component';
// Shared:
import { Constants } from './shared/Constants';
import { appRoutes } from './app.routes';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		NotFoundPageComponent,
		DashboardComponent,
		LoadingSpinnerComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot([
			{ path: '', redirectTo: Constants.appEndpoints.DASHBOARD_URL, pathMatch: 'full' },
			{ path: appRoutes.dashboard.path, component: DashboardComponent },
			{ path: appRoutes.login.path, component: LoginComponent },
			{ path: '**', component: NotFoundPageComponent }
		]),
		HttpClientModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
