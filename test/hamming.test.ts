import { encode, detect, decode } from "../src/hamming";

const message: string = "100100101110001"; // 16-bit binary string
const encoded: string = "11110010001011110001"; // encoded string
const pitfall: string = "11110110001011110001"; // 6th bit error
const binaryCodeRegex: RegExp = /^[01]+$/;

test("validate mock data", () => {
  expect(message).toMatch(binaryCodeRegex);
  expect(encoded).toMatch(binaryCodeRegex);
  expect(pitfall).toMatch(binaryCodeRegex);
  expect(message.length).toBeGreaterThan(0);
  expect(encoded.length).toBe(pitfall.length);
  expect(encoded).not.toBe(pitfall);
});

describe("hamming code", () => {
  test("should encode message", () => {
    expect(encode(message)).toBe(encoded);
  });

  test("should detect error position", () => {
    expect(detect(pitfall)).toBe(5);
  });

  test("should decode message back", () => {
    expect(decode(pitfall)).toBe(encoded);
  });
});
