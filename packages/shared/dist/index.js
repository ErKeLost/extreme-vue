"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ShapeFlags: () => ShapeFlags,
  camelize: () => camelize,
  capitalize: () => capitalize,
  extend: () => extend,
  hasChanged: () => hasChanged,
  hasOwn: () => hasOwn,
  hyphenate: () => hyphenate,
  isObject: () => isObject,
  isOn: () => isOn,
  isString: () => isString,
  toDisplayString: () => toDisplayString,
  toHandlerKey: () => toHandlerKey
});
module.exports = __toCommonJS(src_exports);

// src/shapeFlags.ts
var ShapeFlags = /* @__PURE__ */ ((ShapeFlags2) => {
  ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
  ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
  ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
  ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
  ShapeFlags2[ShapeFlags2["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
  return ShapeFlags2;
})(ShapeFlags || {});

// src/toDisplayString.ts
var toDisplayString = (val) => {
  return String(val);
};

// src/index.ts
var isObject = (val) => {
  return val !== null && typeof val === "object";
};
var isString = (val) => typeof val === "string";
var camelizeRE = /-(\w)/g;
var camelize = (str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
};
var extend = Object.assign;
var isOn = (key) => /^on[A-Z]/.test(key);
function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue);
}
function hasOwn(val, key) {
  return Object.prototype.hasOwnProperty.call(val, key);
}
var capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
var toHandlerKey = (str) => str ? `on${capitalize(str)}` : ``;
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = (str) => str.replace(hyphenateRE, "-$1").toLowerCase();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ShapeFlags,
  camelize,
  capitalize,
  extend,
  hasChanged,
  hasOwn,
  hyphenate,
  isObject,
  isOn,
  isString,
  toDisplayString,
  toHandlerKey
});
//# sourceMappingURL=index.js.map