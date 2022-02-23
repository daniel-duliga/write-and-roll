import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteManagerService {
public requestOpen: Subject<string> = new Subject<string>();
  public requestClose: Subject<string> = new Subject<string>();
  public requestRename: Subject<string> = new Subject<string>();
  public requestFavorite: Subject<string> = new Subject<string>();
  public requestDelete: Subject<string> = new Subject<string>();
  public requestOpenLink: Subject<string> = new Subject<string>();

  constructor() { }
}
