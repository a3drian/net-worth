import { Component, OnInit } from '@angular/core';
// Shared:
import { Constants } from 'src/app/shared/Constants';

@Component({
	selector: 'app-spend-form',
	templateUrl: './spend-form.component.html',
	styleUrls: ['./spend-form.component.scss']
})
export class SpendFormComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	constructor() { }

	ngOnInit(): void { }

}
