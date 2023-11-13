/* This function parses a string and returns a real constant,
integer constant or rational constant */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ratstr = "^(-?\\d+)\\/(\\d+)$";
var ratRe = new RegExp(ratstr);
var intstr = "^-?\\d+$";
var intRe = new RegExp(intstr);
var realstr = "^-?\\d*\\.\\d*$";
var realRe = new RegExp(realstr);
var anyNumberstr = "(" + ratstr + "|" + intstr + "|" + realstr + ")";
var complexstr = "((.*)?([+-]))?(.*)?i";
var complexRe = new RegExp(complexstr);
var Constant = /** @class */ (function () {
    function Constant() {
    }
    // abstract getValue(): Constant;
    Constant.parseConstant = function (str) {
        if (complexRe.test(str))
            return new Complex(str);
        else if (ratRe.test(str))
            return new Rational(str);
        else if (intRe.test(str))
            return new Integer(str);
        else if (realRe.test(str))
            return new Real(str);
        else if (complexRe.test(str))
            return new Complex(str);
        else
            throw str + " does not parse to a constant.";
    };
    return Constant;
}());
var Real = /** @class */ (function (_super) {
    __extends(Real, _super);
    function Real(arg) {
        var _this = _super.call(this) || this;
        if (typeof arg === "string") {
            if (!realRe.test(arg))
                throw arg + " is not a real number";
            _this._value = parseFloat(arg);
        }
        else {
            _this._value = arg;
        }
        return _this;
    }
    Real.prototype.toString = function () { return this._value; };
    Real.prototype.toLaTeX = function () { return this._value; };
    Real.ZERO = new Real(0);
    return Real;
}(Constant));
var Integer = /** @class */ (function (_super) {
    __extends(Integer, _super);
    function Integer(arg) {
        var _this = _super.call(this) || this;
        if (!intRe.test("" + arg))
            throw arg + " is not an integer";
        _this._value = parseInt("" + arg);
        return _this;
    }
    Integer.prototype.toString = function () { return this._value; };
    Integer.prototype.toLaTeX = function () { return this._value; };
    Object.defineProperty(Integer.prototype, "value", {
        get: function () { return this._value; },
        enumerable: false,
        configurable: true
    });
    Integer.gcd = function () {
        var nums = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nums[_i] = arguments[_i];
        }
        // If argments are of type Integer, convert to native ints.
        var values = nums.map(function (n) { return n instanceof Integer ? n.value : n; });
        if (values.length == 2) {
            return values[1].equals(Integer.ZERO) ? values[0] : Integer.gcd(values[1], nums[0] % nums[1]);
        }
        else {
            var c = void 0, r = nums[0];
            for (var i = 1; i < nums.length; i++) {
                r = Integer.gcd(r, nums[i]);
            }
            return r;
        }
    };
    Integer.ZERO = new Integer(0);
    return Integer;
}(Constant));
var Rational = /** @class */ (function (_super) {
    __extends(Rational, _super);
    function Rational(arg1, arg2) {
        var _this = _super.call(this) || this;
        var numer, denom;
        if (typeof arg1 === "string") {
            if (!ratRe.test(arg1))
                throw arg1 + " is not a real number";
            var match = arg1.match(ratRe);
            numer = match[1];
            denom = match[2];
        }
        else {
            numer = arg1;
            denom = arg2;
        }
        _this._sign = numer * denom > 0 ? 1 : -1;
        _this._numer = numer instanceof Integer ? Math.abs(numer.value) : Math.abs(numer);
        _this._denom = denom instanceof Integer ? Math.abs(denom.value) : Math.abs(denom);
        return _this;
        // this.reduce();
        // this.simplify();
    }
    Rational.prototype.toString = function () { return (this._sign < 0 ? "-" : "") + this._numer + "/" + this._denom; };
    Rational.prototype.toLaTeX = function () { return (this._sign < 0 ? "-" : "") + "\\frac{ " + this._numer + "}{" + this._denom + "}"; };
    return Rational;
}(Constant));
var Complex = /** @class */ (function (_super) {
    __extends(Complex, _super);
    function Complex(arg1, arg2) {
        var _this = _super.call(this) || this;
        if (typeof arg1 === 'string') {
            if (!complexRe.test(arg1))
                throw arg1 + " is not a real number";
            var match = arg1.match(complexRe);
            _this._real = parseFloat(match[0]);
            _this._imag = parseFloat(match[1]);
        }
        else {
            _this._real = arg1;
            _this._imag = arg2;
        }
        return _this;
    }
    Complex.prototype.toString = function () { return "".concat(this._real, "+").concat(this._imag); };
    Complex.prototype.toLaTeX = function () { return this.toString(); };
    return Complex;
}(Constant));
console.log(Integer.gcd(18, 3));
