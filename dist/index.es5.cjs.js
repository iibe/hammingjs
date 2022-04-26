'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}
function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function encode(message) {
    var e_1, _a;
    if (!message.match(/^[01]+$/)) {
        throw new Error("Should be a binary string: ".concat(message));
    }
    var controlBits = [];
    while (controlBits.length <
        Math.ceil(Math.log2(message.length + controlBits.length + 1))) {
        controlBits.push((1 << controlBits.length) - 1);
    }
    var bitword = __spreadArray([], __read(message), false);
    try {
        for (var controlBits_1 = __values(controlBits), controlBits_1_1 = controlBits_1.next(); !controlBits_1_1.done; controlBits_1_1 = controlBits_1.next()) {
            var bit = controlBits_1_1.value;
            bitword.splice(bit, 0, "0");
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (controlBits_1_1 && !controlBits_1_1.done && (_a = controlBits_1.return)) _a.call(controlBits_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var table = __spreadArray([
        bitword
    ], __read(Array.from({ length: controlBits.length }, function () { return []; })), false);
    for (var col = 1; col <= bitword.length; col++) {
        var binary = (col >>> 0)
            .toString(2)
            .padStart(controlBits.length, "0");
        for (var row = 1; row <= controlBits.length; row++) {
            table[row].push(binary[binary.length - row]);
        }
    }
    for (var row = 1; row < table.length; row++) {
        var match = 0;
        for (var col = 0; col < bitword.length; col++) {
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
        throw new Error("Should be a binary string: ".concat(encoded));
    }
    var controlBits = [];
    while (controlBits.length <
        Math.ceil(Math.log2(encoded.length + controlBits.length + 1))) {
        controlBits.push((1 << controlBits.length) - 1);
    }
    var bitword = __spreadArray([], __read(encoded), false);
    var table = __spreadArray([
        bitword
    ], __read(Array.from({ length: controlBits.length }, function () { return []; })), false);
    for (var col = 1; col <= bitword.length; col++) {
        var binary = (col >>> 0)
            .toString(2)
            .padStart(controlBits.length, "0");
        for (var row = 1; row <= controlBits.length; row++) {
            table[row].push(binary[binary.length - row]);
        }
    }
    var error = [];
    for (var row = 1; row < table.length; row++) {
        var match = 0;
        for (var col = 0; col < bitword.length; col++) {
            if (table[row][col] === bitword[col] && bitword[col] === "1") {
                match++;
            }
        }
        error.push(match % 2);
    }
    return parseInt(error.reverse().join(""), 2) - 1;
}
function decode(error) {
    var bug = detect(error);
    var fix = error[bug] === "0" ? "1" : "0";
    var err = __spreadArray([], __read(error), false);
    err[bug] = fix;
    return __spreadArray([], __read(err), false).join("");
}

exports.decode = decode;
exports.detect = detect;
exports.encode = encode;
