import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCreateEditComponent } from './action-create-edit.component';

describe('ActionCreateEditComponent', () => {
  let component: ActionCreateEditComponent;
  let fixture: ComponentFixture<ActionCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
