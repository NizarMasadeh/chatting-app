import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private originalStorage: { [key: string]: string | null } = {};
  private readonly secretKey = 'nzrmLOCALSTORAGE';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeOriginalStorage();
      this.overrideLocalStorageMethods();
      this.initStorageListener();
    }
  }

  private initializeOriginalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        this.originalStorage[key] = localStorage.getItem(key);
      }
    }
  }

  private overrideLocalStorageMethods() {
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;

    localStorage.setItem = (key: string, value: string) => {

    };
    localStorage.removeItem = (key: string) => {

    };

    this.setItem = (key: string, value: string) => {
      this.originalStorage[key] = value;
      originalSetItem.call(localStorage, key, value);
    };

    this.removeItem = (key: string) => {
      delete this.originalStorage[key];
      originalRemoveItem.call(localStorage, key);
    };

    localStorage.clear = () => {
      this.originalStorage = {};
      originalClear.call(localStorage);
    };
  }

  private initStorageListener() {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.storageArea === localStorage) {
        const key = event.key;

        if (key && this.originalStorage[key] !== null) {
          const newValue = localStorage.getItem(key);
          const oldValue = this.originalStorage[key];

          if (newValue !== oldValue) {
            this.setItem(key, oldValue!);
          }
        }
      }
    });
  }

  public setItem(key: string, value: string) {
    const originalSetItem = localStorage.setItem;
    this.originalStorage[key] = value;
    originalSetItem.call(localStorage, key, value);
  }

  public removeItem(key: string) {
    const originalRemoveItem = localStorage.removeItem;
    delete this.originalStorage[key];
    originalRemoveItem.call(localStorage, key);
  }
}