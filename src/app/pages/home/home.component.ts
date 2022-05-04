import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  campaigns = [
    { id: '8d6f12cf-6e53-4d67-9acd-32958f953488', name: 'Test Campaign 1'},
    { id: '8d6f12cf-6e53-4d67-9acd-32958f953489', name: 'Test Campaign 2'},
    { id: '8d6f12cf-6e53-4d67-9acd-32958f953490', name: 'Test Campaign 3'}
  ];
  selectedCampaignId = '8d6f12cf-6e53-4d67-9acd-32958f953488';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

}
