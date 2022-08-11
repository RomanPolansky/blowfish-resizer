/* blowfish-resizer@0.0.9 */
(function (exports, utils) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var BlowfishCurvePoint = /** @class */ (function () {
        function BlowfishCurvePoint(aspectRatio) {
            this.aspectRatio = aspectRatio;
        }
        return BlowfishCurvePoint;
    }());
    var BlowfishCurvePointSingle = /** @class */ (function (_super) {
        __extends(BlowfishCurvePointSingle, _super);
        function BlowfishCurvePointSingle(aspectRatio, params) {
            var _this = _super.call(this, aspectRatio) || this;
            _this.pointType = 'single';
            _this.params = params;
            return _this;
        }
        BlowfishCurvePointSingle.prototype.GetParamPriority = function () { return this.params; };
        BlowfishCurvePointSingle.prototype.GetParamLeft = function () { return this.params; };
        BlowfishCurvePointSingle.prototype.GetParamRight = function () { return this.params; };
        return BlowfishCurvePointSingle;
    }(BlowfishCurvePoint));
    var BlowfishCurvePointDouble = /** @class */ (function (_super) {
        __extends(BlowfishCurvePointDouble, _super);
        function BlowfishCurvePointDouble(aspectRatio, priorityLeft, paramsLeft, paramsRight) {
            var _this = _super.call(this, aspectRatio) || this;
            _this.pointType = 'double';
            _this.priorityLeft = priorityLeft;
            _this.paramsLeft = paramsLeft;
            _this.paramsRight = paramsRight;
            return _this;
        }
        BlowfishCurvePointDouble.prototype.GetParamPriority = function () { return this.priorityLeft ? this.paramsLeft : this.paramsRight; };
        BlowfishCurvePointDouble.prototype.GetParamLeft = function () { return this.paramsLeft; };
        BlowfishCurvePointDouble.prototype.GetParamRight = function () { return this.paramsRight; };
        return BlowfishCurvePointDouble;
    }(BlowfishCurvePoint));

    /* eslint-disable no-restricted-syntax */
    var BlowfishElement = /** @class */ (function () {
        function BlowfishElement(target, params, fncSetParams) {
            this.points = [];
            this.target = target;
            this.fullParams = params;
            this.fncSetParams = fncSetParams;
        }
        BlowfishElement.prototype.Update = function (aspectRatio, screenSize, screenScale) {
            var params = this.GetParamsByAspectRatio(aspectRatio);
            this.fncSetParams(this.target, params, screenSize, screenScale);
        };
        BlowfishElement.prototype.AddPoint = function (aspectRatio, paramsIn) {
            if (paramsIn === void 0) { paramsIn = null; }
            if (paramsIn == null) {
                var params = this.GetParamsByAspectRatio(aspectRatio);
                var paramsCopy = JSON.parse(JSON.stringify(params));
                this.points.push(new BlowfishCurvePointSingle(aspectRatio, paramsCopy));
            }
            else {
                this.points.push(new BlowfishCurvePointSingle(aspectRatio, paramsIn));
            }
            this.points.sort(function (a, b) { return ((a.aspectRatio < b.aspectRatio) ? -1 : 1); });
        };
        BlowfishElement.prototype.AddPointD = function (aspectRatio, priorityLeft, paramsLeft, paramsRight) {
            var paramsLeftCopy = JSON.parse(JSON.stringify(paramsLeft));
            var paramsRightCopy = JSON.parse(JSON.stringify(paramsRight));
            this.points.push(new BlowfishCurvePointDouble(aspectRatio, priorityLeft, paramsLeftCopy, paramsRightCopy));
            this.points.sort(function (a, b) { return ((a.aspectRatio < b.aspectRatio) ? -1 : 1); });
        };
        BlowfishElement.prototype.RemovePoint = function (aspectRatio) {
            var point = this.TryGetPoint(aspectRatio);
            if (point != null) {
                var i = this.points.indexOf(point);
                this.points.splice(i, 1);
            }
        };
        BlowfishElement.prototype.GetParamsByAspectRatio = function (aspectRatio) {
            var point = this.TryGetPoint(aspectRatio);
            if (point != null)
                return point.GetParamPriority();
            var params = null;
            var leftPoint = this.GetLeftPoint(aspectRatio);
            var rightPoint = this.GetRightPoint(aspectRatio);
            if (leftPoint == null) {
                if (rightPoint == null) {
                    params = this.FullParamsToParams(this.fullParams);
                }
                else {
                    params = rightPoint.GetParamLeft();
                }
            }
            else if (rightPoint == null) {
                params = leftPoint.GetParamRight();
            }
            else {
                var t = (rightPoint.aspectRatio - aspectRatio) / (rightPoint.aspectRatio - leftPoint.aspectRatio);
                t = Math.min(1.0, Math.max(0.0, 1.0 - t));
                params = this.LerpParams(leftPoint.GetParamRight(), rightPoint.GetParamLeft(), t);
            }
            return params;
        };
        BlowfishElement.prototype.FullParamsToParams = function (fullParams) {
            var params = {};
            for (var paramName in fullParams) {
                params[paramName] = fullParams[paramName].value;
            }
            return params;
        };
        BlowfishElement.prototype.TryGetPoint = function (aspectRatio) {
            for (var i = 0; i < this.points.length; i++) {
                if (Math.abs(aspectRatio - this.points[i].aspectRatio) < 0.005) {
                    return this.points[i];
                }
            }
            return null;
        };
        BlowfishElement.prototype.GetLeftPoint = function (aspectRatio) {
            var point = null;
            for (var i = 0; i < this.points.length; i++) {
                if (this.points[i].aspectRatio < aspectRatio) {
                    point = this.points[i];
                }
            }
            return point;
        };
        BlowfishElement.prototype.GetRightPoint = function (aspectRatio) {
            for (var i = 0; i < this.points.length; i++) {
                if (this.points[i].aspectRatio > aspectRatio) {
                    return this.points[i];
                }
            }
            return null;
        };
        BlowfishElement.prototype.LerpParams = function (startParams, endParams, t) {
            var params = {};
            for (var paramName in startParams) {
                var fnInterpolation = this.fullParams[paramName].interpolation;
                params[paramName] = fnInterpolation(startParams[paramName], endParams[paramName], t);
            }
            return params;
        };
        return BlowfishElement;
    }());

    var BlowfishPool = /** @class */ (function (_super) {
        __extends(BlowfishPool, _super);
        function BlowfishPool() {
            var _this = _super.call(this) || this;
            _this.fishs = [];
            _this.onChangeCallback = null;
            return _this;
        }
        BlowfishPool.prototype.Add = function (blowfish) {
            this.fishs.push(blowfish);
            if (typeof this.onChangeCallback === 'function') {
                this.onChangeCallback(this.fishs);
            }
        };
        Object.defineProperty(BlowfishPool, "Instance", {
            // singleton
            get: function () {
                if (window.blowfishPool === undefined) {
                    window.blowfishPool = new BlowfishPool();
                }
                return window.blowfishPool;
            },
            enumerable: false,
            configurable: true
        });
        return BlowfishPool;
    }(utils.EventEmitter));

    /* eslint-disable guard-for-in */
    var Blowfish = /** @class */ (function () {
        function Blowfish(name, elements, curvesConfig, defaultParams, defaultFuncSetParams, resolutions) {
            if (resolutions === void 0) { resolutions = [
                { width: 20.0, height: 9.0 },
                { width: 19.5, height: 9.0 },
                { width: 16.0, height: 9.0 },
                { width: 8.0, height: 5.0 },
                { width: 4.0, height: 3.0 },
                { width: 1.0, height: 1.0 },
                { width: 3.0, height: 4.0 },
                { width: 5.0, height: 8.0 },
                { width: 9.0, height: 16.0 },
                { width: 9.0, height: 19.5 },
                { width: 9.0, height: 20.0 },
            ]; }
            this.resolutions = [];
            this.mapElements = {};
            this.prevScreenSize = { width: 1, height: 1 };
            this.name = name;
            this.defaultParams = defaultParams;
            this.defaultFuncSetParams = defaultFuncSetParams;
            this.SetResolutions(resolutions);
            this.SetElements(elements, curvesConfig !== null && curvesConfig !== void 0 ? curvesConfig : {});
            BlowfishPool.Instance.Add(this);
        }
        Object.defineProperty(Blowfish.prototype, "MaxAspectRatio", {
            get: function () {
                return this.resolutions[this.resolutions.length - 1].aspectRatio;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Blowfish.prototype, "MinAspectRatio", {
            get: function () {
                return this.resolutions[0].aspectRatio;
            },
            enumerable: false,
            configurable: true
        });
        Blowfish.prototype.SetResolutions = function (resolutions) {
            this.resolutions = resolutions;
            for (var i = 0; i < this.resolutions.length; i++) {
                this.resolutions[i].aspectRatio = this.resolutions[i].width / this.resolutions[i].height;
            }
            this.resolutions.sort(function (a, b) { return ((a.aspectRatio < b.aspectRatio) ? -1 : 1); });
        };
        Blowfish.prototype.SetElements = function (elements, curvesConfig) {
            var _a, _b;
            this.mapElements = {};
            for (var elementName in elements) {
                var element = elements[elementName];
                if (element.target != null) {
                    this.mapElements[elementName] = new BlowfishElement(element.target, (_a = element.params) !== null && _a !== void 0 ? _a : this.defaultParams, (_b = element.fncSetParams) !== null && _b !== void 0 ? _b : this.defaultFuncSetParams);
                }
            }
            for (var elementName in this.mapElements) {
                var pointsConfig = curvesConfig[elementName];
                if (pointsConfig != null) {
                    var element = this.mapElements[elementName];
                    for (var i = 0; i < pointsConfig.length; i++) {
                        var params = element.FullParamsToParams(element.fullParams);
                        if (pointsConfig[i].type === 'single') {
                            var configParams = this.FixParams(params, pointsConfig[i].params);
                            element.AddPoint(pointsConfig[i].aspectRatio, configParams);
                        }
                        else {
                            var configParamsL = this.FixParams(params, pointsConfig[i].paramsLeft);
                            var configParamsR = this.FixParams(params, pointsConfig[i].paramsRight);
                            element.AddPointD(pointsConfig[i].aspectRatio, pointsConfig[i].priorityLeft, configParamsL, configParamsR);
                        }
                    }
                }
            }
            this.CreateDefaultCurvePointsForElements();
        };
        Blowfish.prototype.FixParams = function (defParams, fixParams) {
            var params = {};
            if (fixParams != null) {
                for (var paramName in defParams) {
                    params[paramName] = (fixParams[paramName] != null) ? fixParams[paramName] : defParams[paramName];
                }
            }
            return params;
        };
        Blowfish.prototype.CreateDefaultCurvePointsForElements = function () {
            for (var elementName in this.mapElements) {
                var element = this.mapElements[elementName];
                if (element.points.length === 0) {
                    element.AddPoint(this.MinAspectRatio);
                    element.AddPoint(this.MaxAspectRatio);
                }
            }
        };
        Blowfish.prototype.Update = function (width, height) {
            if (width === void 0) { width = this.prevScreenSize.width; }
            if (height === void 0) { height = this.prevScreenSize.height; }
            this.prevScreenSize.width = width;
            this.prevScreenSize.height = height;
            var screenSize = { width: width, height: height };
            var aspectRatio = width / height;
            var screenScale = Math.min(width / 960.0, height / 960.0);
            for (var elementName in this.mapElements) {
                var element = this.mapElements[elementName];
                element.Update(aspectRatio, screenSize, screenScale);
            }
        };
        return Blowfish;
    }());
    (function (Blowfish) {
        Blowfish.Interpolation = {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Left: function (leftValue, rightValue, t) { return (leftValue); },
            Lerp: function (leftValue, rightValue, t) { return (leftValue * (1 - t) + rightValue * t); },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Right: function (leftValue, rightValue, t) { return (rightValue); },
        };
    })(Blowfish || (Blowfish = {}));
    var Blowfish$1 = Blowfish;

    var defaultParams = {
        x: { value: 0.5, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish$1.Interpolation.Lerp },
        y: { value: 0.5, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish$1.Interpolation.Lerp },
        scale: { value: 1.0, editor: { step: 0.02 }, interpolation: Blowfish$1.Interpolation.Lerp },
    };
    var defaultFuncSetParams = function (target, params, screenSize) {
        target.x = params.x * screenSize.width;
        target.y = params.y * screenSize.height;
        target.scale.set(params.scale);
    };
    var defaultParamsPx = {
        x: { value: 100, editor: { min: -1000, max: 1000, step: 1 }, interpolation: Blowfish$1.Interpolation.Lerp },
        y: { value: 100, editor: { min: -1000, max: 1000, step: 1 }, interpolation: Blowfish$1.Interpolation.Lerp },
        scale: { value: 1.0, editor: { step: 0.02 }, interpolation: Blowfish$1.Interpolation.Lerp },
    };
    var defaultFuncSetParamsPx = function (target, params) {
        target.x = params.x;
        target.y = params.y;
        target.scale.set(params.scale);
    };

    exports.Blowfish = Blowfish$1;
    exports.defaultFuncSetParams = defaultFuncSetParams;
    exports.defaultFuncSetParamsPx = defaultFuncSetParamsPx;
    exports.defaultParams = defaultParams;
    exports.defaultParamsPx = defaultParamsPx;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, utils);
