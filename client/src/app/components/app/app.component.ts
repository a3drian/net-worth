import { Component } from '@angular/core';
// Shared:
import { Constants } from '../../shared/Constants';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	title = 'Net Worth';
}
