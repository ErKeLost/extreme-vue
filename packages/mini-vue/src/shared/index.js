"use strict";
exports.__esModule = true;
exports.hasChange = exports.isObject = exports.extend = void 0;
exports.extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === "object";
};
exports.isObject = isObject;
var hasChange = function (val, newVal) {
    return !Object.is(val, newVal);
};
exports.hasChange = hasChange;
