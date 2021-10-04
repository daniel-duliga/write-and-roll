import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomTableCreateComponent } from './random-table-create.component';

describe('RandomTableCreateComponent', () => {
  let component: RandomTableCreateComponent;
  let fixture: ComponentFixture<RandomTableCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomTableCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomTableCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
