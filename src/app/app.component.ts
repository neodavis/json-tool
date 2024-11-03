import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonToolComponent } from './json-tool/json-tool.component';
import hljs from 'highlight.js';
import * as jsSyntax from 'highlight.js/lib/languages/json.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonToolComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'JsonTool';

  ngOnInit() {
    hljs.registerLanguage('json', jsSyntax.default);
  }
}
