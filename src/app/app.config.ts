import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, Injector, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MonacoEditorModule, provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { editor, languages, Uri } from 'monaco-editor';
import * as githubDark from 'monaco-themes/themes/GitHub Dark.json';

import { SHOW_LOGS } from './tokens/logger.token';
import { DEFAULT_THEME } from './tokens/theme.token';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { MessageService } from 'primeng/api';
import { environment } from './environment';

declare global {
  interface Window {
    monaco: {
      Uri: Uri
      languages: typeof languages
      editor: typeof editor
    };
    __INJECTOR__: Injector;
    __SHOW_LOGS__: boolean;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideMonacoEditor(),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideFirestore(() => getFirestore()),
      MonacoEditorModule.forRoot({
        onMonacoLoad: () => {
          const injector = window.__INJECTOR__;
          const defaultTheme = injector.get(DEFAULT_THEME);

          window.monaco.editor.defineTheme('githubDark', githubDark as editor.IStandaloneThemeData);
          window.monaco.editor.setTheme(defaultTheme);
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: (injector: Injector) => {
        // Store Injector instance globally for Monaco callback
        window.__INJECTOR__ = injector;
        window.__SHOW_LOGS__ = injector.get(SHOW_LOGS);

        return () => Promise.resolve();
      },
      deps: [Injector],
      multi: true
    },
    { provide: DEFAULT_THEME, useValue: 'githubDark' },
    { provide: SHOW_LOGS, useValue: true },
    MessageService
  ]
};
