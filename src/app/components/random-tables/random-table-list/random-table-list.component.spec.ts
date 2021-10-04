import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomTableListComponent } from './random-table-list.component';

describe('RandomTableListComponent', () => {
  let component: RandomTableListComponent;
  let fixture: ComponentFixture<RandomTableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomTableListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
