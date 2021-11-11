import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorListService {
  onEditorOpened: Subject<string> = new Subject();

  constructor() { }
}
