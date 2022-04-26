/**
 * Returns encoded binary string.
 */
declare function encode(message: string): string;
/**
 * Detects error position in encoded message.
 */
declare function detect(encoded: string): number;
/**
 * Returns decoded binary string message.
 */
declare function decode(error: string): string;

export { decode, detect, encode };
