import { Constant } from './abstract_constant.ts';
import { Complex } from './complex.ts';
import { Integer } from './integer.ts';
import { Rational } from './rational.ts';
import { Real, RealConstant } from './real.ts';

const ratStr = "^(-?\\d+)\\/(\\d+)$"
const ratRe = new RegExp(ratStr);
const intStr = "^-?\\d+$";
const intRe = new RegExp(intStr);
const realStr = "^-?\\d*\\.\\d*$";
const realRe = new RegExp(realStr);
const realConstStr = "("+ratStr+"|" +intStr + "|" + realStr +")";
const realConstRe = new RegExp(realConstStr);
const complexRe = new RegExp("((.*)?([+-]))?(.*)?i");

export const constRe = {
  rational: ratRe,
  integer: intRe,
  real: realRe,
  complex: complexRe,
  real_const: realConstRe
};


export class Parser {

  static parseRealConstant(str: string) : RealConstant {
    if (constRe.rational.test(str)) return new Rational(str);
    else if (constRe.integer.test(str)) return new Integer(str);
    else if (constRe.real.test(str)) return new Real(str);
    else throw str +" does not parse to a real constant.";
  }
  static parseConstant(str: string): Constant {
    if (constRe.complex.test(str)) return new Complex(str);
    else if (constRe.real_const.test(str)) return Parser.parseRealConstant(str);
    else throw str +" does not parse to a constant.";
  }
}
