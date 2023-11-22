import { Constant } from './abstract_constant';
export class RealConstant extends Constant {
    compareTo(num) {
        return this.toReal().value - num.toReal().value;
    }
}
