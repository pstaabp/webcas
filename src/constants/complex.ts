import { Constant } from './abstract_constant';
import { Parser, constRe } from './parser';
import { Integer } from './integer';
import { Real, RealConstant } from './real';
import { Rational } from './rational';

export class Complex extends Constant {
  private _real: RealConstant;
  private _imag: RealConstant;
  // static ZERO = new Complex(0,0);
  constructor(str: string);
  constructor(num1: number | bigint | RealConstant, num2: number | bigint | RealConstant);
  constructor(arg1: string | number | bigint | RealConstant, arg2?: number | bigint | RealConstant) {
    super();
    this._real = new Integer(0);
    this._imag = new Integer(0);
    if (typeof arg1 === 'string' && arg2 == undefined) {
      if (!constRe.complex.test(arg1)) throw arg1 + " is not a complex number";
      const match = arg1.match(constRe.complex);
      if (match) {
        this._real = Parser.parseRealConstant(match[2]);
        this._imag = Parser.parseRealConstant(match[4]);
      }
      if (match != undefined && match[3] == '-') this._imag.times('-1');
    }  else {
      if (arg1 instanceof Integer|| arg1 instanceof Real || arg1 instanceof Rational) {
        this._real = arg1;
      } else {
        this._real = Parser.parseRealConstant(`${arg1}`);
      }
          if (arg2 instanceof Integer|| arg2 instanceof Real || arg2 instanceof Rational) {
          this._imag = arg2;
        } else {
          this._imag = Parser.parseRealConstant(`${arg2}`);
        }
      }
      console.log(this.toString());
  }

  get real(): RealConstant { return this._real; }
  get imag(): RealConstant { return this._imag; }

  toString() { return `${this._real}+${this._imag}i`;}
  toLaTeX() { return this.toString();}

  equals(num: Constant): boolean {
    if (num instanceof Complex) {
      return num.real.equals(this._real) && num.imag.equals(this._imag);
    }
    return false;
  }

  plus(num: RealConstant): Complex;
  plus(num: Complex): Complex;
  plus(num: Constant): Complex;
  plus(str: string): Complex;
  plus(num: Constant | RealConstant | Complex | string): Complex {
    if (typeof num === 'string') return this.plus(Parser.parseConstant(num));
    if (num instanceof Integer || num instanceof Real || num instanceof Rational)
       return new Complex(this.real.plus(num), this.imag);
    else if (num instanceof Complex) {
      return new Complex(this.real.plus(num.real),this.imag.plus(num.imag));
    } else {
    throw new Error("This line shouldn't be reached.");
    }
  }

  minus(num: RealConstant): Complex;
  minus(num: Complex): Complex;
  minus(num: Constant): Complex;
  minus(str: string): Complex;
  minus(num: Constant | RealConstant | Complex | string): Complex {
    if (num instanceof Integer) return new Complex(this._real.minus(num), this._imag);
    else if (num instanceof Real) return new Complex(this._real.minus(num), this._imag);
    else if (num instanceof Rational) return new Complex(this._real.minus(num), this._imag);
    else if (num instanceof Complex)
      return new Complex(num.real.minus(this._real), num.imag.minus(this._real));
    else if (typeof num === 'string') return this.minus(Parser.parseConstant(num));
    else throw new Error("This line shouldn't be reached.");
  }

  times(num: RealConstant): Complex;
  times(num: Complex): Complex;
  times(num: Constant): Complex;
  times(str: string): Complex;
  times(num: Constant | RealConstant | Complex | string): Complex {
    if (num instanceof Integer) return new Complex(this._real.times(num), this._imag.times(num));
    else if (num instanceof Real) return new Complex(this._real.times(num), this._imag.times(num));
    else if (num instanceof Rational) return new Complex(this._real.times(num), this._imag.times(num));
    else if (num instanceof Complex)
      return new Complex(num.real.times(this._real).minus(num.imag.times(this.imag)),
        num.imag.times(this._real).plus(num.real.times(this._imag)));
    else if (typeof num === 'string') return this.times(Parser.parseConstant(num));
    else throw new Error("This line shouldn't be reached.");
  }

}