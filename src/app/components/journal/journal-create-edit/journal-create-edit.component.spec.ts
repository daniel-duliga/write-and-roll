import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalCreateEditComponent } from './journal-create-edit.component';

describe('JournalCreateEditComponent', () => {
  let component: JournalCreateEditComponent;
  let fixture: ComponentFixture<JournalCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
