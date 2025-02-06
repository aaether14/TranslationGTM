import { observeDOMChanges } from './domObserver.js';

if (!window.__translationObserverLoaded) {
    window.__translationObserverLoaded = true;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeDOMChanges);
    } else {
        observeDOMChanges();
    }
}