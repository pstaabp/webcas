/* This function parses a string and returns a real constant,
integer constant or rational constant */

const ratStr = "^(-?\\d+)\\/(\\d+)$"
const ratRe = new RegExp(ratStr);
const intStr = "^-?\\d+$";
const intRe = new RegExp(intStr);
const realStr = "^-?\\d*\\.\\d*$";
const realRe = new RegExp(realStr);
const anyNumberstr = "("+ratStr+"|" +intStr + "|" + realStr +")";
const anyNumberRe = new RegExp(anyNumberstr);
const complexRe = new RegExp("((.*)?([+-]))?(.*)?i");

export const constRe = {
  rational: ratRe,
  integer: intRe,
  real: realRe,
  complex: complexRe,
  any: anyNumberRe
};

export abstract class Constant {
  abstract toString(): string;
  abstract toLaTeX(): string;
  static ZERO: Constant;
  abstract equals(num: Constant): boolean;
  abstract plus(num: Constant | string): Constant;
  abstract minus(num: Constant | string): Constant;
  abstract times(num: Constant | string): Constant;
}
