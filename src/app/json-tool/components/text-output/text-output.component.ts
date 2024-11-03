import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { InputTextareaModule } from 'primeng/inputtextarea';
import hljs from 'highlight.js';

import { OutputComponent } from '../output/output.component';

@Component({
  selector: 'app-text-output',
  standalone: true,
  imports: [InputTextareaModule],
  templateUrl: './text-output.component.html',
  styleUrl: './text-output.component.css'
})
export class TextOutputComponent extends OutputComponent {
  @ViewChild('jsonOutput') jsonOutput!: ElementRef<HTMLElement>;

  applyOutputView(parsed: object, stringified: string) {
    const stringifiedWithSyntax = hljs.highlight(stringified, { language: 'json' }).value

    this.jsonOutput.nativeElement.innerHTML = stringifiedWithSyntax;
  }
}
