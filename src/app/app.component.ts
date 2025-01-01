import { Component } from '@angular/core';
import { JsonToolComponent } from './json-tool/json-tool.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonToolComponent, ToastModule],
  templateUrl: './app.component.html',
})
export class AppComponent { }
