import { TRANSLATIONS } from './translations.js';

class I18nManager {
    constructor() {
        this.currentLang = this._detectBrowserLanguage();
        this.listeners = [];
    }

    _detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        return langCode === 'fr' ? 'fr' : 'en';
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    setLanguage(lang) {
        if (!TRANSLATIONS[lang]) {
            throw new Error(`Language '${lang}' not supported`);
        }
        this.currentLang = lang;
        this._notifyListeners();
        this._updateHtmlLang();
    }

    _updateHtmlLang() {
        document.documentElement.lang = this.currentLang;
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let value = TRANSLATIONS[this.currentLang];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        if (typeof value === 'string') {
            return this._interpolate(value, params);
        }

        return value || key;
    }

    _interpolate(text, params) {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    onChange(callback) {
        this.listeners.push(callback);
    }

    _notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentLang));
    }

    getDataPath(filename) {
        const baseName = filename.replace('.json', '');
        if (this.currentLang === 'en') {
            return `${baseName}-en.json`;
        }
        return filename;
    }
}

export const i18n = new I18nManager();
