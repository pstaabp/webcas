import { describe, expect, test } from '@jest/globals';
import {Integer} from '../../src/constants/all_constants';
import { Parser } from '../../src/expressions/parser';


describe('Parse Integer Expressions', () => {
	const i = Parser.parseExpression('1+1',[]);
	test('1+1 is an integer', () => {
		expect(i.equals(new Integer(2))).toBe(true);
	});
});

