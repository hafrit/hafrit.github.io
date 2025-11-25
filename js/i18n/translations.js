export const TRANSLATIONS = {
    fr: {
        boot: {
            init: "Initialisation de la machine virtuelle...",
            loadingModules: "Chargement des modules noyau",
            shellStart: "Démarrage du shell sécurisé...",
            connecting: "Connexion au profil: Hamdi AFRIT",
            connected: "Connexion établie."
        },
        terminal: {
            welcome: "Tapez 'help' pour commencer",
            prompt: "hamdi@terminal:~$"
        },
        commands: {
            help: {
                name: "help",
                desc: "affiche l'aide"
            },
            profile: {
                name: "profile",
                desc: "affiche le profil"
            },
            skills: {
                name: "skills",
                desc: "affiche les compétences"
            },
            education: {
                name: "education",
                desc: "affiche la formation"
            },
            experiences: {
                name: "experiences <p> <l>",
                desc: "affiche les expériences (page, limit)"
            },
            next: {
                name: "next",
                desc: "page suivante des expériences"
            },
            prev: {
                name: "prev",
                desc: "page précédente des expériences"
            },
            resume: {
                name: "resume",
                desc: "lecture complète"
            },
            cv: {
                name: "cv",
                desc: "télécharger le CV au format PDF"
            },
            contact: {
                name: "contact",
                desc: "infos contact"
            },
            clear: {
                name: "clear",
                desc: "efface le terminal"
            },
            lang: {
                name: "lang <fr|en>",
                desc: "change la langue (fr/en)"
            }
        },
        ui: {
            commandsAvailable: "COMMANDES DISPONIBLES",
            profile: "PROFILE",
            skills: "COMPÉTENCES",
            contact: "CONTACT",
            experience: "Expérience",
            location: "Localisation",
            missions: "missions",
            project: "PROJECT",
            team: "team",
            technologies: "technologies",
            total: "total",
            prevHint: "Tapez 'prev'",
            nextHint: "Tapez 'next'",
            downloading: "Téléchargement du CV…",
            downloaded: "✔ CV téléchargé.",
            noExperience: "Aucune expérience disponible.",
            noExperienceFound: "Aucune expérience.",
            pageOutOfRange: "Page {page} hors limite (max {max}).",
            unknownCommand: "Commande inconnue : {cmd}",
            error: "Erreur : {msg}",
            languageChanged: "✔ Langue changée en français",
            invalidLanguage: "Langue invalide. Utilisez 'lang fr' ou 'lang en'"
        },
        footer: "TAB = autocomplétion • ↑/↓ = historique • 'resume' = lecture complète • 'lang' = changer langue"
    },
    en: {
        boot: {
            init: "Initializing virtual machine...",
            loadingModules: "Loading kernel modules",
            shellStart: "Starting secure shell...",
            connecting: "Connecting to profile: Hamdi AFRIT",
            connected: "Connection established."
        },
        terminal: {
            welcome: "Type 'help' to start",
            prompt: "hamdi@terminal:~$"
        },
        commands: {
            help: {
                name: "help",
                desc: "display help"
            },
            profile: {
                name: "profile",
                desc: "display profile"
            },
            skills: {
                name: "skills",
                desc: "display skills"
            },
            education: {
                name: "education",
                desc: "display education"
            },
            experiences: {
                name: "experiences <p> <l>",
                desc: "display experiences (page, limit)"
            },
            next: {
                name: "next",
                desc: "next page of experiences"
            },
            prev: {
                name: "prev",
                desc: "previous page of experiences"
            },
            resume: {
                name: "resume",
                desc: "full reading"
            },
            cv: {
                name: "cv",
                desc: "download CV as PDF"
            },
            contact: {
                name: "contact",
                desc: "contact info"
            },
            clear: {
                name: "clear",
                desc: "clear terminal"
            },
            lang: {
                name: "lang <fr|en>",
                desc: "change language (fr/en)"
            }
        },
        ui: {
            commandsAvailable: "AVAILABLE COMMANDS",
            profile: "PROFILE",
            skills: "SKILLS",
            contact: "CONTACT",
            experience: "Experience",
            location: "Location",
            missions: "missions",
            project: "PROJECT",
            team: "team",
            technologies: "technologies",
            total: "total",
            prevHint: "Type 'prev'",
            nextHint: "Type 'next'",
            downloading: "Downloading CV…",
            downloaded: "✔ CV downloaded.",
            noExperience: "No experience available.",
            noExperienceFound: "No experience.",
            pageOutOfRange: "Page {page} out of range (max {max}).",
            unknownCommand: "Unknown command: {cmd}",
            error: "Error: {msg}",
            languageChanged: "✔ Language changed to English",
            invalidLanguage: "Invalid language. Use 'lang fr' or 'lang en'"
        },
        footer: "TAB = autocomplete • ↑/↓ = history • 'resume' = full reading • 'lang' = change language"
    }
};
