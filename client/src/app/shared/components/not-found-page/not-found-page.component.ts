import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Shared:
import { Constants } from '../../Constants';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  DASHBOARD_URL = '/' + Constants.appEndpoints.DASHBOARD_URL;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  redirect(): void {
    this.router.navigate([this.DASHBOARD_URL]);
  }

}
