import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteManagerService {
  public openNotes: Subject<string> = new Subject<string>();

  constructor() { }
}
