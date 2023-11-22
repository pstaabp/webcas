import { Constant } from './abstract_constant';
import { Integer } from './integer';
import { Rational } from './rational';
import { Real } from './real';

export abstract class RealConstant extends Constant {

  abstract plus(num: Constant | string): RealConstant;
  abstract minus(num: Constant | string): RealConstant;
  abstract times(num: Constant | string): RealConstant;
  abstract div(num: Constant | string): RealConstant;
  abstract neg(): RealConstant;
	abstract toReal(): Real;
	abstract simplify(): RealConstant;
	compareTo(num: RealConstant) {
		return this.toReal().value-num.toReal().value;
	}

}
