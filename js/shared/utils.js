export class Utils {
    static wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static percentage(value, total) {
        return Math.round((value / total) * 100);
    }

    static escapeHtml(str) {
        if (str === undefined || str === null) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    static async fetchJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
        return await res.json();
    }

    static calculateYearsSince(startYear) {
        return new Date().getFullYear() - startYear;
    }

    static downloadFile(path, filename) {
        const link = document.createElement("a");
        link.href = path;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export class DOMUtils {
    static addClass(element, className) {
        element?.classList.add(className);
    }

    static removeClass(element, className) {
        element?.classList.remove(className);
    }

    static setStyles(element, styles) {
        if (!element) return;
        Object.assign(element.style, styles);
    }

    static appendText(element, text) {
        if (!element) return;
        element.textContent += text;
    }

    static setText(element, text) {
        if (!element) return;
        element.textContent = text;
    }
}
