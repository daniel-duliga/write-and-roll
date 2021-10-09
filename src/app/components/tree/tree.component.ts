import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNodeWrapper } from 'src/app/components/tree/tree-node.wrapper';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  @Input() paths: string[] = [];
  @Output() onDelete: EventEmitter<string> = new EventEmitter();
  @Output() onEdit: EventEmitter<string> = new EventEmitter();
  @Output() onAdd: EventEmitter<string> = new EventEmitter();

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

  filterItems() {
    this.paths = this.initialPaths.filter(x => x.toLowerCase().includes(this.filter.toLowerCase()));
    this.initializeDataSource();
  }

  add(path: string) {
    this.onAdd.emit(path);
  }

  edit(path: string) {
    this.onEdit.emit(path);
  }

  delete(path: string) {
    if (confirm(`Are you sure you want to delete ${path}?`)) {
      this.onDelete.emit(path);
      this.paths = this.paths.filter(x => x != path);
      this.initializeDataSource();
    }
  }

  private initializeDataSource() {
    this.rootNode = TreeNodeWrapper.fromPaths(this.paths);
    this.dataSource = new ArrayDataSource(this.rootNode.children);
    this.treeControl.dataNodes = this.rootNode.children;
    this.treeControl.expandAll();
  }
}
