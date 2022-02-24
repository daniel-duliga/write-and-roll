import { Note } from "./note";
import { Injectable } from "@angular/core";
import { GenericStorageService } from "../generic-storage-manager";

@Injectable({
  providedIn: 'root'
})
export class NoteStorageService extends GenericStorageService<Note> {
  constructor() {
    super('notes');
  }
}
