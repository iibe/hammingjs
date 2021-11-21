function encode(bitword) {
  if (bitword.match(/[^10]/) && bitword.length > 0) {
    throw new Error("It should be a binary string. E.g 101011");
  }

  // find control bits positions
  const indexes = [];
  while (
    indexes.length < Math.ceil(Math.log2(bitword.length + indexes.length + 1))
  ) {
    indexes.push(2 ** indexes.length - 1);
  }

  // insert control bits in bitword
  for (const index of indexes) {
    bitword = insert(bitword, index, "0");
  }

  // initialize a table of transformation
  const table = [bitword];
  for (const _ of indexes) {
    table.push("");
  }

  // put col number (in binary format) at according col position
  for (let col = 0; col < bitword.length; col++) {
    const bin = ((col + 1) >>> 0).toString(2).padStart(indexes.length, "0");

    for (let row = 1; row < indexes.length + 1; row++) {
      table[row] = table[row].concat(bin[bin.length - row]);
    }
  }

  // calculate matches with control word
  for (let row = 1; row < table.length; row++) {
    let match = 0;
    for (let col = 0; col < table[0].length; col++) {
      if (table[0][col] === "1" && table[0][col] === table[row][col]) {
        match++;
      }
    }

    bitword = replace(bitword, indexes[row - 1], (match % 2).toString());
  }

  return bitword;
}

function decode(bitword) {
  if (bitword.match(/[^10]/) && bitword.length > 0) {
    throw new Error("It should be a binary string. E.g 101011");
  }

  // find control bits positions
  const indexes = [0, 1];
  while (2 ** indexes.length < bitword.length) {
    indexes.push(2 ** indexes.length - 1);
  }

  // initialize a table of transformation
  const table = [bitword];
  for (const _ of indexes) {
    table.push("");
  }

  // put col number (in binary format) at according col position
  for (let col = 0; col < bitword.length; col++) {
    const bin = ((col + 1) >>> 0).toString(2).padStart(indexes.length, "0");

    for (let row = 1; row < indexes.length + 1; row++) {
      table[row] = table[row].concat(bin[bin.length - row]);
    }
  }

  // calculate matches with control word
  const error = [];
  for (let row = 1; row < table.length; row++) {
    let match = 0;
    for (let col = 0; col < table[0].length; col++) {
      if (table[0][col] === "1" && table[0][col] === table[row][col]) {
        match++;
      }
    }

    error.push(match % 2);
  }

  return parseInt(error.reverse().join(""), 2);
}

const v = "100100101110001"; // initial value
const i = encode(v); // encoded input
const e = replace(i, 5, "1"); // 6th bit error
const o = decode(e); // detected error position
console.log("V:", v);
console.log("I:", i);
console.log("E:", e);
console.log("O:", o);

/**
 *
 * @param {string} string Base string.
 * @param {number} index Index from which to insert the `value`.
 * @param {string} value Insert value.
 * @return String with with `value` inserted from `index` position.
 */
function insert(string, index, value) {
  return string.slice(0, index) + value + string.slice(index);
}

/**
 *
 * @param {string} string Base string.
 * @param {number} index Index from which to replace the `value`.
 * @param {string} value Replace value.
 * @return String with with `value` replaced from `index` position.
 */
function replace(string, index, value) {
  return string.slice(0, index) + value + string.slice(index + value.length);
}
