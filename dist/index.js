function encode(message) {
    if (!message.match(/^[01]+$/)) {
        throw new Error(`Should be a binary string: ${message}`);
    }
    const controlBits = [];
    while (controlBits.length <
        Math.ceil(Math.log2(message.length + controlBits.length + 1))) {
        controlBits.push((1 << controlBits.length) - 1);
    }
    const bitword = [...message];
    for (const bit of controlBits) {
        bitword.splice(bit, 0, "0");
    }
    const table = [
        bitword,
        ...Array.from({ length: controlBits.length }, () => []),
    ];
    for (let col = 1; col <= bitword.length; col++) {
        const binary = (col >>> 0)
            .toString(2)
            .padStart(controlBits.length, "0");
        for (let row = 1; row <= controlBits.length; row++) {
            table[row].push(binary[binary.length - row]);
        }
    }
    for (let row = 1; row < table.length; row++) {
        let match = 0;
        for (let col = 0; col < bitword.length; col++) {
            if (table[row][col] === bitword[col] && bitword[col] === "1") {
                match++;
            }
        }
        bitword[controlBits[row - 1]] = (match % 2).toString();
    }
    return bitword.join("");
}
function detect(encoded) {
    if (!encoded.match(/^[01]+$/)) {
        throw new Error(`Should be a binary string: ${encoded}`);
    }
    const controlBits = [];
    while (controlBits.length <
        Math.ceil(Math.log2(encoded.length + controlBits.length + 1))) {
        controlBits.push((1 << controlBits.length) - 1);
    }
    const bitword = [...encoded];
    const table = [
        bitword,
        ...Array.from({ length: controlBits.length }, () => []),
    ];
    for (let col = 1; col <= bitword.length; col++) {
        const binary = (col >>> 0)
            .toString(2)
            .padStart(controlBits.length, "0");
        for (let row = 1; row <= controlBits.length; row++) {
            table[row].push(binary[binary.length - row]);
        }
    }
    const error = [];
    for (let row = 1; row < table.length; row++) {
        let match = 0;
        for (let col = 0; col < bitword.length; col++) {
            if (table[row][col] === bitword[col] && bitword[col] === "1") {
                match++;
            }
        }
        error.push(match % 2);
    }
    return parseInt(error.reverse().join(""), 2) - 1;
}
function decode(error) {
    const bug = detect(error);
    const fix = error[bug] === "0" ? "1" : "0";
    const err = [...error];
    err[bug] = fix;
    return [...err].join("");
}

export { decode, detect, encode };
