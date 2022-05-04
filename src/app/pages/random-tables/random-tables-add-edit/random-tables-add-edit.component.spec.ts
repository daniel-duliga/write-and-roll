import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomTablesAddEditComponent } from './random-tables-add-edit.component';

describe('RandomTablesAddEditComponent', () => {
  let component: RandomTablesAddEditComponent;
  let fixture: ComponentFixture<RandomTablesAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomTablesAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomTablesAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
