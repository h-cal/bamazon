const separator = "-".repeat(30);

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd

// * Adds whitespace to end of string
const padEnd = function padEndOfString(
  originalString,
  targetLength,
  padString
) {
  targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
  padString = String(typeof padString !== "undefined" ? padString : " ");
  if (originalString.length > targetLength) {
    return String(originalString);
  }
  targetLength = targetLength - originalString.length;
  if (targetLength > padString.length) {
    padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
  }
  return String(originalString) + padString.slice(0, targetLength);
};

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart

// * Adds whitespace to end of string
const padStart = function padStartOfString(
  originalString,
  targetLength,
  padString
) {
  targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
  padString = String(typeof padString !== "undefined" ? padString : " ");
  if (originalString.length >= targetLength) {
    return String(originalString);
  } else {
    targetLength = targetLength - originalString.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
    }
    return padString.slice(0, targetLength) + String(originalString);
  }
};

const padCenter = function padStringToCenter(
  originalString,
  targetLength,
  padString
) {
  targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
  padString = String(typeof padString !== "undefined" ? padString : " ");
  if (originalString.length >= targetLength) {
    return String(originalString);
  } else {
    const diff = targetLength - originalString.length;
    const leftLength = Math.ceil(diff / 2) + originalString.length;
    const startPadded = padStart(originalString, leftLength, padString);
    const rightLength = Math.floor(diff / 2) + startPadded.length;
    return padEnd(startPadded, rightLength, padString);
  }
};

module.exports = {
  padStart: padStart,
  padEnd: padEnd,
  padCenter: padCenter,
  separator: separator
};
