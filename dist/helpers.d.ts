/**
 * Fetch browser name from UA string
 */
declare const getBrowser: () => string;
/**
 * Checks if requesting user agent is Safari browser on a mobile device
 */
declare const isMobileSafari: () => boolean;
declare const isSafari: () => boolean;
type ListRef = {
    tabIndex: number;
};
/**
 * Sets attributes to list container.
 * It unblocks a default scroll by keyboard of browsers.
 */
declare const setListAttributes: (ref: ListRef | undefined) => void;
export { getBrowser, isMobileSafari, isSafari, setListAttributes };
//# sourceMappingURL=helpers.d.ts.map