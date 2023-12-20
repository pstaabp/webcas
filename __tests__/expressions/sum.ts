import { describe, expect, test } from '@jest/globals';
import { Integer } from '../../src/constants/all_constants';
import { Variable, Sum} from '../../src/expressions/expression';
import { Expression } from '../../src/expressions/abstract_expression';


describe('construct a sum', () => {
	const v1 = new Variable('x');
	const c1 = new Integer(1);

	test('check that a sum is a Sum', () => {
		expect(new Sum(v1, c1) instanceof Sum).toBe(true);
	});
	test('check that a sum is a Expression', () => {
		expect(new Sum(v1, c1) instanceof Expression).toBe(true);
	});
});

describe('test equals and toString', () => {
	const v1 = new Variable('x');
		const c1 = new Integer(1);
		const s1 = new Sum(v1, c1);
		const s2 = new Sum(v1, c1);

	test('equality for sum', () => {
		expect(s1.equals(s2)).toBe(true);
	});
	test('toString', () => {
		expect(s1.toString()).toBe('(x)+(1)');
	})
});
