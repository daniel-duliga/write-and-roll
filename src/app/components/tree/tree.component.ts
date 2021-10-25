import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNodeWrapper } from 'src/app/components/tree/tree-node.wrapper';
import { ExpansionModelItem } from 'src/app/storage/core/expansion-model-item';

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
  @Output() onNew: EventEmitter<boolean> = new EventEmitter();
  @Output() onAdd: EventEmitter<string> = new EventEmitter();
  @Output() onEdit: EventEmitter<string> = new EventEmitter();
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
    this.setExpansionModel();
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

  new() {
    this.onNew.emit(true);
  }

  expandNode(node: TreeNodeWrapper) {
    this.onExpanded.emit(new ExpansionModelItem(node.path, this.treeControl.isExpanded(node)));
  }

  add(path: string) {
    this.onAdd.emit(path);
  }

  edit(path: string) {
    this.onEdit.emit(path);
  }

  delete(path: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (confirm(`Are you sure you want to delete ${path}?`)) {
      this.onDelete.emit(path);
      this.paths = this.paths.filter(x => x != path);
      this.initializeDataSource();
    }
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

  private initializeDataSource() {
    this.rootNode = TreeNodeWrapper.fromPaths(this.paths);
    this.dataSource = new ArrayDataSource(this.rootNode.children);
  }
}
