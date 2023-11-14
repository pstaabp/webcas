import { Constant } from "./abstract_constant";
import { Integer } from "./integer";
import { Complex } from "./complex";
import { Real, RealConstant } from "./real";
import { Parser, constRe } from "./parser";

export class Rational extends Constant {
  private _numer: bigint;
  private _denom: bigint;
  private _sign = 1;
  constructor(str: string);
  constructor(
    numer: bigint | number | Integer,
    denom: bigint | number | Integer
  );
  constructor(
    arg1: string | bigint | number | Integer,
    arg2?: bigint | number | Integer
  ) {
    super();
    let numer = BigInt(0),
      denom = BigInt(1);
    if (typeof arg1 !== "string" && arg2 !== undefined) {
      if (!constRe.integer.test(`${arg1}`))
        throw `The number ${arg1} is not an integer.`;
      if (!constRe.integer.test(`${arg2}`))
        throw `The number ${arg2} is not an integer.`;
      numer = arg1 instanceof Integer ? arg1.value : BigInt(arg1);
      denom = arg2 instanceof Integer ? arg2.value : BigInt(arg2);
    } else if (typeof arg1 === "string" && arg2 === undefined) {
      if (!constRe.rational.test(arg1))
        throw arg1 + " is not a rational number";
      const match = arg1.match(constRe.rational);
      if (match !== null) {
        numer = BigInt(match[1]);
        denom = BigInt(match[2]);
      }
    } else {
      throw "Constructor error. Can't combine a string with an other argument. ";
    }
    this._sign = numer * denom > 0 ? 1 : -1;
    this._numer = numer >= 0 ? numer : -numer;
    this._denom = denom >= 0 ? denom : -denom;

    // reduce the fraction.
    this.reduce();
  }

  get numer(): bigint {
    return this._numer;
  }
  get denom(): bigint {
    return this._denom;
  }
  get sign(): number {
    return this._sign;
  }

  toString(): string {
    return (this._sign < 0 ? "-" : "") + this._numer + "/" + this._denom;
  }
  toLaTeX(): string {
    return (
      (this._sign < 0 ? "-" : "") +
      "\\frac{ " +
      this._numer +
      "}{" +
      this._denom +
      "}"
    );
  }
  toReal(): Real {
    return new Real(Number(this._numer) / Number(this._denom));
  }

  equals(num: Constant): boolean {
    if (num instanceof Rational) {
      return (
        num.numer === this._numer &&
        num.denom === this._denom &&
        num.sign === this._sign
      );
    }
    return false;
  }

  plus(num: RealConstant): Rational | Real;
  plus(num: Complex): Complex;
  plus(str: string): Rational | Real | Complex;
  plus(num: Constant): Rational | Real | Complex;
  plus(
    arg: Constant | RealConstant | Complex | string
  ): Rational | Real | Complex {
    let num = typeof arg === "string" ? Parser.parseConstant(arg) : arg;

    if (num instanceof Integer)
      return new Rational(num.value * this._denom + this._numer, this._denom);
    else if (num instanceof Real)
      return new Real(num.value + this.toReal().value);
    else if (num instanceof Rational)
      return new Rational(
        num.numer * this._denom + num.denom * this._numer,
        num.denom * this._denom
      );
    else if (num instanceof Complex) {
      const r: RealConstant = this.plus(num.real);
      return new Complex(r, num.imag);
    } else throw new Error("This line shouldn't be reached.");
  }

  minus(num: RealConstant): Rational | Real;
  minus(num: Complex): Complex;
  minus(str: string): Rational | Real | Complex;
  minus(num: Constant): Rational | Real | Complex;
  minus(
    arg: Constant | RealConstant | Complex | string
  ): Rational | Real | Complex {
    let num = typeof arg === "string" ? Parser.parseConstant(arg) : arg;
    if (num instanceof Integer)
      return new Rational(this._numer - num.value * this._denom, this._denom);
    else if (num instanceof Real)
      return new Real(this.toReal().value - num.value);
    else if (num instanceof Rational)
      return new Rational(
        num.denom * this._numer - num.numer * this._denom,
        num.denom * this._denom
      );
    else if (num instanceof Complex)
      return new Complex(this.minus(num.real), num.imag);
    else throw new Error("This line shouldn't be reached.");
  }

  times(num: RealConstant): Rational | Real;
  times(num: Complex): Complex;
  times(str: string): Rational | Real;
  times(num: Constant): Rational | Real | Complex;
  times(
    num: Constant | RealConstant | Complex | string
  ): Rational | Real | Complex {
    if (num instanceof Integer)
      return new Rational(num.value * this._numer, this._denom);
    else if (num instanceof Real)
      return new Real(num.value * this.toReal().value);
    else if (num instanceof Rational)
      return new Rational(num.numer * this._numer, num.denom * this._denom);
    else if (num instanceof Complex) {
      const r: Integer | Real | Rational = this.times(num.real);
      const i: Integer | Real | Rational = this.times(num.imag);
      return new Complex(r, i);
    } else if (typeof num === "string")
      return this.times(Parser.parseConstant(num));
    else throw new Error("This line shouldn't be reached.");
  }

  // reduce the fraction such that gcd(numer,denom)=1;
  reduce() {
    const c = Integer.gcd(this._numer, this.denom);
    this._numer /= c;
    this._denom /= c;
  }
}
