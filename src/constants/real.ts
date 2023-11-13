import { Constant, constRe } from './abstract_constant';
import { Complex } from './complex.ts';
import { Integer } from './integer.ts';
import { Rational } from './rational.ts';
import { Parser } from './parser';

export type RealConstant = Integer | Rational | Real;


export class Real extends Constant {
  private _value: number;
  static ZERO = new Real(0);
  constructor(arg: number | string) {
    super();
    if (typeof arg === "string") {
      if (!constRe.real.test(arg)) throw arg + " is not a real number";
      this._value = parseFloat(arg);
    } else {
      this._value = arg;
    }
  }

  get value(): number { return this._value; }

  toString(): string { return `${this._value}`; }
  toLaTeX(): string { return this.toString(); }
  equals(num: Constant) {
    if( num instanceof Real) return this._value === num.value;
    return false;
  }

  plus(num: RealConstant): Real;
  plus(num: Complex): Complex;
  plus(str: string): Real | Complex;
  plus(num: RealConstant | Complex | string): Real | Complex {
    if (num instanceof Integer) return new Real(Number(num.value) + this._value);
    else if (num instanceof Real) return new Real(num.value + this._value);
    else if (num instanceof Rational) return new Real(this._value + num.toReal().value);
    else if (num instanceof Complex) return new Complex(num.real.plus(this),num.imag);
    else if (typeof num === 'string')  return this.plus(Parser.parseConstant(num));
    else throw new Error("This line shouldn't be reached.");
  }

  minus(num: RealConstant): Real;
  minus(num: Complex): Complex;
  minus(str: string): Real | Complex;
  minus(num: RealConstant | Complex | string): Real | Complex {
    if (num instanceof Integer) return new Real(Number(num.value) - this._value);
    else if (num instanceof Real) return new Real(num.value - this._value);
    else if (num instanceof Rational) return new Real(this._value - num.toReal().value);
    else if (num instanceof Complex) return new Complex(this.minus(num.real),num.imag);
    else if (typeof num === 'string')  return this.minus(Parser.parseConstant(num));
    else throw new Error("This line shouldn't be reached.");
  }

  times(num: RealConstant): Real;
  times(num: Complex): Complex;
  times(str: string): Real | Complex;
  times(num: RealConstant | Complex | string): Real | Complex {
    if (num instanceof Integer) return new Real(Number(num.value) * this._value);
    else if (num instanceof Real) return new Real(num.value * this._value);
    else if (num instanceof Rational) return new Real(this._value / num.toReal().value);
    else if (num instanceof Complex) return new Complex(num.real.times(this), num.imag);
    else if (typeof num === 'string') return this.times(Parser.parseConstant(num));
    else throw new Error("This line shouldn't be reached.");
  }
}
