import { describe, expect, test } from '@jest/globals';
import { Integer, Rational, Real, Complex } from '../../src/constants/all_constants';
import { Parser } from '../../src/constants/constant_parser';
import { NamedConstant } from '../../src/constants/all_constants';

describe('Parse Integers', () => {
	test('1 is an integer', () => {
		expect(Parser.parseConstant('1').equals(new Integer(1))).toBe(true);
	});
	test('1 is an integer', () => {
		expect(Parser.parseConstant('1') instanceof Integer).toBe(true);
	});
	test('-11 is an integer', () => {
		expect(Parser.parseConstant('-11').equals(new Integer(-11))).toBe(true);
	});
	test('-11 is an integer', () => {
		expect(Parser.parseConstant('-11') instanceof Integer).toBe(true);
	});
	test('1.2 is not an integer', () => {
		expect(() => {
			new Integer('1.2');
		}).toThrow('1.2 is not an integer');
	});
	test('1/2 is not an integer', () => {
		expect(() => {
			new Integer('1/2');
		}).toThrow('1/2 is not an integer');
	});
});

describe('Parse Rationals', () => {
	test('1/2 is a rational', () => {
		expect(Parser.parseConstant('1/2').equals(new Rational(1, 2))).toBe(true);
	});
	test('1/2 is a rational', () => {
		expect(Parser.parseConstant('1/2') instanceof Rational).toBe(true);
	});
	test('-2/3 is a rational', () => {
		expect(Parser.parseConstant('-2/3').equals(new Rational(-2, 3))).toBe(true);
	});
	test('-2/3 is a rational', () => {
		expect(Parser.parseConstant('-2/3') instanceof Rational).toBe(true);
	});
	test('2 is not a rational', () => {
		expect(() => {
			new Rational('2');
		}).toThrow('2 is not a rational');
	});
	test('2.4 is not a rational', () => {
		expect(() => {
			new Rational('2.4');
		}).toThrow('2.4 is not a rational');
	});
});

describe('Parse reals', () => {
	test('3.0 is a real', () => {
		expect(Parser.parseConstant('3.0').equals(new Real(3.0))).toBe(true);
	});
	test('3.0 is a real', () => {
		expect(Parser.parseConstant('3.0') instanceof Real).toBe(true);
	});
	test('-3.0 is a real', () => {
		expect(Parser.parseConstant('-3.0').equals(new Real(-3.0))).toBe(true);
	});
	test('-3.0 is a real', () => {
		expect(Parser.parseConstant('-3.0') instanceof Real).toBe(true);
	});
	test('2/3 is not a real', () => {
		expect(() => {
			new Real('2/3');
		}).toThrow('2/3 is not a real');
	});
});

describe('Parse imaginary numbers', () => {
	test('2i is a complex number', () => {
		expect(Parser.parseConstant('2i')).toStrictEqual(new Complex(0, 2));
	});
	test('+2i is a complex number', () => {
		expect(Parser.parseConstant('+2i')).toStrictEqual(new Complex(0, 2));
	});
	test('(+2)i is a complex number', () => {
		expect(Parser.parseConstant('(+2)i')).toStrictEqual(new Complex(0, 2));
	});
	test('-2i is a complex number', () => {
		expect(Parser.parseConstant('-2i')).toStrictEqual(new Complex(0, -2));
	});
	test('(-2)i is a complex number', () => {
		expect(Parser.parseConstant('(-2)i')).toStrictEqual(new Complex(0, -2));
	});
	test('1/2i is a complex number', () => {
		expect(Parser.parseConstant('1/2i')).toStrictEqual(new Complex(0, new Rational(1, 2)));
	});
	test('(1/2)i is a complex number', () => {
		expect(Parser.parseConstant('(1/2)i')).toStrictEqual(new Complex(0, new Rational(1, 2)));
	});
	test('(+1/2)i is a complex number', () => {
		expect(Parser.parseConstant('(+1/2)i')).toStrictEqual(new Complex(0, new Rational(1, 2)));
	});
	test('-1/2i is a complex number', () => {
		expect(Parser.parseConstant('-1/2i')).toStrictEqual(new Complex(0, new Rational(-1, 2)));
	});
	test('(-1/2)i is a complex number', () => {
		expect(Parser.parseConstant('(-1/2)i')).toStrictEqual(new Complex(0, new Rational(-1, 2)));
	});
});

describe('Parse complex numbers', () => {
	test('2+3i is a complex', () => {
		expect(Parser.parseConstant('2+3i')).toStrictEqual(new Complex(2, 3));
	});
	test('(2)+3i is a complex', () => {
		expect(Parser.parseConstant('(2)+3i')).toStrictEqual(new Complex(2, 3));
	});
	test('(-2)+3i is a complex', () => {
		expect(Parser.parseConstant('(-2)+3i')).toStrictEqual(new Complex(-2, 3));
	});
	test('(-2)+(3)i is a complex', () => {
		expect(Parser.parseConstant('(-2)+(3)i')).toStrictEqual(new Complex(-2, 3));
	});

	test('2-3i is a complex', () => {
		expect(Parser.parseComplex('2-3i')).toStrictEqual(new Complex(2, -3));
	});
	test('(2)-3i is a complex', () => {
		expect(Parser.parseComplex('(2)-3i')).toStrictEqual(new Complex(2, -3));
	});
	test('2-(3)i is a complex', () => {
		expect(Parser.parseComplex('2-(3)i')).toStrictEqual(new Complex(2, -3));
	});
	test('(2)-(3)i is a complex', () => {
		expect(Parser.parseComplex('(2)-(3)i')).toStrictEqual(new Complex(2, -3));
	});

	test('2+3.5i is a complex', () => {
		expect(Parser.parseConstant('2+3.5i')).toStrictEqual(new Complex(2, 3.5));
	});
	test('(-2)+3.5i is a complex', () => {
		expect(Parser.parseConstant('(-2)+3.5i')).toStrictEqual(new Complex(-2, 3.5));
	});
	test('2+(3.5)i is a complex', () => {
		expect(Parser.parseConstant('2+(3.5)i')).toStrictEqual(new Complex(2, 3.5));
	});
	test('(2)+(3.5)i is a complex', () => {
		expect(Parser.parseConstant('(2)+(3.5)i')).toStrictEqual(new Complex(2, 3.5));
	});

	test('2-3.5i is a complex', () => {
		expect(Parser.parseConstant('2-3.5i')).toStrictEqual(new Complex(2, -3.5));
	});
	test('(2)-3.5i is a complex', () => {
		expect(Parser.parseConstant('(2)-3.5i')).toStrictEqual(new Complex(2, -3.5));
	});
	test('2-(3.5)i is a complex', () => {
		expect(Parser.parseConstant('2-(3.5)i')).toStrictEqual(new Complex(2, -3.5));
	});
	test('2+(-3.5)i is a complex', () => {
		expect(Parser.parseConstant('2+(-3.5)i')).toStrictEqual(new Complex(2, -3.5));
	});
	test('(2)-(3.5)i is a complex', () => {
		expect(Parser.parseConstant('(2)-(3.5)i')).toStrictEqual(new Complex(2, -3.5));
	});

	test('2.2+3.5i is a complex', () => {
		expect(Parser.parseConstant('2.2+3.5i')).toStrictEqual(new Complex(2.2, 3.5));
	});
	test('(2.2)+3.5i is a complex', () => {
		expect(Parser.parseConstant('(2.2)+3.5i')).toStrictEqual(new Complex(2.2, 3.5));
	});
	test('2.2+(3.5)i is a complex', () => {
		expect(Parser.parseConstant('2.2+(3.5)i')).toStrictEqual(new Complex(2.2, 3.5));
	});
	test('(2.2)+(3.5)i is a complex', () => {
		expect(Parser.parseConstant('(2.2)+(3.5)i')).toStrictEqual(new Complex(2.2, 3.5));
	});

	test('1/2+5i is a complex', () => {
		expect(Parser.parseConstant('1/2+5i')).toStrictEqual(new Complex(new Rational(1, 2), 5));
	});
	test('(1/2)+5i is a complex', () => {
		expect(Parser.parseConstant('(1/2)+5i')).toStrictEqual(new Complex(new Rational(1, 2), 5));
	});
	test('1/2+(5)i is a complex', () => {
		expect(Parser.parseConstant('1/2+(5)i')).toStrictEqual(new Complex(new Rational(1, 2), 5));
	});
	test('(1/2)+(5)i is a complex', () => {
		expect(Parser.parseConstant('(1/2)+(5)i')).toStrictEqual(new Complex(new Rational(1, 2), 5));
	});

	test('1/2+3/5i is a complex', () => {
		expect(Parser.parseConstant('1/2+3/5i')).toStrictEqual(new Complex(new Rational(1, 2), new Rational(3, 5)));
	});
});

describe('parse constants', () => {
	test('parse pi', () => {
		expect(Parser.parseNamedConstant('pi')).toStrictEqual(new NamedConstant('pi'));
	});
	test('parse e', () => {
		expect(Parser.parseNamedConstant('e')).toStrictEqual(new NamedConstant('e'));
	});
	test('parse fred', () => {
		expect(() => {
			Parser.parseNamedConstant('fred');
		}).toThrow('The constant fred is not defined.');
	});
});
