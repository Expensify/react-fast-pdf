/**
 * Fetch browser name from UA string
 */
const getBrowser = (): string => {
    const {userAgent} = window.navigator;
    const match = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))/i) ?? [];
    let temp: RegExpMatchArray | null;
    let browserName = '';

    if (/trident/i.test(match[1])) {
        return 'IE';
    }

    if (match[1] && match[1].toLowerCase() === 'chrome') {
        temp = userAgent.match(/\b(OPR)/);
        if (temp !== null) {
            return 'Opera';
        }

        temp = userAgent.match(/\b(Edg)/);
        if (temp !== null) {
            return 'Edge';
        }
    }

    browserName = match[1] ?? navigator.appName;

    return browserName ? browserName.toLowerCase() : 'other';
};

/**
 * Checks if requesting user agent is Safari browser on a mobile device
 */
const isMobileSafari = (): boolean => {
    const {userAgent} = window.navigator;

    return /iP(ad|od|hone)/i.test(userAgent) && /WebKit/i.test(userAgent) && !/(CriOS|FxiOS|OPiOS|mercury)/i.test(userAgent);
};

const isSafari = () => getBrowser() === 'safari' || isMobileSafari();

type ListRef = {
    tabIndex: number;
    focus: () => void;
};

/**
 * Sets attributes to list container.
 * It unblocks a default scroll by keyboard of browsers.
 */
const setListAttributes = (ref: ListRef | undefined) => {
    if (!ref) {
        return;
    }

    /**
     *  Useful for elements that should not be navigated to directly using the "Tab" key,
     * but need to have keyboard focus set to them.
     */
    // eslint-disable-next-line no-param-reassign
    ref.tabIndex = -1;
    ref.focus();
};

export {getBrowser, isMobileSafari, isSafari, setListAttributes};
