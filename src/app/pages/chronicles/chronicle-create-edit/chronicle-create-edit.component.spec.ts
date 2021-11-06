import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronicleCreateEditComponent } from './chronicle-create-edit.component';

describe('ChronicleCreateEditComponent', () => {
  let component: ChronicleCreateEditComponent;
  let fixture: ComponentFixture<ChronicleCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChronicleCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChronicleCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
