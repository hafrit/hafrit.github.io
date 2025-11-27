/**
 * Accessibility Controls
 * WCAG 2.1 Level AA Compliant
 */

// ============================================
// CONSTANTS
// ============================================
const FONT_SIZES = {
    NORMAL: 'normal',
    LARGE: 'large',
    EXTRA_LARGE: 'extra-large'
};

const CSS_CLASSES = {
    LARGE_TEXT: 'large-text',
    EXTRA_LARGE_TEXT: 'extra-large-text',
    HIGH_CONTRAST: 'high-contrast',
    KEYBOARD_USER: 'keyboard-user'
};

const ELEMENT_IDS = {
    DECREASE_FONT: 'decrease-font',
    INCREASE_FONT: 'increase-font',
    TOGGLE_CONTRAST: 'toggle-contrast',
    ANNOUNCER: 'screen-reader-announcer'
};

const STORAGE_KEY = 'accessibility-preferences';

const MESSAGES = {
    FONT_INCREASED: 'Font size increased',
    FONT_VERY_LARGE: 'Font size very large',
    FONT_DECREASED: 'Font size decreased',
    FONT_NORMAL: 'Font size normal',
    FONT_RESET: 'Font size reset',
    CONTRAST_ENABLED: 'High contrast mode enabled',
    CONTRAST_DISABLED: 'High contrast mode disabled'
};

const ARIA_LABELS = {
    CONTRAST_ENABLE: 'Enable high contrast mode',
    CONTRAST_DISABLE: 'Disable high contrast mode'
};

// ============================================
// UTILITIES
// ============================================
class DOMHelper {
    static getElement(id) {
        return document.getElementById(id);
    }

    static addClass(element, className) {
        element?.classList.add(className);
    }

    static removeClass(element, className) {
        element?.classList.remove(className);
    }

    static toggleClass(element, className) {
        element?.classList.toggle(className);
    }

    static setAttributes(element, attributes) {
        if (!element) return;
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
}

class StorageManager {
    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn(`Unable to save ${key}`, error);
            return false;
        }
    }

    static load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn(`Unable to load ${key}`, error);
            return null;
        }
    }
}

// ============================================
// SCREEN READER ANNOUNCER
// ============================================
class ScreenReaderAnnouncer {
    constructor() {
        this.announcer = null;
    }

    announce(message) {
        this.ensureAnnouncerExists();
        this.announcer.textContent = message;
        this.scheduleCleanup();
    }

    ensureAnnouncerExists() {
        if (!this.announcer) {
            this.announcer = this.createAnnouncer();
        }
    }

    createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = ELEMENT_IDS.ANNOUNCER;
        announcer.className = 'sr-only';
        DOMHelper.setAttributes(announcer, {
            'role': 'status',
            'aria-live': 'polite',
            'aria-atomic': 'true'
        });
        document.body.appendChild(announcer);
        return announcer;
    }

    scheduleCleanup() {
        setTimeout(() => {
            if (this.announcer) {
                this.announcer.textContent = '';
            }
        }, 1000);
    }
}

// ============================================
// FONT SIZE MANAGER
// ============================================
class FontSizeManager {
    constructor(announcer) {
        this.currentSize = FONT_SIZES.NORMAL;
        this.announcer = announcer;
    }

    increase() {
        const transitions = {
            [FONT_SIZES.NORMAL]: {
                size: FONT_SIZES.LARGE,
                addClass: CSS_CLASSES.LARGE_TEXT,
                removeClass: CSS_CLASSES.EXTRA_LARGE_TEXT,
                message: MESSAGES.FONT_INCREASED
            },
            [FONT_SIZES.LARGE]: {
                size: FONT_SIZES.EXTRA_LARGE,
                addClass: CSS_CLASSES.EXTRA_LARGE_TEXT,
                removeClass: CSS_CLASSES.LARGE_TEXT,
                message: MESSAGES.FONT_VERY_LARGE
            }
        };

        this.applyTransition(transitions[this.currentSize]);
    }

    decrease() {
        const transitions = {
            [FONT_SIZES.EXTRA_LARGE]: {
                size: FONT_SIZES.LARGE,
                addClass: CSS_CLASSES.LARGE_TEXT,
                removeClass: CSS_CLASSES.EXTRA_LARGE_TEXT,
                message: MESSAGES.FONT_DECREASED
            },
            [FONT_SIZES.LARGE]: {
                size: FONT_SIZES.NORMAL,
                addClass: null,
                removeClass: CSS_CLASSES.LARGE_TEXT,
                message: MESSAGES.FONT_NORMAL
            }
        };

        this.applyTransition(transitions[this.currentSize]);
    }

    reset() {
        this.currentSize = FONT_SIZES.NORMAL;
        DOMHelper.removeClass(document.body, CSS_CLASSES.LARGE_TEXT);
        DOMHelper.removeClass(document.body, CSS_CLASSES.EXTRA_LARGE_TEXT);
        this.announcer.announce(MESSAGES.FONT_RESET);
    }

    applyTransition(transition) {
        if (!transition) return;

        this.currentSize = transition.size;
        if (transition.removeClass) {
            DOMHelper.removeClass(document.body, transition.removeClass);
        }
        if (transition.addClass) {
            DOMHelper.addClass(document.body, transition.addClass);
        }
        this.announcer.announce(transition.message);
    }

    applySize(size) {
        const sizeMap = {
            [FONT_SIZES.LARGE]: CSS_CLASSES.LARGE_TEXT,
            [FONT_SIZES.EXTRA_LARGE]: CSS_CLASSES.EXTRA_LARGE_TEXT
        };

        this.currentSize = size;
        const className = sizeMap[size];
        if (className) {
            DOMHelper.addClass(document.body, className);
        }
    }

    getSize() {
        return this.currentSize;
    }
}

// ============================================
// CONTRAST MANAGER
// ============================================
class ContrastManager {
    constructor(announcer) {
        this.isHighContrast = false;
        this.announcer = announcer;
    }

    toggle() {
        this.isHighContrast = !this.isHighContrast;

        if (this.isHighContrast) {
            this.enable();
        } else {
            this.disable();
        }
    }

    enable() {
        DOMHelper.addClass(document.body, CSS_CLASSES.HIGH_CONTRAST);
        this.updateButton(ARIA_LABELS.CONTRAST_DISABLE);
        this.announcer.announce(MESSAGES.CONTRAST_ENABLED);
    }

    disable() {
        DOMHelper.removeClass(document.body, CSS_CLASSES.HIGH_CONTRAST);
        this.updateButton(ARIA_LABELS.CONTRAST_ENABLE);
        this.announcer.announce(MESSAGES.CONTRAST_DISABLED);
    }

    updateButton(label) {
        const button = DOMHelper.getElement(ELEMENT_IDS.TOGGLE_CONTRAST);
        DOMHelper.setAttributes(button, {
            'aria-label': label,
            'title': label
        });
    }

    apply(enabled) {
        this.isHighContrast = enabled;
        if (enabled) {
            DOMHelper.addClass(document.body, CSS_CLASSES.HIGH_CONTRAST);
            this.updateButton(ARIA_LABELS.CONTRAST_DISABLE);
        }
    }

    isEnabled() {
        return this.isHighContrast;
    }
}

// ============================================
// KEYBOARD DETECTOR
// ============================================
class KeyboardDetector {
    constructor() {
        this.isKeyboardUser = false;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('mousedown', () => this.handleMouseDown());
    }

    handleKeyDown(event) {
        if (event.key === 'Tab') {
            this.isKeyboardUser = true;
            DOMHelper.addClass(document.body, CSS_CLASSES.KEYBOARD_USER);
        }
    }

    handleMouseDown() {
        if (this.isKeyboardUser) {
            this.isKeyboardUser = false;
            DOMHelper.removeClass(document.body, CSS_CLASSES.KEYBOARD_USER);
        }
    }
}

// ============================================
// PREFERENCES MANAGER
// ============================================
class PreferencesManager {
    constructor(fontSizeManager, contrastManager) {
        this.fontSizeManager = fontSizeManager;
        this.contrastManager = contrastManager;
    }

    save() {
        const preferences = {
            fontSize: this.fontSizeManager.getSize(),
            highContrast: this.contrastManager.isEnabled()
        };
        StorageManager.save(STORAGE_KEY, preferences);
    }

    load() {
        const preferences = StorageManager.load(STORAGE_KEY);
        if (!preferences) return;

        if (preferences.fontSize) {
            this.fontSizeManager.applySize(preferences.fontSize);
        }

        if (preferences.highContrast) {
            this.contrastManager.apply(true);
        }
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
class KeyboardShortcuts {
    constructor(fontSizeManager, contrastManager) {
        this.fontSizeManager = fontSizeManager;
        this.contrastManager = contrastManager;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    handleKeyDown(event) {
        if (!event.ctrlKey) return;

        const shortcuts = {
            '+': () => this.fontSizeManager.increase(),
            '=': () => this.fontSizeManager.increase(),
            '-': () => this.fontSizeManager.decrease(),
            '0': () => this.fontSizeManager.reset()
        };

        if (shortcuts[event.key]) {
            event.preventDefault();
            shortcuts[event.key]();
            return;
        }

        // Ctrl + Shift + C for contrast
        if (event.shiftKey && event.key === 'C') {
            event.preventDefault();
            this.contrastManager.toggle();
        }
    }
}

// ============================================
// MAIN ACCESSIBILITY MANAGER (Orchestrator)
// ============================================
class AccessibilityManager {
    constructor() {
        this.announcer = new ScreenReaderAnnouncer();
        this.fontSizeManager = new FontSizeManager(this.announcer);
        this.contrastManager = new ContrastManager(this.announcer);
        this.preferencesManager = new PreferencesManager(
            this.fontSizeManager,
            this.contrastManager
        );
        this.keyboardDetector = new KeyboardDetector();
        this.keyboardShortcuts = new KeyboardShortcuts(
            this.fontSizeManager,
            this.contrastManager
        );

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.preferencesManager.load();
    }

    setupEventListeners() {
        this.bindButton(ELEMENT_IDS.DECREASE_FONT, () => this.decreaseFont());
        this.bindButton(ELEMENT_IDS.INCREASE_FONT, () => this.increaseFont());
        this.bindButton(ELEMENT_IDS.TOGGLE_CONTRAST, () => this.toggleContrast());
    }

    bindButton(elementId, handler) {
        const button = DOMHelper.getElement(elementId);
        if (button) {
            button.addEventListener('click', handler);
        }
    }

    decreaseFont() {
        this.fontSizeManager.decrease();
        this.preferencesManager.save();
    }

    increaseFont() {
        this.fontSizeManager.increase();
        this.preferencesManager.save();
    }

    toggleContrast() {
        this.contrastManager.toggle();
        this.preferencesManager.save();
    }
}

// ============================================
// INITIALIZATION
// ============================================
function initAccessibility() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new AccessibilityManager();
        });
    } else {
        new AccessibilityManager();
    }
}

initAccessibility();

export { AccessibilityManager };
