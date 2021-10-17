import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronicleEditorComponent } from './chronicle-editor.component';

describe('ChronicleEditorComponent', () => {
  let component: ChronicleEditorComponent;
  let fixture: ComponentFixture<ChronicleEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChronicleEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChronicleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
