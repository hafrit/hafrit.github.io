import { startTerminal } from "./terminal-ui.js";
import { BOOT_CONFIG } from "./shared/constants.js";
import { Utils, DOMUtils } from "./shared/utils.js";

class ProgressBar {
    constructor(length) {
        this.length = length;
        this.filledChar = "#";
        this.emptyChar = "-";
    }

    render(percentage) {
        const filled = Math.round((percentage / 100) * this.length);
        const empty = this.length - filled;
        return `[${this.filledChar.repeat(filled)}${this.emptyChar.repeat(empty)}]`;
    }
}

class BootTextManager {
    constructor(element) {
        this.element = element;
    }

    append(text) {
        DOMUtils.appendText(this.element, text);
    }

    updateLastLine(text) {
        const lines = this.element.textContent.split("\n");
        lines[lines.length - 1] = text;
        DOMUtils.setText(this.element, lines.join("\n"));
    }
}

class ProgressAnimation {
    constructor(textManager, progressBar) {
        this.textManager = textManager;
        this.progressBar = progressBar;
    }

    async run(title, start, end, speed) {
        return new Promise(resolve => {
            let current = start;

            const timer = setInterval(() => {
                current++;
                const bar = this.progressBar.render(current);
                this.textManager.updateLastLine(`${title} ${bar} ${current}%`);

                if (current >= end) {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }
}

class TerminalTransition {
    constructor(terminalElement) {
        this.terminal = terminalElement;
    }

    async show() {
        DOMUtils.addClass(document.documentElement, "boot-dimmed");
        DOMUtils.removeClass(this.terminal, "hidden");

        this._setInitialState();
        await Utils.wait(BOOT_CONFIG.ANIMATION.DELAY_BEFORE_SCALE);
        this._setFinalState();
    }

    _setInitialState() {
        DOMUtils.setStyles(this.terminal, {
            opacity: "0",
            pointerEvents: "auto",
            transition: `opacity ${BOOT_CONFIG.ANIMATION.OPACITY_DURATION} ease, transform ${BOOT_CONFIG.ANIMATION.TRANSFORM_DURATION} ease`,
            transform: `translate(-50%, ${BOOT_CONFIG.ANIMATION.INITIAL_TRANSLATE_Y}) scale(${BOOT_CONFIG.ANIMATION.INITIAL_SCALE})`
        });
    }

    _setFinalState() {
        DOMUtils.setStyles(this.terminal, {
            opacity: "1",
            transform: `translate(-50%, ${BOOT_CONFIG.ANIMATION.FINAL_TRANSLATE_Y}) scale(${BOOT_CONFIG.ANIMATION.FINAL_SCALE})`
        });
    }
}

class BootSequence {
    constructor() {
        this.bootTextElement = document.getElementById("boot-text");
        this.terminalElement = document.getElementById("terminal");

        this.textManager = new BootTextManager(this.bootTextElement);
        this.progressBar = new ProgressBar(BOOT_CONFIG.PROGRESS_BAR_LENGTH);
        this.progressAnimation = new ProgressAnimation(this.textManager, this.progressBar);
        this.terminalTransition = new TerminalTransition(this.terminalElement);
    }

    async play() {
        await this._showInitialMessage();
        await this._showProgressBar();
        await this._showShellStart();
        await this._showConnection();
        await this._transitionToTerminal();
    }

    async _showInitialMessage() {
        this.textManager.append(BOOT_CONFIG.MESSAGES.INIT + "\n");
        await Utils.wait(BOOT_CONFIG.DELAYS.INITIAL);
    }

    async _showProgressBar() {
        await this.progressAnimation.run(
            BOOT_CONFIG.MESSAGES.LOADING_MODULES,
            BOOT_CONFIG.PROGRESS_START,
            BOOT_CONFIG.PROGRESS_END,
            BOOT_CONFIG.PROGRESS_SPEED_MS
        );
    }

    async _showShellStart() {
        this.textManager.append("\n" + BOOT_CONFIG.MESSAGES.SHELL_START + "\n");
        await Utils.wait(BOOT_CONFIG.DELAYS.SHELL_START);
    }

    async _showConnection() {
        this.textManager.append(BOOT_CONFIG.MESSAGES.CONNECTING + "\n");
        await Utils.wait(BOOT_CONFIG.DELAYS.PROFILE_CONNECT);

        this.textManager.append(BOOT_CONFIG.MESSAGES.CONNECTED + "\n");
        await Utils.wait(BOOT_CONFIG.DELAYS.CONNECTION_ESTABLISHED);
    }

    async _transitionToTerminal() {
        await this.terminalTransition.show();
        await this._startTerminalApplication();
    }

    async _startTerminalApplication() {
        try {
            await startTerminal();
        } catch (error) {
            console.error("Failed to start terminal:", error);
        }
    }
}

function initializeBootSequence() {
    const bootSequence = new BootSequence();
    setTimeout(() => bootSequence.play(), BOOT_CONFIG.DELAYS.BOOT_START);
}

window.addEventListener("load", initializeBootSequence);
