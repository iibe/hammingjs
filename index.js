function encode(keyword) {
  if (typeof keyword !== "string" || keyword.match(/[^10]/)) {
    throw new Error("Keyword should be a binary string. E.g 101011");
  }

  // calculate control bits positions
  const indexes = [];
  while (
    indexes.length < Math.ceil(Math.log2(keyword.length + 1 + indexes.length))
  ) {
    indexes.push(2 ** indexes.length - 1);
  }

  // insert control bits in keyword
  for (let index of indexes) {
    keyword = insert(keyword, index, "0");
  }

  // create a table of transformation
  const table = [keyword];
  for (let index of indexes) {
    // create specific row for i-th control bit
    table.push(replace(keyword, index, "1"));
  }

  // place col number in binary format at according col position
  for (let col = 0; col < keyword.length; col++) {
    const binary = ((col + 1) >>> 0).toString(2).padStart(indexes.length, "0");

    for (let row = 1; row <= indexes.length; row++) {
      table[row] = replace(table[row], col, binary[binary.length - row]);
    }
  }

  // calculate matches with control word
  for (let i = 1; i < table.length; i++) {
    let match = 0;
    for (let j = 0; j < table[0].length; j++) {
      if (table[0][j] === "1" && table[i][j] === table[0][j]) match++;
    }

    keyword = replace(keyword, indexes[i - 1], (match % 2).toString());
  }

  return keyword;
}

console.log(encode("100100101110001"));

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
