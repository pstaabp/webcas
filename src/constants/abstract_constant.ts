/* This function parses a string and returns a real constant,
integer constant or rational constant */

export abstract class Constant {
  abstract toString(): string;
  abstract toLaTeX(): string;
  static ZERO: Constant;
  abstract equals(num: Constant): boolean;
  abstract plus(num: Constant | string): Constant;
  abstract minus(num: Constant | string): Constant;
  abstract times(num: Constant | string): Constant;
}