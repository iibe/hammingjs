console.log("Hamming.js");

/**
 * Returns encoded binary string.
 */
export function encode(message: string): string {
  if (!message.match(/^[01]+$/)) {
    throw new Error(`Should be a binary string: ${message}`);
  }

  // find control bits positions
  const controlBits: number[] = [];
  while (
    controlBits.length <
    Math.ceil(Math.log2(message.length + controlBits.length + 1))
  ) {
    controlBits.push((1 << controlBits.length) - 1);
  }

  // transfort bitword to array for mutability
  const bitword: string[] = [...message];

  // insert control bits in bitword
  for (const bit of controlBits) {
    bitword.splice(bit, 0, "0");
  }

  // initialize a table of transformation
  const table: string[][] = [
    bitword,
    ...Array.from({ length: controlBits.length }, () => []),
  ];

  // put col number (in binary format) at according col position
  for (let col = 1; col <= bitword.length; col++) {
    const binary: string = (col >>> 0)
      .toString(2)
      .padStart(controlBits.length, "0");
    for (let row = 1; row <= controlBits.length; row++) {
      table[row].push(binary[binary.length - row]);
    }
  }

  // calculate matches for bitword with control bits
  for (let row = 1; row < table.length; row++) {
    let match: number = 0;
    for (let col = 0; col < bitword.length; col++) {
      if (table[row][col] === bitword[col] && bitword[col] === "1") {
        match++;
      }
    }
    bitword[controlBits[row - 1]] = (match % 2).toString();
  }

  return bitword.join("");
}

/**
 * Detects error position in encoded message.
 */
export function detect(encoded: string): number {
  if (!encoded.match(/^[01]+$/)) {
    throw new Error(`Should be a binary string: ${encoded}`);
  }

  // find control bits positions
  const controlBits: number[] = [];
  while (
    controlBits.length <
    Math.ceil(Math.log2(encoded.length + controlBits.length + 1))
  ) {
    controlBits.push((1 << controlBits.length) - 1);
  }

  // transfort bitword to array for mutability
  const bitword: string[] = [...encoded];

  // initialize a table of transformation
  const table: string[][] = [
    bitword,
    ...Array.from({ length: controlBits.length }, () => []),
  ];

  // put col number (in binary format) at according col position
  for (let col = 1; col <= bitword.length; col++) {
    const binary: string = (col >>> 0)
      .toString(2)
      .padStart(controlBits.length, "0");
    for (let row = 1; row <= controlBits.length; row++) {
      table[row].push(binary[binary.length - row]);
    }
  }

  // error position in binary representation
  const error: number[] = [];

  // calculate matches for bitword with control bits
  for (let row = 1; row < table.length; row++) {
    let match: number = 0;
    for (let col = 0; col < bitword.length; col++) {
      if (table[row][col] === bitword[col] && bitword[col] === "1") {
        match++;
      }
    }
    error.push(match % 2);
  }

  // return error position
  return parseInt(error.reverse().join(""), 2) - 1;
}

/**
 * Returns decoded binary string message.
 */
export function decode(error: string): string {
  const bug: number = detect(error);
  const fix: string = error[bug] === "0" ? "1" : "0";
  const err: string[] = [...error];
  err[bug] = fix;
  return [...err].join("");
}
