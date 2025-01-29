import { observeDOMChanges } from './domObserver.js';

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeDOMChanges);
} else {
    observeDOMChanges();
}