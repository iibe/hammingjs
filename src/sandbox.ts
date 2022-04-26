import { encode, detect, decode } from "~/hamming";

/**
 * ArrayBuffer is, in fact, a byte (or 8-bit) array.
 * JavaScript string is a finite ordered sequence of zero or more 16-bit unsigned integer.
 * Therefore, we need 16 (or 8 * 2) bit to represent string character.
 */
export function bufferize(message: string): [ArrayBuffer, Uint16Array] {
  const buffer: ArrayBuffer = new ArrayBuffer(message.length * 2);
  const view: Uint16Array = new Uint16Array(buffer);

  for (let i = 0; i < message.length; i++) {
    view[i] = message.charCodeAt(i);
  }

  console.log(buffer.byteLength, view.byteLength); // 22 22
  console.log(view.length, view.BYTES_PER_ELEMENT); // 11 2
  // console.log(buffer, view);

  console.log(view[2]); // ł = 322
  console.log(view[2].toString(2).padStart(16, "0")); // ł = 0000000101000010

  return [buffer, view];
}

// bufferize("Hełło worłd");

const bit16: string = "100100101110001"; // 16-bit binary string
const encoded: string = "11110010001011110001"; // encoded string
const error: string = "11110110001011110001"; // 6th bit error

console.log(bit16);
console.log();
console.log(encoded);
console.log(encode(bit16));
console.log();
console.log(encoded);
console.log(error);
console.log(detect(error));
console.log();
console.log(encoded);
console.log(decode(error));
