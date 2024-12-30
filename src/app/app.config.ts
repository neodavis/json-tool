import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, Injector, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MonacoEditorModule, provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { editor, languages, Uri } from 'monaco-editor';

import { SHOW_LOGS } from './tokens/logger.token';
import { EditorThemeFlyweight } from './flyweights/editor-theme-flyweight';
import { DEFAULT_THEME } from './tokens/theme.token';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';

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
      provideFirebaseApp(() => initializeApp({
        apiKey: "AIzaSyCX_ROiajpVhEJrpS2LcBt6aBirfB_pP7g",
        authDomain: "json-tool-49560.firebaseapp.com",
        projectId: "json-tool-49560",
        storageBucket: "json-tool-49560.firebasestorage.app",
        messagingSenderId: "787670214338",
        appId: "1:787670214338:web:e9f0bbf530450965547d5b",
        measurementId: "G-PWVMY0SK50"
      })),
      provideFirestore(() => getFirestore()),
      MonacoEditorModule.forRoot({
        onMonacoLoad: () => {
          const injector = window.__INJECTOR__;
          const themeFlyweight = injector.get(EditorThemeFlyweight);
          const defaultTheme = injector.get(DEFAULT_THEME);
          themeFlyweight.getValue().forEach((theme, name) => {

            window.monaco.editor.defineTheme(name, theme);
          });


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
  ]
};
