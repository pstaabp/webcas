"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealConstant = void 0;
const abstract_constant_1 = require("./abstract_constant");
class RealConstant extends abstract_constant_1.Constant {
    compareTo(num) {
        return this.toReal().value - num.toReal().value;
    }
}
exports.RealConstant = RealConstant;
