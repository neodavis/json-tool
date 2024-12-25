import { Directive, OnInit } from "@angular/core";

@Directive()
export abstract class EditorBaseComponent implements OnInit {
  protected abstract initializeServices(): void;

  protected abstract setupSubscriptions(): void;

  protected abstract configureEditor(): void;

  ngOnInit() {
    this.initializeServices();
    this.setupSubscriptions();
    this.configureEditor();
  }
}
