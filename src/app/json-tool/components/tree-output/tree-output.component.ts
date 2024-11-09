import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { OutputComponent } from '../output/output.component';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-tree-output',
  standalone: true,
  templateUrl: './tree-output.component.html',
  styleUrls: ['./tree-output.component.css'],
  imports: [NgIf, NgForOf, AsyncPipe, JsonPipe, TreeModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeOutputComponent extends OutputComponent {
  readonly data$ = new BehaviorSubject<TreeNode[]>([]);

  private changeDetectorRef = inject(ChangeDetectorRef);

  applyOutputView(parsed: object) {
    const treeNodes: TreeNode[] = Object.entries(parsed)
      .map(([key, value]) => this.transformToTreeNode(key, value))

    this.data$.next(treeNodes);
    this.changeDetectorRef.detectChanges();
  }

  transformToTreeNode(key: string, value: unknown): TreeNode {
    let children: TreeNode[] = [];
    let isLeaf = true;

    if (Array.isArray(value)) {
      children = value.map((item, index) => this.transformToTreeNode(index.toString(), item));
      isLeaf = false;
    } else if (value && typeof value === 'object') {
      children = Object.entries(value).map(([childKey, childValue]) => this.transformToTreeNode(childKey, childValue));
      isLeaf = children.length === 0;
    }

    return {
      label: key,
      children: children.length > 0 ? children : undefined,
      data: {
        type: value === null ? 'null' : typeof value,
        value: value,
      },
      leaf: isLeaf,
    };
  }
}
