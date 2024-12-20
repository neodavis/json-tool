import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MonacoEditorModule, provideMonacoEditor } from 'ngx-monaco-editor-v2';
import * as githubDark from 'monaco-themes/themes/GitHub Dark.json';
import { editor, languages, Uri } from 'monaco-editor';

import { routes } from './app.routes';
import { SHOW_LOGS } from './tokens/logger.token';

declare global {
  interface Window {
    // TODO: enhance typing for monaco
    monaco: {
      Uri: Uri
      languages: typeof languages
      editor: typeof editor
    };
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideMonacoEditor(),
    importProvidersFrom(
      MonacoEditorModule.forRoot({
        onMonacoLoad: () => {
          window.monaco.editor.defineTheme('githubDark', githubDark as editor.IStandaloneThemeData);
          window.monaco.editor.setTheme('githubDark')
        }
      })
    ),
    { provide: SHOW_LOGS, useValue: false },
  ]
};
