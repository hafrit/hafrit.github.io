export const SHARED_CONFIG = {
    WAIT_SHORT: 50,
    WAIT_MEDIUM: 200,
    WAIT_LONG: 600,
    WAIT_EXTRA_LONG: 800,

    TRANSITION_FAST: "320ms",
    TRANSITION_MEDIUM: "450ms",
    TRANSITION_SLOW: "500ms",

    PROFILE_NAME: "Hamdi AFRIT",
    START_YEAR: 2010
};

export const BOOT_CONFIG = {
    PROGRESS_BAR_LENGTH: 20,
    PROGRESS_SPEED_MS: 25,
    PROGRESS_START: 0,
    PROGRESS_END: 100,

    DELAYS: {
        INITIAL: 800,
        SHELL_START: 600,
        PROFILE_CONNECT: 700,
        CONNECTION_ESTABLISHED: 700,
        BOOT_START: 160
    },

    ANIMATION: {
        OPACITY_DURATION: "500ms",
        TRANSFORM_DURATION: "450ms",
        INITIAL_SCALE: 0.995,
        INITIAL_TRANSLATE_Y: "-46%",
        FINAL_SCALE: 1,
        FINAL_TRANSLATE_Y: "-50%",
        DELAY_BEFORE_SCALE: 50
    },

    MESSAGES: {
        INIT: "Initializing virtual machine...",
        LOADING_MODULES: "Loading kernel modules",
        SHELL_START: "Starting secure shell...",
        CONNECTING: `Connecting to profile: ${SHARED_CONFIG.PROFILE_NAME}`,
        CONNECTED: "Connection established."
    }
};
