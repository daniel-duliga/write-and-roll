import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNodeWrapper } from 'src/app/components/tree/tree-node.wrapper';
import { ExpansionModelItem } from 'src/app/entities/models/expansion-model-item';
import { EntityService } from 'src/app/entities/services/entity.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  @Input() paths: string[] = [];
  @Input() expansionModel: ExpansionModelItem[] = [];
  @Input() icon: string = '';
  @Input() title: string = '';

  @Output() onExpanded: EventEmitter<ExpansionModelItem> = new EventEmitter();
  @Output() onNew: EventEmitter<void> = new EventEmitter();
  @Output() onEdit: EventEmitter<string> = new EventEmitter();
  @Output() onRename: EventEmitter<string> = new EventEmitter();
  @Output() onDelete: EventEmitter<string> = new EventEmitter();

  initialPaths: string[] = [];
  filter: string = '';

  rootNode!: TreeNodeWrapper;
  treeControl = new NestedTreeControl<TreeNodeWrapper>(node => node.children);
  dataSource!: ArrayDataSource<TreeNodeWrapper>;
  hasChild = (_: number, node: TreeNodeWrapper) => !!node.children && node.children.length > 0;

  constructor() { }

  ngOnInit() {
    this.initialPaths = this.paths;
    this.initializeDataSource();
  }

  //#region public methods
  refreshItems(paths: string[]) {
    this.initialPaths = paths;
    this.filterItems();
  }

  filterItems() {
    this.paths = this.initialPaths.filter(x => x.toLowerCase().includes(this.filter.toLowerCase()));
    this.initializeDataSource();
    this.treeControl.dataNodes = this.rootNode.children;
    this.treeControl.expandAll();
  }

  clearFilter() {
    this.filter = '';
    this.filterItems();
  }

  expandNode(node: TreeNodeWrapper) {
    this.onExpanded.emit(new ExpansionModelItem(node.path, this.treeControl.isExpanded(node)));
  }

  foo(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }

  delete(path: string, event: Event) {
    this.foo(event);
    if (confirm(`Are you sure you want to delete ${path}?`)) {
      this.onDelete.emit(path);
      this.paths = this.paths.filter(x => x != path);
      this.initializeDataSource();
    }
  }
  //#endregion

  //#region private methods
  private initializeDataSource() {
    this.rootNode = TreeNodeWrapper.fromPaths(this.paths);
    this.dataSource = new ArrayDataSource(this.rootNode.children);
    this.setExpansionModel();
  }

  private setExpansionModel() {
    for (const expandableItem of this.expansionModel) {
      const node = this.rootNode.getChildRecursive(expandableItem.identifier);
      if (node) {
        if (expandableItem.isExpanded) {
          this.treeControl.expand(node);
        } else {
          this.treeControl.collapse(node);
        }
      }
    }
  }
  //#endregion
}
