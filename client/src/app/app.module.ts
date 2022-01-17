import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
// Angular Material:
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
// Components:
import { AppComponent } from './components/app/app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepositCardComponent } from './components/deposits/deposit-card/deposit-card.component';
import { DepositFormComponent } from './components/forms/deposit-form/deposit-form.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component';
// Dialogs:
import { DeleteDepositDialogComponent } from './components/dialogs/delete-deposit-dialog/delete-deposit-dialog.component';
import { ShowDepositDialogComponent } from './components/dialogs/show-deposit-dialog/show-deposit-dialog.component';
// Shared:
import { appRoutes } from './app.routes';
import { Constants } from './shared/Constants';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		NotFoundPageComponent,
		DashboardComponent,
		LoadingSpinnerComponent,
		DepositFormComponent,
		DepositCardComponent,
		ShowDepositDialogComponent,
		DeleteDepositDialogComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot([
			{ path: '', redirectTo: Constants.appEndpoints.DASHBOARD_URL, pathMatch: 'full' },
			{ path: appRoutes.dashboard.path, component: DashboardComponent },
			{ path: appRoutes.login.path, component: LoginComponent },
			{ path: '**', component: NotFoundPageComponent }
		]),
		HttpClientModule,
		FormsModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		MatTableModule,
		MatCheckboxModule,
		MatDialogModule,
		NoopAnimationsModule,
		ReactiveFormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
