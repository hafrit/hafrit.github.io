import { Utils } from "./shared/utils.js";

const CONFIG = {
    API_ROOT: "./api/",
    TYPING_SPEED: 14,
    TYPING_DELAY_PUNCTUATION: 30,
    TYPING_DELAY_NEWLINE: 30,
    TYPING_DELAY_END: 70,
    WAIT_BETWEEN_ITEMS: 120,
    WAIT_BETWEEN_SECTIONS: 200,
    AUTOCOMPLETE_TIMEOUT: 2400,
    START_YEAR: 2010,
    CV_PATH: "../file/Hamdi_AFRIT___CV.pdf",
    CV_FILENAME: "Hamdi_AFRIT___CV.pdf",
    PROMPT: "hamdi@terminal:~$ "
};

const COMMANDS = {
    HELP: "help",
    CLEAR: "clear",
    PROFILE: "profile",
    SKILLS: "skills",
    EDUCATION: "education",
    EXPERIENCES: "experiences",
    RESUME: "resume",
    CONTACT: "contact",
    NEXT: "next",
    PREV: "prev",
    CV: "cv"
};

const AVAILABLE_COMMANDS = Object.values(COMMANDS);

class TerminalState {
    constructor() {
        this.experiencesData = [];
        this.pageIndex = 1;
        this.history = [];
        this.historyIdx = -1;
    }

    addToHistory(command) {
        if (!command) return;
        if (this.history[this.history.length - 1] !== command) {
            this.history.push(command);
        }
        this.historyIdx = this.history.length;
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return null;

        if (direction === "up") {
            this.historyIdx = Math.max(0, this.historyIdx - 1);
        } else if (direction === "down") {
            this.historyIdx = Math.min(this.history.length - 1, this.historyIdx + 1);
        }

        return this.history[this.historyIdx] || "";
    }
}

class DOMManager {
    constructor() {
        this.output = document.getElementById("output");
        this.input = document.getElementById("command-input");
    }

    createBlock(kind = "text") {
        const el = document.createElement("div");
        el.className = "block";

        if (kind === "html") el.classList.add("block-html");
        if (kind === "json") el.classList.add("block-json");

        this.output.appendChild(el);
        this.scrollToBottom();

        return el;
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    clearOutput() {
        this.output.innerHTML = "";
    }

    focusInput() {
        this.input.focus();
    }

    getInputValue() {
        return this.input.value.trim();
    }

    clearInput() {
        this.input.value = "";
    }

    setInputValue(value) {
        this.input.value = value;
    }
}

class TypingEngine {
    constructor(domManager) {
        this.dom = domManager;
    }

    async typeToBlock({ text = "", finalHTML = null, speed = CONFIG.TYPING_SPEED } = {}) {
        const block = this.dom.createBlock(finalHTML ? "html" : "text");

        if (finalHTML) {
            block.innerHTML = finalHTML;
            block.className = "block block-html";
        } else {
            block.textContent = text;
        }

        this.dom.scrollToBottom();
        return block;
    }

    renderJSON(obj) {
        const pre = document.createElement("pre");
        pre.className = "block block-json";
        pre.textContent = JSON.stringify(obj, null, 2);
        this.dom.output.appendChild(pre);
        this.dom.scrollToBottom();
        return pre;
    }
}

class HTMLRenderer {
    static profileHTML(profile) {
        const xp = Utils.calculateYearsSince(CONFIG.START_YEAR);
        const descriptionHTML = profile.description
            .map(line => `<div class="profile-description-line">${Utils.escapeHtml(line)}</div>`)
            .join("");

        return `
        <div class="section-title">
            <span class="icon">👤</span> PROFILE
        </div>
        <div class="profile-block">
            <div class="profile-line">
                <span class="green-text">${Utils.escapeHtml(profile.nom)}</span>
                <span class="cyan-text"> — ${Utils.escapeHtml(profile.poste)}</span>
            </div>
            <div class="profile-line">
                <strong>Expérience :</strong>
                <span class="green-text">${xp} ans</span>
            </div>
            <div class="profile-line">
                <strong>Localisation :</strong> ${Utils.escapeHtml(profile.localisation)}
            </div>
            <div class="profile-line">
                <strong>Email :</strong>
                <a href="mailto:${profile.email}" class="link">${Utils.escapeHtml(profile.email)}</a>
            </div>
            <div class="profile-line">
                <strong>LinkedIn :</strong>
                <a href="${profile.linkedin}" target="_blank" class="link">
                    ${Utils.escapeHtml(profile.linkedin)}
                </a>
            </div>
            <div class="profile-description">
                ${descriptionHTML}
            </div>
        </div>`;
    }

    static experienceHTML(experience, index) {
        const { debut, fin, role, company, missions, project, team, technologies } = experience;

        const missionsHTML = missions.length
            ? missions.map(m => `<div class="mission-line"><span class="yellow-text">-</span> ${m}</div>`).join("")
            : "";

        const projectHTML = project
            ? `<div style="margin-top:8px"><strong>PROJECT :</strong> <span class="green-text">${Utils.escapeHtml(project)}</span></div>`
            : "";

        const teamHTML = team
            ? `<div style="margin-top:10px"><strong>team :</strong> <span class="text-main">${team}</span></div>`
            : "";

        const techHTML = technologies.length
            ? `<div style="margin-top:10px"><strong>technologies :</strong><div style="margin-top:6px; color:var(--text-main)">${technologies.join(` <span class="yellow-text">-</span> `)}</div></div>`
            : "";

        return `
        <div class="experience-block">
            <div class="experience-header">
                <span class="cyan-text">[${index}]</span>
                &nbsp;
                <span class="cyan-text">${debut}</span>
                <span style="color:var(--text-muted)"> → </span>
                <span class="cyan-text">${fin}</span>
                &nbsp; : &nbsp;
                <span class="green-text">${role}</span>
                &nbsp; <span style="color:var(--text-muted)">@</span> &nbsp;
                <span class="cyan-text">${company}</span>
            </div>
            ${missionsHTML ? `<div style="margin-top:10px"><strong>missions :</strong>${missionsHTML}</div>` : ""}
            ${projectHTML}
            ${teamHTML}
            ${techHTML}
        </div>`;
    }

    static paginationHTML(current, end, total) {
        const prevHint = current > 1 ? `<span style="color:var(--ubuntu-orange)"> • Tapez 'prev'</span>` : "";
        const nextHint = current < total ? `<span style="color:var(--ubuntu-orange)"> • Tapez 'next'</span>` : "";

        return `
        <div style="margin-top:14px;">
            <span class="cyan-text">Exp ${current}</span>
            <span style="color:var(--text-muted)"> → </span>
            <span class="yellow-text">${end}</span>
            <span style="color:var(--text-muted)"> / </span>
            <span class="green-text">${total}</span>
            <span style="color:var(--text-muted)"> total</span>
            ${prevHint}
            ${nextHint}
        </div>`;
    }
}

class ExperienceFormatter {
    static format(experienceData, index) {
        const experience = {
            debut: Utils.escapeHtml(experienceData.debut || "?"),
            fin: Utils.escapeHtml(experienceData.fin || "?"),
            role: Utils.escapeHtml(experienceData.role || ""),
            company: Utils.escapeHtml(experienceData.company || ""),
            team: Utils.escapeHtml(experienceData.team || ""),
            missions: (experienceData.missions || experienceData.tasks || []).map(m => Utils.escapeHtml(m)),
            project: experienceData.project || experienceData.PROJECT || null,
            technologies: (experienceData.technologies || []).map(t => Utils.escapeHtml(t))
        };

        const plainText = this._buildPlainText(experience, index);
        const html = HTMLRenderer.experienceHTML(experience, index);

        return { plainText, html };
    }

    static _buildPlainText(exp, index) {
        const lines = [];
        lines.push(`[${index}]   ${exp.debut} → ${exp.fin} : ${exp.role} @ ${exp.company}`);
        lines.push("");

        if (exp.missions.length) {
            lines.push("missions:");
            exp.missions.forEach(m => lines.push(`- ${m}`));
        }

        if (exp.project) {
            lines.push("");
            lines.push(`PROJECT: ${Utils.escapeHtml(exp.project)}`);
        }

        if (exp.team) {
            lines.push("");
            lines.push(`team: ${exp.team}`);
        }

        if (exp.technologies.length) {
            lines.push("");
            lines.push(`technologies: ${exp.technologies.join(" - ")}`);
        }

        return lines.join("\n") + "\n";
    }
}

class CommandHandler {
    constructor(state, domManager, typingEngine) {
        this.state = state;
        this.dom = domManager;
        this.typing = typingEngine;
    }

    async execute(commandLine) {
        const trimmed = (commandLine || "").trim();
        if (!trimmed) return;

        this.state.addToHistory(trimmed);
        this._echoCommand(trimmed);

        const parts = trimmed.split(/\s+/).filter(Boolean);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        try {
            await this._dispatch(command, args);
        } catch (err) {
            await this.typing.typeToBlock({
                text: `Erreur : ${err.message}\n`,
                speed: 6
            });
            console.error(err);
        }
    }

    _echoCommand(command) {
        const block = this.dom.createBlock();
        block.innerHTML = `<span class="cyan-text">${CONFIG.PROMPT}</span>${Utils.escapeHtml(command)}`;
    }

    async _dispatch(command, args) {
        const commandMap = {
            [COMMANDS.HELP]: () => this._cmdHelp(),
            [COMMANDS.CLEAR]: () => this._cmdClear(),
            [COMMANDS.PROFILE]: () => this._cmdProfile(),
            [COMMANDS.SKILLS]: () => this._cmdSkills(),
            [COMMANDS.EDUCATION]: () => this._cmdEducation(),
            [COMMANDS.EXPERIENCES]: () => this._cmdExperiences(args),
            [COMMANDS.RESUME]: () => this._cmdResume(),
            [COMMANDS.CONTACT]: () => this._cmdContact(),
            [COMMANDS.NEXT]: () => this._cmdNext(),
            [COMMANDS.PREV]: () => this._cmdPrev(),
            [COMMANDS.CV]: () => this._cmdCV()
        };

        const handler = commandMap[command];

        if (handler) {
            await handler();
        } else {
            await this.typing.typeToBlock({
                text: `Commande inconnue : ${command}\n`,
                speed: 8
            });
        }
    }

    async _cmdHelp() {
        const commands = [
            { name: "help", desc: "affiche l'aide" },
            { name: "profile", desc: "affiche le profil" },
            { name: "skills", desc: "affiche les compétences" },
            { name: "education", desc: "affiche la formation" },
            { name: "experiences <p> <l>", desc: "affiche les expériences (page, limit)" },
            { name: "next", desc: "page suivante des expériences" },
            { name: "prev", desc: "page précédente des expériences" },
            { name: "resume", desc: "lecture complète" },
            { name: "cv", desc: "télécharger le CV au format PDF" },
            { name: "contact", desc: "infos contact" },
            { name: "clear", desc: "efface le terminal" }
        ];

        const plain = commands.map(c => `${c.name.padEnd(27)} → ${c.desc}`).join("\n") + "\n";

        const html = `
        <div class="section-title">
            <span class="icon">📘</span> <span class="cyan-text">COMMANDES DISPONIBLES</span>
        </div>
        <div class="help-table">
            ${commands.map(c => `<div><span class="yellow-text">${Utils.escapeHtml(c.name)}</span> → ${c.desc}</div>`).join("")}
        </div>`;

        await this.typing.typeToBlock({ text: plain, finalHTML: html, speed: 8 });
    }

    _cmdClear() {
        this.dom.clearOutput();
    }

    async _cmdProfile() {
        const profile = await Utils.fetchJSON(CONFIG.API_ROOT + "profile.json");
        const xp = Utils.calculateYearsSince(CONFIG.START_YEAR);

        const plain = [
            `${profile.nom} — ${profile.poste}`,
            `Expérience : ${xp} ans`,
            `Localisation : ${profile.localisation}`,
            `Email : ${profile.email}`,
            `LinkedIn : ${profile.linkedin}`,
            ...profile.description.map(l => `- ${l}`),
            ""
        ].join("\n");

        await this.typing.typeToBlock({
            text: plain,
            finalHTML: HTMLRenderer.profileHTML(profile),
            speed: 10
        });
    }

    async _cmdSkills() {
        const skills = await Utils.fetchJSON(CONFIG.API_ROOT + "skills.json");
        let plain = "";
        let html = `<div><span class="cyan-text">🧠 COMPÉTENCES</span></div>`;

        for (const [category, items] of Object.entries(skills)) {
            plain += `${category} → ${items.join(", ")}\n`;
            html += `<div style="margin-top:6px"><span class="green-text">${Utils.escapeHtml(category)}</span> → ${Utils.escapeHtml(items.join(", "))}</div>`;
        }

        await this.typing.typeToBlock({ text: plain, finalHTML: html, speed: 8 });
    }

    async _cmdEducation() {
        const education = await Utils.fetchJSON(CONFIG.API_ROOT + "education.json");

        for (const item of education) {
            await this.typing.typeToBlock({
                text: `${item.debut} → ${item.fin} — ${item.titre} (${item.ecole})\n`,
                speed: 10
            });
        }
    }

    async _cmdExperiences(args) {
        const page = args[0] ? Number(args[0]) : 1;
        const limit = args[1] ? Number(args[1]) : 1;
        await this._showExperiences(page, limit);
    }

    async _cmdNext() {
        await this._showExperiences(this.state.pageIndex + 1, 1);
    }

    async _cmdPrev() {
        await this._showExperiences(this.state.pageIndex - 1, 1);
    }

    async _showExperiences(page, limit) {
        const total = this.state.experiencesData.length;

        if (total === 0) {
            await this.typing.typeToBlock({ text: "Aucune expérience disponible.\n" });
            return;
        }

        const currentPage = Math.max(1, page);
        const safeLimit = Math.max(1, limit);
        const startIndex = currentPage - 1;

        if (startIndex >= total) {
            await this.typing.typeToBlock({ text: `Page ${currentPage} hors limite (max ${total}).\n` });
            return;
        }

        this.state.pageIndex = currentPage;

        for (let i = 0; i < safeLimit; i++) {
            const index = startIndex + i;
            if (index >= total) break;

            await this._showSingleExperience(index + 1);
        }

        const endIndex = Math.min(startIndex + safeLimit, total);
        await this._showPagination(currentPage, endIndex, total);
    }

    async _showSingleExperience(index) {
        const experienceData = this.state.experiencesData[index - 1];

        if (!experienceData) {
            await this.typing.typeToBlock({ text: "Aucune expérience.\n" });
            return;
        }

        const { plainText, html } = ExperienceFormatter.format(experienceData, index);
        await this.typing.typeToBlock({ text: plainText, finalHTML: html, speed: 10 });
    }

    async _showPagination(current, end, total) {
        const plainText = `Exp ${current} → ${end} / ${total}\n`;
        const html = HTMLRenderer.paginationHTML(current, end, total);

        await this.typing.typeToBlock({
            text: plainText,
            finalHTML: html,
            speed: 6
        });
    }

    async _cmdResume() {
        this.dom.clearOutput();

        const [profile, skills, education, experiences] = await Promise.all([
            Utils.fetchJSON(CONFIG.API_ROOT + "profile.json"),
            Utils.fetchJSON(CONFIG.API_ROOT + "skills.json"),
            Utils.fetchJSON(CONFIG.API_ROOT + "education.json"),
            Utils.fetchJSON(CONFIG.API_ROOT + "experiences.json")
        ]);

        await this.typing.typeToBlock({
            text: `${profile.nom} — ${profile.poste}\n${profile.description}\n`,
            finalHTML: HTMLRenderer.profileHTML(profile),
            speed: 10
        });

        await this._cmdSkills();
        await this._cmdEducation();

        for (const exp of experiences) {
            const plain = `${exp.debut} → ${exp.fin} — ${exp.role} @ ${exp.company}\n${(exp.missions || exp.tasks || []).join("\n")}\n`;
            await this.typing.typeToBlock({ text: plain, finalHTML: null, speed: 9 });
        }
    }

    async _cmdContact() {
        const profile = await Utils.fetchJSON(CONFIG.API_ROOT + "profile.json");

        const plain = `Email: ${profile.email}\nPhone: ${profile.telephone}\nLinkedIn: ${profile.linkedin}\n`;

        const html = `
        <div><span class="cyan-text">✉️ CONTACT</span></div>
        <div>Email: <a href="mailto:${encodeURIComponent(profile.email)}" target="_blank">${Utils.escapeHtml(profile.email)}</a></div>
        <div>Phone: ${Utils.escapeHtml(profile.telephone)}</div>
        <div>LinkedIn: <a href="${Utils.escapeHtml(profile.linkedin)}" target="_blank">${Utils.escapeHtml(profile.linkedin)}</a></div>`;

        await this.typing.typeToBlock({ text: plain, finalHTML: html, speed: 8 });
    }

    async _cmdCV() {
        await this.typing.typeToBlock({ text: "Téléchargement du CV…\n", speed: 10 });
        Utils.downloadFile(CONFIG.CV_PATH, CONFIG.CV_FILENAME);
        await this.typing.typeToBlock({ text: "✔ CV téléchargé.\n", speed: 10 });
    }
}

class AutocompleteHandler {
    constructor(domManager) {
        this.dom = domManager;
    }

    handle(input) {
        const value = input.trim();
        if (!value) return;

        const matches = AVAILABLE_COMMANDS.filter(cmd => cmd.startsWith(value));

        if (matches.length === 1) {
            this.dom.setInputValue(matches[0] + " ");
        } else if (matches.length > 1) {
            this._showSuggestions(matches);
        }
    }

    _showSuggestions(matches) {
        const block = this.dom.createBlock();
        block.textContent = matches.join("    ");
        setTimeout(() => block.remove(), CONFIG.AUTOCOMPLETE_TIMEOUT);
    }
}

class Terminal {
    constructor() {
        this.state = new TerminalState();
        this.dom = new DOMManager();
        this.typing = new TypingEngine(this.dom);
        this.commandHandler = new CommandHandler(this.state, this.dom, this.typing);
        this.autocomplete = new AutocompleteHandler(this.dom);
    }

    async initialize() {
        await this._loadData();
        await this.typing.typeToBlock({ text: "Tapez 'help' pour commencer\n", speed: 8 });
        this.dom.focusInput();
        this._setupEventListeners();
    }

    async _loadData() {
        try {
            this.state.experiencesData = await Utils.fetchJSON(CONFIG.API_ROOT + "experiences.json");
        } catch (error) {
            console.error("Failed to load experiences:", error);
            this.state.experiencesData = [];
        }
    }

    _setupEventListeners() {
        // Prevent form submission from refreshing the page
        const form = this.dom.input.closest('form');
        if (form) {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
            });
        }

        this.dom.input.addEventListener("keydown", async (event) => {
            await this._handleKeyPress(event);
        });
    }

    async _handleKeyPress(event) {
        const handlers = {
            "Enter": () => this._handleEnter(),
            "Tab": (e) => this._handleTab(e),
            "ArrowUp": () => this._handleArrowUp(),
            "ArrowDown": () => this._handleArrowDown()
        };

        const handler = handlers[event.key];
        if (handler) {
            await handler(event);
        }
    }

    async _handleEnter() {
        const command = this.dom.getInputValue();
        this.dom.clearInput();
        await this.commandHandler.execute(command);
    }

    _handleTab(event) {
        event.preventDefault();
        const value = this.dom.getInputValue();
        this.autocomplete.handle(value);
    }

    _handleArrowUp() {
        const command = this.state.navigateHistory("up");
        if (command !== null) {
            this.dom.setInputValue(command);
        }
    }

    _handleArrowDown() {
        const command = this.state.navigateHistory("down");
        if (command !== null) {
            this.dom.setInputValue(command);
        }
    }
}

export async function startTerminal() {
    const terminal = new Terminal();
    await terminal.initialize();
}
