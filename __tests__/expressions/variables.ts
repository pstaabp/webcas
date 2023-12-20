import { describe, expect, test } from '@jest/globals';
import { Expression } from '../../src/expressions/abstract_expression';
import { Variable } from '../../src/expressions/expression';

describe('construct a variable', () => {
	test('variable has correct type', () => {
		expect(new Variable('x') instanceof Variable).toBe(true);
	});
	test('variable has correct type', () => {
		expect(new Variable('x') instanceof Expression).toBe(true);
	});
});
