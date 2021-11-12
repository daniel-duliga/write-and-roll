import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Item } from 'src/app/entities/models/item';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.css']
})
export class ImportExportComponent implements OnInit {
  importLogs: string[] = [];

  constructor() { }

  ngOnInit(): void { }

  export() {
    const data = loadStorageData();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    FileSaver.saveAs(blob, "data.json");

    function loadStorageData(): Item[] {
      const result: Item[] = [];
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key) {
          const element = localStorage.getItem(key);
          if (element) {
            result.push(new Item(key, element));
          }
        }
      }
      return result;
    }
  }

  import(event: any) {
    if (event.target?.files) {
      const importFile = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => processImportFile(fileReader);
      fileReader.readAsText(importFile);

      const processImportFile = (fileReader: FileReader) => {
        if (fileReader.result && typeof fileReader.result === "string") {
          const importData: Item[] = JSON.parse(fileReader.result);
          for (const element of importData) {
            if(localStorage.getItem(element.path)) {
              this.importLogs.push(`${element.path} already exists and has not been imported.`);
            } else {
              localStorage.setItem(element.path, element.content);
            }
          }
          this.importLogs.push('Import ended.');
        }
      }
    }
  }

  purge() {
    if (confirm('Are you sure you want to erase all data?')) {
      localStorage.clear();
    }
  }
}
