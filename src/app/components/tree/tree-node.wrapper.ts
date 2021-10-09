export class TreeNodeWrapper {
  constructor(
    public name: string = '',
    public path: string = '',
    public children: TreeNodeWrapper[] = []
  ) { }

  static fromPaths(paths: string[]): TreeNodeWrapper {
    let rootNode: TreeNodeWrapper = new TreeNodeWrapper();
    for (const path of paths) {
      const pathSegments = path.split('/').reverse();
      rootNode = this.getNodeFromPath(rootNode, pathSegments);
    }
    return rootNode;
  }

  removeChild(path: string) {
    const pathSegments = path.split('/').reverse();
    TreeNodeWrapper.removeChildByPath(pathSegments, this);
  }

  private static getNodeFromPath(parentNode: TreeNodeWrapper, pathSegments: string[]): TreeNodeWrapper {
    if (pathSegments.length > 0) {
      const segment = pathSegments.pop();
      let currentNode = parentNode.children.find(x => x.name === segment);
      if (!currentNode) {
        const currentNodePath = parentNode.path ? `${parentNode.path}/${segment}` : segment;
        currentNode = new TreeNodeWrapper(segment, currentNodePath);
        parentNode.children.push(currentNode);
      }
      this.getNodeFromPath(currentNode, pathSegments);
    }
    parentNode.children.sort((a, b) => a.children.length > 0 && b.children.length > 0 ? 0 : a.children.length > 0 ? -1 : 1);
    return parentNode;
  }

  private static removeChildByPath(pathSegments: string[], node: TreeNodeWrapper) {
    if (pathSegments.length > 0) {
      const pathSegment = pathSegments.pop();
      const childNode = node.children.find(x => x.name === pathSegment);
      if (childNode?.children.length === 0) {
        node.children = node.children.filter(x => x.name != pathSegment);
      } else if (childNode) {
        this.removeChildByPath(pathSegments, childNode);
      }
    }
  }
}