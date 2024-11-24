import { Component } from '@angular/core';

import { JsonToolComponent } from './json-tool/json-tool.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonToolComponent],
  templateUrl: './app.component.html',
})
export class AppComponent { }
