import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.css']
})
export class ImportExportComponent implements OnInit {
  importLogs: string[] = [];

  constructor(
  ) { }

  ngOnInit(): void { }

  export() {
    // const notes = this.noteStorageService.getAll();
    // const blob = new Blob([JSON.stringify(notes)], { type: "application/json" });
    // FileSaver.saveAs(blob, "data.json");
  }

  import(event: any) {
    // if (event.target?.files) {
    //   const importFile = event.target.files[0];
    //   const fileReader = new FileReader();
    //   fileReader.onload = () => processImportFile(fileReader, this.noteStorageService);
    //   fileReader.readAsText(importFile);

    //   const processImportFile = (fileReader: FileReader, noteStorageService: NoteStorageService) => {
    //     if (fileReader.result && typeof fileReader.result === "string") {
    //       const notes: Note[] = JSON.parse(fileReader.result);
    //       for (const note of notes) {
    //         const existingNote = noteStorageService.get(note.name);
    //         if(existingNote) {
    //           this.importLogs.push(`Note '${note.name}' already exists and has not been imported.`);
    //         } else {
    //           noteStorageService.create(note);
    //         }
    //       }
    //       this.importLogs.push('Import ended.');
    //     }
    //   }
    // }
  }

  purge() {
    if (confirm('Are you sure you want to erase all data?')) {
      localStorage.clear();
    }
  }
}
