import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RandomTable, RandomTableLine } from 'src/app/database/models/random-table';
import { RandomTableService } from 'src/app/services/random-table.service';

@Component({
  selector: 'app-random-tables-add-edit',
  templateUrl: './random-tables-add-edit.component.html',
  styleUrls: ['./random-tables-add-edit.component.css']
})
export class RandomTablesAddEditComponent implements OnInit {

  randomTable: RandomTable = new RandomTable('', [new RandomTableLine('', '')]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private randomTableService: RandomTableService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      if (params['id']) {
        const randomTable = await this.randomTableService.get(params['id']);
        if (randomTable) {
          this.randomTable = randomTable;
        }
      }
    });
  }

  addLine() {
    this.randomTable.lines.push(new RandomTableLine('', ''));
  }

  deleteLine(line: RandomTableLine) {
    const index = this.randomTable.lines.findIndex(x => x.index == line.index);
    if (index !== -1) {
      this.randomTable.lines.splice(index, 1);
    }
  }

  async save() {
    if (!this.randomTable._id) {
      await this.randomTableService.create(this.randomTable);
    } else {
      await this.randomTableService.update(this.randomTable);
    }
    this.router.navigate(['/app/random-tables']);
  }

  roll() {
    
  }
}
