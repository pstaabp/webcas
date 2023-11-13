import { Constant, constRe } from './abstract_constant.ts';
import { Complex } from './complex.ts';
import { Integer } from './integer.ts';
import { Rational } from './rational.ts';
import { Real } from './real.ts';

export class Parser {

static parseConstant(str: string): Constant {
  if (constRe.complex.test(str)) return new Complex(str);
  else if (constRe.rational.test(str)) return new Rational(str);
  else if (constRe.integer.test(str)) return new Integer(str);
  else if (constRe.real.test(str)) return new Real(str);
  else if (constRe.complex.test(str)) return new Complex(str);
  else throw str +" does not parse to a constant.";
}
}
