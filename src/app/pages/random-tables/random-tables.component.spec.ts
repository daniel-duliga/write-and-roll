import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomTablesComponent } from './random-tables.component';

describe('RandomTablesComponent', () => {
  let component: RandomTablesComponent;
  let fixture: ComponentFixture<RandomTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomTablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
