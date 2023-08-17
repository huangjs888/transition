(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Transition = {}));
})(this, (function (exports) { 'use strict';

  /*
   * @Author: Huangjs
   * @Date: 2023-02-13 15:22:58
   * @LastEditors: Huangjs
   * @LastEditTime: 2023-08-17 11:44:19
   * @Description: ******
   */

  var requestAnimationFrame = window.requestAnimationFrame || function () {
    var last = 0;
    // setTimeout时间并不精确，这里做了校准
    return function (fn) {
      var now = Date.now();
      var delay = Math.max(0, 16 - (now - last));
      last = now + delay;
      return window.setTimeout(fn, delay);
    };
  }();
  var cancelAnimationFrame = window.cancelAnimationFrame || function (id) {
    return window.clearTimeout(id);
  };
  var callDelay = function callDelay(callback, delay) {
    if (delay > 0) {
      window.setTimeout(callback, delay);
    } else {
      callback(Math.abs(delay));
    }
  };
  var Animation = /*#__PURE__*/function () {
    // 每一帧动画执行函数
    function Animation(_ref) {
      var duration = _ref.duration,
        easing = _ref.easing,
        delay = _ref.delay;
      // 动画执行持续时间
      // 动画执行时变换函数
      // 动画延迟多久执行
      this._frameId = 0;
      // 当前正在执行帧的id
      this._sleepId = 0;
      // 当前正在休眠计时id
      this._elapsed = 0;
      // 本次动画已经消耗的时间
      this._tick = null;
      this.duration = typeof duration !== 'number' || duration <= 0 ? 0 : duration;
      this.easing = typeof easing !== 'function' ? function (v) {
        return v;
      } : easing;
      this.delay = typeof delay !== 'number' ? 0 : delay;
    }
    var _proto = Animation.prototype;
    _proto.start = function start(frameFn) {
      var _this = this;
      // 只有全新的开始才会运行
      if (this._frameId === 0 && this._elapsed === 0) {
        var duration = this.duration,
          easing = this.easing,
          delay = this.delay;
        if (duration > 0) {
          var tick = function tick(last) {
            // 本帧时间戳，last：上一帧时间戳
            var now = Date.now();
            // 累计已经耗用的时间
            _this._elapsed += now - last;
            if (_this._elapsed < duration) {
              // 开启下一帧
              _this._frameId = requestAnimationFrame(function () {
                return tick(now);
              });
              // 每一帧的进度
              frameFn(easing(_this._elapsed / duration));
            } else {
              frameFn(1);
              // 执行完毕后清除
              _this._tick = null;
              _this._frameId = 0;
              _this._elapsed = 0;
            }
          };
          this._tick = tick;
          // 执行第一帧
          callDelay(function (elapsed) {
            if (elapsed === void 0) {
              elapsed = 0;
            }
            // 第一次直接用掉这些时间
            _this._elapsed = elapsed;
            tick(Date.now());
          }, delay);
        } else {
          callDelay(function () {
            frameFn(1);
          }, delay);
        }
      }
    };
    _proto.restart = function restart() {
      // restart之前先停止运行
      this.stop();
      // 停止后启动帧，只有动画已经开始并且未结束才可以
      if (this._elapsed < this.duration && this._tick) {
        // 启动帧
        this._tick(Date.now());
      }
    };
    _proto.sleep = function sleep(time) {
      var _this2 = this;
      // 这里注意，如果动画先停止，再点休眠，时间一到会再重启动画，相当于delay一下再restart
      if (typeof time !== 'number' || time <= 0) {
        return;
      }
      // sleep之前先停止运行
      this.stop();
      // 停止后启动休眠，只有动画已经开始并且未结束才可以
      if (this._elapsed < this.duration && this._tick) {
        this._sleepId = window.setTimeout(function () {
          // 到时间后重启动画
          _this2.restart();
        }, time);
      }
    };
    _proto.stop = function stop() {
      // 如果在sleep，要先清除sleep
      window.clearTimeout(this._sleepId);
      // 清掉还未运行的帧
      cancelAnimationFrame(this._frameId);
      this._frameId = 0;
    };
    _proto.end = function end() {
      // end之前先停止运行
      this.stop();
      // 停止后直接运行最后一帧结束动画，只有动画已经开始并且未结束才可以
      if (this._elapsed < this.duration && this._tick) {
        this._elapsed = this.duration;
        this._tick(Date.now());
      }
    };
    return Animation;
  }();

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global$h =
    // eslint-disable-next-line es/no-global-this -- safe
    check(typeof globalThis == 'object' && globalThis) ||
    check(typeof window == 'object' && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    check(typeof self == 'object' && self) ||
    check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () { return this; })() || commonjsGlobal || Function('return this')();

  var fails$h = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var fails$g = fails$h;

  var functionBindNative = !fails$g(function () {
    // eslint-disable-next-line es/no-function-prototype-bind -- safe
    var test = (function () { /* empty */ }).bind();
    // eslint-disable-next-line no-prototype-builtins -- safe
    return typeof test != 'function' || test.hasOwnProperty('prototype');
  });

  var NATIVE_BIND$4 = functionBindNative;

  var FunctionPrototype$3 = Function.prototype;
  var apply$2 = FunctionPrototype$3.apply;
  var call$g = FunctionPrototype$3.call;

  // eslint-disable-next-line es/no-reflect -- safe
  var functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND$4 ? call$g.bind(apply$2) : function () {
    return call$g.apply(apply$2, arguments);
  });

  var NATIVE_BIND$3 = functionBindNative;

  var FunctionPrototype$2 = Function.prototype;
  var call$f = FunctionPrototype$2.call;
  var uncurryThisWithBind = NATIVE_BIND$3 && FunctionPrototype$2.bind.bind(call$f, call$f);

  var functionUncurryThis = NATIVE_BIND$3 ? uncurryThisWithBind : function (fn) {
    return function () {
      return call$f.apply(fn, arguments);
    };
  };

  var uncurryThis$j = functionUncurryThis;

  var toString$6 = uncurryThis$j({}.toString);
  var stringSlice$1 = uncurryThis$j(''.slice);

  var classofRaw$2 = function (it) {
    return stringSlice$1(toString$6(it), 8, -1);
  };

  var classofRaw$1 = classofRaw$2;
  var uncurryThis$i = functionUncurryThis;

  var functionUncurryThisClause = function (fn) {
    // Nashorn bug:
    //   https://github.com/zloirock/core-js/issues/1128
    //   https://github.com/zloirock/core-js/issues/1130
    if (classofRaw$1(fn) === 'Function') return uncurryThis$i(fn);
  };

  var documentAll$2 = typeof document == 'object' && document.all;

  // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
  // eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
  var IS_HTMLDDA = typeof documentAll$2 == 'undefined' && documentAll$2 !== undefined;

  var documentAll_1 = {
    all: documentAll$2,
    IS_HTMLDDA: IS_HTMLDDA
  };

  var $documentAll$1 = documentAll_1;

  var documentAll$1 = $documentAll$1.all;

  // `IsCallable` abstract operation
  // https://tc39.es/ecma262/#sec-iscallable
  var isCallable$i = $documentAll$1.IS_HTMLDDA ? function (argument) {
    return typeof argument == 'function' || argument === documentAll$1;
  } : function (argument) {
    return typeof argument == 'function';
  };

  var objectGetOwnPropertyDescriptor = {};

  var fails$f = fails$h;

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails$f(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var NATIVE_BIND$2 = functionBindNative;

  var call$e = Function.prototype.call;

  var functionCall = NATIVE_BIND$2 ? call$e.bind(call$e) : function () {
    return call$e.apply(call$e, arguments);
  };

  var objectPropertyIsEnumerable = {};

  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor$3 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor$3 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$3(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;

  var createPropertyDescriptor$6 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var uncurryThis$h = functionUncurryThis;
  var fails$e = fails$h;
  var classof$8 = classofRaw$2;

  var $Object$4 = Object;
  var split = uncurryThis$h(''.split);

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails$e(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !$Object$4('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classof$8(it) == 'String' ? split(it, '') : $Object$4(it);
  } : $Object$4;

  // we can't use just `it == null` since of `document.all` special case
  // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
  var isNullOrUndefined$4 = function (it) {
    return it === null || it === undefined;
  };

  var isNullOrUndefined$3 = isNullOrUndefined$4;

  var $TypeError$f = TypeError;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible$3 = function (it) {
    if (isNullOrUndefined$3(it)) throw $TypeError$f("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings
  var IndexedObject$2 = indexedObject;
  var requireObjectCoercible$2 = requireObjectCoercible$3;

  var toIndexedObject$5 = function (it) {
    return IndexedObject$2(requireObjectCoercible$2(it));
  };

  var isCallable$h = isCallable$i;
  var $documentAll = documentAll_1;

  var documentAll = $documentAll.all;

  var isObject$b = $documentAll.IS_HTMLDDA ? function (it) {
    return typeof it == 'object' ? it !== null : isCallable$h(it) || it === documentAll;
  } : function (it) {
    return typeof it == 'object' ? it !== null : isCallable$h(it);
  };

  var path$6 = {};

  var path$5 = path$6;
  var global$g = global$h;
  var isCallable$g = isCallable$i;

  var aFunction = function (variable) {
    return isCallable$g(variable) ? variable : undefined;
  };

  var getBuiltIn$8 = function (namespace, method) {
    return arguments.length < 2 ? aFunction(path$5[namespace]) || aFunction(global$g[namespace])
      : path$5[namespace] && path$5[namespace][method] || global$g[namespace] && global$g[namespace][method];
  };

  var uncurryThis$g = functionUncurryThis;

  var objectIsPrototypeOf = uncurryThis$g({}.isPrototypeOf);

  var engineUserAgent = typeof navigator != 'undefined' && String(navigator.userAgent) || '';

  var global$f = global$h;
  var userAgent$3 = engineUserAgent;

  var process$4 = global$f.process;
  var Deno$1 = global$f.Deno;
  var versions = process$4 && process$4.versions || Deno$1 && Deno$1.version;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    // in old Chrome, versions of V8 isn't V8 = Chrome / 10
    // but their correct versions are not interesting for us
    version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
  }

  // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
  // so check `userAgent` even if `.v8` exists, but 0
  if (!version && userAgent$3) {
    match = userAgent$3.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = userAgent$3.match(/Chrome\/(\d+)/);
      if (match) version = +match[1];
    }
  }

  var engineV8Version = version;

  /* eslint-disable es/no-symbol -- required for testing */
  var V8_VERSION$2 = engineV8Version;
  var fails$d = fails$h;
  var global$e = global$h;

  var $String$4 = global$e.String;

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$d(function () {
    var symbol = Symbol();
    // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
    // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
    // of course, fail.
    return !$String$4(symbol) || !(Object(symbol) instanceof Symbol) ||
      // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
      !Symbol.sham && V8_VERSION$2 && V8_VERSION$2 < 41;
  });

  /* eslint-disable es/no-symbol -- required for testing */
  var NATIVE_SYMBOL$1 = symbolConstructorDetection;

  var useSymbolAsUid = NATIVE_SYMBOL$1
    && !Symbol.sham
    && typeof Symbol.iterator == 'symbol';

  var getBuiltIn$7 = getBuiltIn$8;
  var isCallable$f = isCallable$i;
  var isPrototypeOf$8 = objectIsPrototypeOf;
  var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

  var $Object$3 = Object;

  var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    var $Symbol = getBuiltIn$7('Symbol');
    return isCallable$f($Symbol) && isPrototypeOf$8($Symbol.prototype, $Object$3(it));
  };

  var $String$3 = String;

  var tryToString$5 = function (argument) {
    try {
      return $String$3(argument);
    } catch (error) {
      return 'Object';
    }
  };

  var isCallable$e = isCallable$i;
  var tryToString$4 = tryToString$5;

  var $TypeError$e = TypeError;

  // `Assert: IsCallable(argument) is true`
  var aCallable$b = function (argument) {
    if (isCallable$e(argument)) return argument;
    throw $TypeError$e(tryToString$4(argument) + ' is not a function');
  };

  var aCallable$a = aCallable$b;
  var isNullOrUndefined$2 = isNullOrUndefined$4;

  // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod
  var getMethod$3 = function (V, P) {
    var func = V[P];
    return isNullOrUndefined$2(func) ? undefined : aCallable$a(func);
  };

  var call$d = functionCall;
  var isCallable$d = isCallable$i;
  var isObject$a = isObject$b;

  var $TypeError$d = TypeError;

  // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive
  var ordinaryToPrimitive$1 = function (input, pref) {
    var fn, val;
    if (pref === 'string' && isCallable$d(fn = input.toString) && !isObject$a(val = call$d(fn, input))) return val;
    if (isCallable$d(fn = input.valueOf) && !isObject$a(val = call$d(fn, input))) return val;
    if (pref !== 'string' && isCallable$d(fn = input.toString) && !isObject$a(val = call$d(fn, input))) return val;
    throw $TypeError$d("Can't convert object to primitive value");
  };

  var shared$3 = {exports: {}};

  var isPure = true;

  var global$d = global$h;

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var defineProperty$3 = Object.defineProperty;

  var defineGlobalProperty$1 = function (key, value) {
    try {
      defineProperty$3(global$d, key, { value: value, configurable: true, writable: true });
    } catch (error) {
      global$d[key] = value;
    } return value;
  };

  var global$c = global$h;
  var defineGlobalProperty = defineGlobalProperty$1;

  var SHARED = '__core-js_shared__';
  var store$3 = global$c[SHARED] || defineGlobalProperty(SHARED, {});

  var sharedStore = store$3;

  var store$2 = sharedStore;

  (shared$3.exports = function (key, value) {
    return store$2[key] || (store$2[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.32.0',
    mode: 'pure' ,
    copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
    license: 'https://github.com/zloirock/core-js/blob/v3.32.0/LICENSE',
    source: 'https://github.com/zloirock/core-js'
  });

  var sharedExports = shared$3.exports;

  var requireObjectCoercible$1 = requireObjectCoercible$3;

  var $Object$2 = Object;

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject$6 = function (argument) {
    return $Object$2(requireObjectCoercible$1(argument));
  };

  var uncurryThis$f = functionUncurryThis;
  var toObject$5 = toObject$6;

  var hasOwnProperty = uncurryThis$f({}.hasOwnProperty);

  // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty
  // eslint-disable-next-line es/no-object-hasown -- safe
  var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty(toObject$5(it), key);
  };

  var uncurryThis$e = functionUncurryThis;

  var id = 0;
  var postfix = Math.random();
  var toString$5 = uncurryThis$e(1.0.toString);

  var uid$2 = function (key) {
    return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$5(++id + postfix, 36);
  };

  var global$b = global$h;
  var shared$2 = sharedExports;
  var hasOwn$a = hasOwnProperty_1;
  var uid$1 = uid$2;
  var NATIVE_SYMBOL = symbolConstructorDetection;
  var USE_SYMBOL_AS_UID = useSymbolAsUid;

  var Symbol$1 = global$b.Symbol;
  var WellKnownSymbolsStore = shared$2('wks');
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1['for'] || Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

  var wellKnownSymbol$g = function (name) {
    if (!hasOwn$a(WellKnownSymbolsStore, name)) {
      WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn$a(Symbol$1, name)
        ? Symbol$1[name]
        : createWellKnownSymbol('Symbol.' + name);
    } return WellKnownSymbolsStore[name];
  };

  var call$c = functionCall;
  var isObject$9 = isObject$b;
  var isSymbol$1 = isSymbol$2;
  var getMethod$2 = getMethod$3;
  var ordinaryToPrimitive = ordinaryToPrimitive$1;
  var wellKnownSymbol$f = wellKnownSymbol$g;

  var $TypeError$c = TypeError;
  var TO_PRIMITIVE = wellKnownSymbol$f('toPrimitive');

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  var toPrimitive$1 = function (input, pref) {
    if (!isObject$9(input) || isSymbol$1(input)) return input;
    var exoticToPrim = getMethod$2(input, TO_PRIMITIVE);
    var result;
    if (exoticToPrim) {
      if (pref === undefined) pref = 'default';
      result = call$c(exoticToPrim, input, pref);
      if (!isObject$9(result) || isSymbol$1(result)) return result;
      throw $TypeError$c("Can't convert object to primitive value");
    }
    if (pref === undefined) pref = 'number';
    return ordinaryToPrimitive(input, pref);
  };

  var toPrimitive = toPrimitive$1;
  var isSymbol = isSymbol$2;

  // `ToPropertyKey` abstract operation
  // https://tc39.es/ecma262/#sec-topropertykey
  var toPropertyKey$3 = function (argument) {
    var key = toPrimitive(argument, 'string');
    return isSymbol(key) ? key : key + '';
  };

  var global$a = global$h;
  var isObject$8 = isObject$b;

  var document$3 = global$a.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS$1 = isObject$8(document$3) && isObject$8(document$3.createElement);

  var documentCreateElement$1 = function (it) {
    return EXISTS$1 ? document$3.createElement(it) : {};
  };

  var DESCRIPTORS$9 = descriptors;
  var fails$c = fails$h;
  var createElement$1 = documentCreateElement$1;

  // Thanks to IE8 for its funny defineProperty
  var ie8DomDefine = !DESCRIPTORS$9 && !fails$c(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty(createElement$1('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var DESCRIPTORS$8 = descriptors;
  var call$b = functionCall;
  var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
  var createPropertyDescriptor$5 = createPropertyDescriptor$6;
  var toIndexedObject$4 = toIndexedObject$5;
  var toPropertyKey$2 = toPropertyKey$3;
  var hasOwn$9 = hasOwnProperty_1;
  var IE8_DOM_DEFINE$1 = ie8DomDefine;

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  objectGetOwnPropertyDescriptor.f = DESCRIPTORS$8 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$4(O);
    P = toPropertyKey$2(P);
    if (IE8_DOM_DEFINE$1) try {
      return $getOwnPropertyDescriptor$1(O, P);
    } catch (error) { /* empty */ }
    if (hasOwn$9(O, P)) return createPropertyDescriptor$5(!call$b(propertyIsEnumerableModule$1.f, O, P), O[P]);
  };

  var fails$b = fails$h;
  var isCallable$c = isCallable$i;

  var replacement = /#|\.prototype\./;

  var isForced$2 = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : isCallable$c(detection) ? fails$b(detection)
      : !!detection;
  };

  var normalize = isForced$2.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced$2.data = {};
  var NATIVE = isForced$2.NATIVE = 'N';
  var POLYFILL = isForced$2.POLYFILL = 'P';

  var isForced_1 = isForced$2;

  var uncurryThis$d = functionUncurryThisClause;
  var aCallable$9 = aCallable$b;
  var NATIVE_BIND$1 = functionBindNative;

  var bind$d = uncurryThis$d(uncurryThis$d.bind);

  // optional / simple context binding
  var functionBindContext = function (fn, that) {
    aCallable$9(fn);
    return that === undefined ? fn : NATIVE_BIND$1 ? bind$d(fn, that) : function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var objectDefineProperty = {};

  var DESCRIPTORS$7 = descriptors;
  var fails$a = fails$h;

  // V8 ~ Chrome 36-
  // https://bugs.chromium.org/p/v8/issues/detail?id=3334
  var v8PrototypeDefineBug = DESCRIPTORS$7 && fails$a(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty(function () { /* empty */ }, 'prototype', {
      value: 42,
      writable: false
    }).prototype != 42;
  });

  var isObject$7 = isObject$b;

  var $String$2 = String;
  var $TypeError$b = TypeError;

  // `Assert: Type(argument) is Object`
  var anObject$a = function (argument) {
    if (isObject$7(argument)) return argument;
    throw $TypeError$b($String$2(argument) + ' is not an object');
  };

  var DESCRIPTORS$6 = descriptors;
  var IE8_DOM_DEFINE = ie8DomDefine;
  var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
  var anObject$9 = anObject$a;
  var toPropertyKey$1 = toPropertyKey$3;

  var $TypeError$a = TypeError;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty = Object.defineProperty;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var ENUMERABLE = 'enumerable';
  var CONFIGURABLE$1 = 'configurable';
  var WRITABLE = 'writable';

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  objectDefineProperty.f = DESCRIPTORS$6 ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
    anObject$9(O);
    P = toPropertyKey$1(P);
    anObject$9(Attributes);
    if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
      var current = $getOwnPropertyDescriptor(O, P);
      if (current && current[WRITABLE]) {
        O[P] = Attributes.value;
        Attributes = {
          configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
          enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
          writable: false
        };
      }
    } return $defineProperty(O, P, Attributes);
  } : $defineProperty : function defineProperty(O, P, Attributes) {
    anObject$9(O);
    P = toPropertyKey$1(P);
    anObject$9(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw $TypeError$a('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var DESCRIPTORS$5 = descriptors;
  var definePropertyModule$3 = objectDefineProperty;
  var createPropertyDescriptor$4 = createPropertyDescriptor$6;

  var createNonEnumerableProperty$8 = DESCRIPTORS$5 ? function (object, key, value) {
    return definePropertyModule$3.f(object, key, createPropertyDescriptor$4(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var global$9 = global$h;
  var apply$1 = functionApply;
  var uncurryThis$c = functionUncurryThisClause;
  var isCallable$b = isCallable$i;
  var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
  var isForced$1 = isForced_1;
  var path$4 = path$6;
  var bind$c = functionBindContext;
  var createNonEnumerableProperty$7 = createNonEnumerableProperty$8;
  var hasOwn$8 = hasOwnProperty_1;

  var wrapConstructor = function (NativeConstructor) {
    var Wrapper = function (a, b, c) {
      if (this instanceof Wrapper) {
        switch (arguments.length) {
          case 0: return new NativeConstructor();
          case 1: return new NativeConstructor(a);
          case 2: return new NativeConstructor(a, b);
        } return new NativeConstructor(a, b, c);
      } return apply$1(NativeConstructor, this, arguments);
    };
    Wrapper.prototype = NativeConstructor.prototype;
    return Wrapper;
  };

  /*
    options.target         - name of the target object
    options.global         - target is the global object
    options.stat           - export as static methods of target
    options.proto          - export as prototype methods of target
    options.real           - real prototype method for the `pure` version
    options.forced         - export even if the native feature is available
    options.bind           - bind methods to the target, required for the `pure` version
    options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe         - use the simple assignment of property instead of delete + defineProperty
    options.sham           - add a flag to not completely full polyfills
    options.enumerable     - export as enumerable property
    options.dontCallGetSet - prevent calling a getter on target
    options.name           - the .name of the function if it does not match the key
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var PROTO = options.proto;

    var nativeSource = GLOBAL ? global$9 : STATIC ? global$9[TARGET] : (global$9[TARGET] || {}).prototype;

    var target = GLOBAL ? path$4 : path$4[TARGET] || createNonEnumerableProperty$7(path$4, TARGET, {})[TARGET];
    var targetPrototype = target.prototype;

    var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
    var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

    for (key in source) {
      FORCED = isForced$1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contains in native
      USE_NATIVE = !FORCED && nativeSource && hasOwn$8(nativeSource, key);

      targetProperty = target[key];

      if (USE_NATIVE) if (options.dontCallGetSet) {
        descriptor = getOwnPropertyDescriptor$2(nativeSource, key);
        nativeProperty = descriptor && descriptor.value;
      } else nativeProperty = nativeSource[key];

      // export native or implementation
      sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

      if (USE_NATIVE && typeof targetProperty == typeof sourceProperty) continue;

      // bind methods to global for calling from export context
      if (options.bind && USE_NATIVE) resultProperty = bind$c(sourceProperty, global$9);
      // wrap global constructors for prevent changes in this version
      else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
      // make static versions for prototype methods
      else if (PROTO && isCallable$b(sourceProperty)) resultProperty = uncurryThis$c(sourceProperty);
      // default case
      else resultProperty = sourceProperty;

      // add a flag to not completely full polyfills
      if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty$7(resultProperty, 'sham', true);
      }

      createNonEnumerableProperty$7(target, key, resultProperty);

      if (PROTO) {
        VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
        if (!hasOwn$8(path$4, VIRTUAL_PROTOTYPE)) {
          createNonEnumerableProperty$7(path$4, VIRTUAL_PROTOTYPE, {});
        }
        // export virtual prototype methods
        createNonEnumerableProperty$7(path$4[VIRTUAL_PROTOTYPE], key, sourceProperty);
        // export real prototype methods
        if (options.real && targetPrototype && (FORCED || !targetPrototype[key])) {
          createNonEnumerableProperty$7(targetPrototype, key, sourceProperty);
        }
      }
    }
  };

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `Math.trunc` method
  // https://tc39.es/ecma262/#sec-math.trunc
  // eslint-disable-next-line es/no-math-trunc -- safe
  var mathTrunc = Math.trunc || function trunc(x) {
    var n = +x;
    return (n > 0 ? floor : ceil)(n);
  };

  var trunc = mathTrunc;

  // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity
  var toIntegerOrInfinity$4 = function (argument) {
    var number = +argument;
    // eslint-disable-next-line no-self-compare -- NaN check
    return number !== number || number === 0 ? 0 : trunc(number);
  };

  var toIntegerOrInfinity$3 = toIntegerOrInfinity$4;

  var max$1 = Math.max;
  var min$2 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex$2 = function (index, length) {
    var integer = toIntegerOrInfinity$3(index);
    return integer < 0 ? max$1(integer + length, 0) : min$2(integer, length);
  };

  var toIntegerOrInfinity$2 = toIntegerOrInfinity$4;

  var min$1 = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength$1 = function (argument) {
    return argument > 0 ? min$1(toIntegerOrInfinity$2(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var toLength = toLength$1;

  // `LengthOfArrayLike` abstract operation
  // https://tc39.es/ecma262/#sec-lengthofarraylike
  var lengthOfArrayLike$4 = function (obj) {
    return toLength(obj.length);
  };

  var toIndexedObject$3 = toIndexedObject$5;
  var toAbsoluteIndex$1 = toAbsoluteIndex$2;
  var lengthOfArrayLike$3 = lengthOfArrayLike$4;

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod$2 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$3($this);
      var length = lengthOfArrayLike$3(O);
      var index = toAbsoluteIndex$1(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare -- NaN check
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod$2(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$2(false)
  };

  var hiddenKeys$4 = {};

  var uncurryThis$b = functionUncurryThis;
  var hasOwn$7 = hasOwnProperty_1;
  var toIndexedObject$2 = toIndexedObject$5;
  var indexOf$6 = arrayIncludes.indexOf;
  var hiddenKeys$3 = hiddenKeys$4;

  var push$2 = uncurryThis$b([].push);

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject$2(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !hasOwn$7(hiddenKeys$3, key) && hasOwn$7(O, key) && push$2(result, key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (hasOwn$7(O, key = names[i++])) {
      ~indexOf$6(result, key) || push$2(result, key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys$3 = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var internalObjectKeys$1 = objectKeysInternal;
  var enumBugKeys$2 = enumBugKeys$3;

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe
  var objectKeys$2 = Object.keys || function keys(O) {
    return internalObjectKeys$1(O, enumBugKeys$2);
  };

  var objectGetOwnPropertySymbols = {};

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

  var DESCRIPTORS$4 = descriptors;
  var uncurryThis$a = functionUncurryThis;
  var call$a = functionCall;
  var fails$9 = fails$h;
  var objectKeys$1 = objectKeys$2;
  var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
  var propertyIsEnumerableModule = objectPropertyIsEnumerable;
  var toObject$4 = toObject$6;
  var IndexedObject$1 = indexedObject;

  // eslint-disable-next-line es/no-object-assign -- safe
  var $assign = Object.assign;
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  var defineProperty$2 = Object.defineProperty;
  var concat$2 = uncurryThis$a([].concat);

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  var objectAssign = !$assign || fails$9(function () {
    // should have correct order of operations (Edge bug)
    if (DESCRIPTORS$4 && $assign({ b: 1 }, $assign(defineProperty$2({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty$2(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), { b: 2 })).b !== 1) return true;
    // should work with symbols and should have deterministic property order (V8 bug)
    var A = {};
    var B = {};
    // eslint-disable-next-line es/no-symbol -- safe
    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) { B[chr] = chr; });
    return $assign({}, A)[symbol] != 7 || objectKeys$1($assign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
    var T = toObject$4(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
    var propertyIsEnumerable = propertyIsEnumerableModule.f;
    while (argumentsLength > index) {
      var S = IndexedObject$1(arguments[index++]);
      var keys = getOwnPropertySymbols ? concat$2(objectKeys$1(S), getOwnPropertySymbols(S)) : objectKeys$1(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!DESCRIPTORS$4 || call$a(propertyIsEnumerable, S, key)) T[key] = S[key];
      }
    } return T;
  } : $assign;

  var $$j = _export;
  var assign$5 = objectAssign;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  // eslint-disable-next-line es/no-object-assign -- required for testing
  $$j({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign$5 }, {
    assign: assign$5
  });

  var path$3 = path$6;

  var assign$4 = path$3.Object.assign;

  var parent$n = assign$4;

  var assign$3 = parent$n;

  var parent$m = assign$3;

  var assign$2 = parent$m;

  var parent$l = assign$2;

  var assign$1 = parent$l;

  var assign = assign$1;

  var _Object$assign = /*@__PURE__*/getDefaultExportFromCjs(assign);

  var uncurryThis$9 = functionUncurryThis;

  var arraySlice$2 = uncurryThis$9([].slice);

  var uncurryThis$8 = functionUncurryThis;
  var aCallable$8 = aCallable$b;
  var isObject$6 = isObject$b;
  var hasOwn$6 = hasOwnProperty_1;
  var arraySlice$1 = arraySlice$2;
  var NATIVE_BIND = functionBindNative;

  var $Function = Function;
  var concat$1 = uncurryThis$8([].concat);
  var join = uncurryThis$8([].join);
  var factories = {};

  var construct$1 = function (C, argsLength, args) {
    if (!hasOwn$6(factories, argsLength)) {
      for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
      factories[argsLength] = $Function('C,a', 'return new C(' + join(list, ',') + ')');
    } return factories[argsLength](C, args);
  };

  // `Function.prototype.bind` method implementation
  // https://tc39.es/ecma262/#sec-function.prototype.bind
  // eslint-disable-next-line es/no-function-prototype-bind -- detection
  var functionBind = NATIVE_BIND ? $Function.bind : function bind(that /* , ...args */) {
    var F = aCallable$8(this);
    var Prototype = F.prototype;
    var partArgs = arraySlice$1(arguments, 1);
    var boundFunction = function bound(/* args... */) {
      var args = concat$1(partArgs, arraySlice$1(arguments));
      return this instanceof boundFunction ? construct$1(F, args.length, args) : F.apply(that, args);
    };
    if (isObject$6(Prototype)) boundFunction.prototype = Prototype;
    return boundFunction;
  };

  // TODO: Remove from `core-js@4`
  var $$i = _export;
  var bind$b = functionBind;

  // `Function.prototype.bind` method
  // https://tc39.es/ecma262/#sec-function.prototype.bind
  // eslint-disable-next-line es/no-function-prototype-bind -- detection
  $$i({ target: 'Function', proto: true, forced: Function.bind !== bind$b }, {
    bind: bind$b
  });

  var path$2 = path$6;

  var entryVirtual$5 = function (CONSTRUCTOR) {
    return path$2[CONSTRUCTOR + 'Prototype'];
  };

  var entryVirtual$4 = entryVirtual$5;

  var bind$a = entryVirtual$4('Function').bind;

  var isPrototypeOf$7 = objectIsPrototypeOf;
  var method$4 = bind$a;

  var FunctionPrototype$1 = Function.prototype;

  var bind$9 = function (it) {
    var own = it.bind;
    return it === FunctionPrototype$1 || (isPrototypeOf$7(FunctionPrototype$1, it) && own === FunctionPrototype$1.bind) ? method$4 : own;
  };

  var parent$k = bind$9;

  var bind$8 = parent$k;

  var parent$j = bind$8;

  var bind$7 = parent$j;

  var parent$i = bind$7;

  var bind$6 = parent$i;

  var bind$5 = bind$6;

  var _bindInstanceProperty = /*@__PURE__*/getDefaultExportFromCjs(bind$5);

  function _extends() {
    var _context;
    _extends = _Object$assign ? _bindInstanceProperty(_context = _Object$assign).call(_context) : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }

  var $$h = _export;
  var toObject$3 = toObject$6;
  var nativeKeys = objectKeys$2;
  var fails$8 = fails$h;

  var FAILS_ON_PRIMITIVES = fails$8(function () { nativeKeys(1); });

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  $$h({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
    keys: function keys(it) {
      return nativeKeys(toObject$3(it));
    }
  });

  var path$1 = path$6;

  var keys$6 = path$1.Object.keys;

  var parent$h = keys$6;

  var keys$5 = parent$h;

  var parent$g = keys$5;

  var keys$4 = parent$g;

  var parent$f = keys$4;

  var keys$3 = parent$f;

  var keys$2 = keys$3;

  var _Object$keys$1 = /*@__PURE__*/getDefaultExportFromCjs(keys$2);

  var fails$7 = fails$h;

  var arrayMethodIsStrict$1 = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails$7(function () {
      // eslint-disable-next-line no-useless-call -- required for testing
      method.call(null, argument || function () { return 1; }, 1);
    });
  };

  /* eslint-disable es/no-array-prototype-indexof -- required for testing */
  var $$g = _export;
  var uncurryThis$7 = functionUncurryThisClause;
  var $indexOf = arrayIncludes.indexOf;
  var arrayMethodIsStrict = arrayMethodIsStrict$1;

  var nativeIndexOf = uncurryThis$7([].indexOf);

  var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
  var FORCED = NEGATIVE_ZERO || !arrayMethodIsStrict('indexOf');

  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  $$g({ target: 'Array', proto: true, forced: FORCED }, {
    indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
      var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
      return NEGATIVE_ZERO
        // convert -0 to +0
        ? nativeIndexOf(this, searchElement, fromIndex) || 0
        : $indexOf(this, searchElement, fromIndex);
    }
  });

  var entryVirtual$3 = entryVirtual$5;

  var indexOf$5 = entryVirtual$3('Array').indexOf;

  var isPrototypeOf$6 = objectIsPrototypeOf;
  var method$3 = indexOf$5;

  var ArrayPrototype$4 = Array.prototype;

  var indexOf$4 = function (it) {
    var own = it.indexOf;
    return it === ArrayPrototype$4 || (isPrototypeOf$6(ArrayPrototype$4, it) && own === ArrayPrototype$4.indexOf) ? method$3 : own;
  };

  var parent$e = indexOf$4;

  var indexOf$3 = parent$e;

  var parent$d = indexOf$3;

  var indexOf$2 = parent$d;

  var parent$c = indexOf$2;

  var indexOf$1 = parent$c;

  var indexOf = indexOf$1;

  var _indexOfInstanceProperty = /*@__PURE__*/getDefaultExportFromCjs(indexOf);

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = _Object$keys$1(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (_indexOfInstanceProperty(excluded).call(excluded, key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }

  var keys$1 = keys$2;

  var _Object$keys = /*@__PURE__*/getDefaultExportFromCjs(keys$1);

  var shared$1 = sharedExports;
  var uid = uid$2;

  var keys = shared$1('keys');

  var sharedKey$3 = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var fails$6 = fails$h;

  var correctPrototypeGetter = !fails$6(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var hasOwn$5 = hasOwnProperty_1;
  var isCallable$a = isCallable$i;
  var toObject$2 = toObject$6;
  var sharedKey$2 = sharedKey$3;
  var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

  var IE_PROTO$1 = sharedKey$2('IE_PROTO');
  var $Object$1 = Object;
  var ObjectPrototype = $Object$1.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  // eslint-disable-next-line es/no-object-getprototypeof -- safe
  var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object$1.getPrototypeOf : function (O) {
    var object = toObject$2(O);
    if (hasOwn$5(object, IE_PROTO$1)) return object[IE_PROTO$1];
    var constructor = object.constructor;
    if (isCallable$a(constructor) && object instanceof constructor) {
      return constructor.prototype;
    } return object instanceof $Object$1 ? ObjectPrototype : null;
  };

  var uncurryThis$6 = functionUncurryThis;
  var aCallable$7 = aCallable$b;

  var functionUncurryThisAccessor = function (object, key, method) {
    try {
      // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
      return uncurryThis$6(aCallable$7(Object.getOwnPropertyDescriptor(object, key)[method]));
    } catch (error) { /* empty */ }
  };

  var isCallable$9 = isCallable$i;

  var $String$1 = String;
  var $TypeError$9 = TypeError;

  var aPossiblePrototype$1 = function (argument) {
    if (typeof argument == 'object' || isCallable$9(argument)) return argument;
    throw $TypeError$9("Can't set " + $String$1(argument) + ' as a prototype');
  };

  /* eslint-disable no-proto -- safe */
  var uncurryThisAccessor = functionUncurryThisAccessor;
  var anObject$8 = anObject$a;
  var aPossiblePrototype = aPossiblePrototype$1;

  // `Object.setPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  // eslint-disable-next-line es/no-object-setprototypeof -- safe
  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
      setter(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      anObject$8(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var objectGetOwnPropertyNames = {};

  var internalObjectKeys = objectKeysInternal;
  var enumBugKeys$1 = enumBugKeys$3;

  var hiddenKeys$2 = enumBugKeys$1.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  // eslint-disable-next-line es/no-object-getownpropertynames -- safe
  objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return internalObjectKeys(O, hiddenKeys$2);
  };

  var getBuiltIn$6 = getBuiltIn$8;
  var uncurryThis$5 = functionUncurryThis;
  var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
  var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
  var anObject$7 = anObject$a;

  var concat = uncurryThis$5([].concat);

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn$6('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = getOwnPropertyNamesModule.f(anObject$7(it));
    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
  };

  var hasOwn$4 = hasOwnProperty_1;
  var ownKeys = ownKeys$1;
  var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
  var definePropertyModule$2 = objectDefineProperty;

  var copyConstructorProperties$1 = function (target, source, exceptions) {
    var keys = ownKeys(source);
    var defineProperty = definePropertyModule$2.f;
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!hasOwn$4(target, key) && !(exceptions && hasOwn$4(exceptions, key))) {
        defineProperty(target, key, getOwnPropertyDescriptor(source, key));
      }
    }
  };

  var objectDefineProperties = {};

  var DESCRIPTORS$3 = descriptors;
  var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
  var definePropertyModule$1 = objectDefineProperty;
  var anObject$6 = anObject$a;
  var toIndexedObject$1 = toIndexedObject$5;
  var objectKeys = objectKeys$2;

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe
  objectDefineProperties.f = DESCRIPTORS$3 && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$6(O);
    var props = toIndexedObject$1(Properties);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) definePropertyModule$1.f(O, key = keys[index++], props[key]);
    return O;
  };

  var getBuiltIn$5 = getBuiltIn$8;

  var html$2 = getBuiltIn$5('document', 'documentElement');

  /* global ActiveXObject -- old IE, WSH */
  var anObject$5 = anObject$a;
  var definePropertiesModule = objectDefineProperties;
  var enumBugKeys = enumBugKeys$3;
  var hiddenKeys$1 = hiddenKeys$4;
  var html$1 = html$2;
  var documentCreateElement = documentCreateElement$1;
  var sharedKey$1 = sharedKey$3;

  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO = sharedKey$1('IE_PROTO');

  var EmptyConstructor = function () { /* empty */ };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html$1.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var NullProtoObject = function () {
    try {
      activeXDocument = new ActiveXObject('htmlfile');
    } catch (error) { /* ignore */ }
    NullProtoObject = typeof document != 'undefined'
      ? document.domain && activeXDocument
        ? NullProtoObjectViaActiveX(activeXDocument) // old IE
        : NullProtoObjectViaIFrame()
      : NullProtoObjectViaActiveX(activeXDocument); // WSH
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys$1[IE_PROTO] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  // eslint-disable-next-line es/no-object-create -- safe
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject$5(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
  };

  var isObject$5 = isObject$b;
  var createNonEnumerableProperty$6 = createNonEnumerableProperty$8;

  // `InstallErrorCause` abstract operation
  // https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
  var installErrorCause$1 = function (O, options) {
    if (isObject$5(options) && 'cause' in options) {
      createNonEnumerableProperty$6(O, 'cause', options.cause);
    }
  };

  var uncurryThis$4 = functionUncurryThis;

  var $Error$1 = Error;
  var replace = uncurryThis$4(''.replace);

  var TEST = (function (arg) { return String($Error$1(arg).stack); })('zxcasd');
  // eslint-disable-next-line redos/no-vulnerable -- safe
  var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
  var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

  var errorStackClear = function (stack, dropEntries) {
    if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error$1.prepareStackTrace) {
      while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
    } return stack;
  };

  var fails$5 = fails$h;
  var createPropertyDescriptor$3 = createPropertyDescriptor$6;

  var errorStackInstallable = !fails$5(function () {
    var error = Error('a');
    if (!('stack' in error)) return true;
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty(error, 'stack', createPropertyDescriptor$3(1, 7));
    return error.stack !== 7;
  });

  var createNonEnumerableProperty$5 = createNonEnumerableProperty$8;
  var clearErrorStack = errorStackClear;
  var ERROR_STACK_INSTALLABLE = errorStackInstallable;

  // non-standard V8
  var captureStackTrace = Error.captureStackTrace;

  var errorStackInstall = function (error, C, stack, dropEntries) {
    if (ERROR_STACK_INSTALLABLE) {
      if (captureStackTrace) captureStackTrace(error, C);
      else createNonEnumerableProperty$5(error, 'stack', clearErrorStack(stack, dropEntries));
    }
  };

  var iterators = {};

  var wellKnownSymbol$e = wellKnownSymbol$g;
  var Iterators$5 = iterators;

  var ITERATOR$4 = wellKnownSymbol$e('iterator');
  var ArrayPrototype$3 = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod$1 = function (it) {
    return it !== undefined && (Iterators$5.Array === it || ArrayPrototype$3[ITERATOR$4] === it);
  };

  var wellKnownSymbol$d = wellKnownSymbol$g;

  var TO_STRING_TAG$4 = wellKnownSymbol$d('toStringTag');
  var test = {};

  test[TO_STRING_TAG$4] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
  var isCallable$8 = isCallable$i;
  var classofRaw = classofRaw$2;
  var wellKnownSymbol$c = wellKnownSymbol$g;

  var TO_STRING_TAG$3 = wellKnownSymbol$c('toStringTag');
  var $Object = Object;

  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof$7 = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG$3)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && isCallable$8(O.callee) ? 'Arguments' : result;
  };

  var classof$6 = classof$7;
  var getMethod$1 = getMethod$3;
  var isNullOrUndefined$1 = isNullOrUndefined$4;
  var Iterators$4 = iterators;
  var wellKnownSymbol$b = wellKnownSymbol$g;

  var ITERATOR$3 = wellKnownSymbol$b('iterator');

  var getIteratorMethod$2 = function (it) {
    if (!isNullOrUndefined$1(it)) return getMethod$1(it, ITERATOR$3)
      || getMethod$1(it, '@@iterator')
      || Iterators$4[classof$6(it)];
  };

  var call$9 = functionCall;
  var aCallable$6 = aCallable$b;
  var anObject$4 = anObject$a;
  var tryToString$3 = tryToString$5;
  var getIteratorMethod$1 = getIteratorMethod$2;

  var $TypeError$8 = TypeError;

  var getIterator$1 = function (argument, usingIterator) {
    var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
    if (aCallable$6(iteratorMethod)) return anObject$4(call$9(iteratorMethod, argument));
    throw $TypeError$8(tryToString$3(argument) + ' is not iterable');
  };

  var call$8 = functionCall;
  var anObject$3 = anObject$a;
  var getMethod = getMethod$3;

  var iteratorClose$1 = function (iterator, kind, value) {
    var innerResult, innerError;
    anObject$3(iterator);
    try {
      innerResult = getMethod(iterator, 'return');
      if (!innerResult) {
        if (kind === 'throw') throw value;
        return value;
      }
      innerResult = call$8(innerResult, iterator);
    } catch (error) {
      innerError = true;
      innerResult = error;
    }
    if (kind === 'throw') throw value;
    if (innerError) throw innerResult;
    anObject$3(innerResult);
    return value;
  };

  var bind$4 = functionBindContext;
  var call$7 = functionCall;
  var anObject$2 = anObject$a;
  var tryToString$2 = tryToString$5;
  var isArrayIteratorMethod = isArrayIteratorMethod$1;
  var lengthOfArrayLike$2 = lengthOfArrayLike$4;
  var isPrototypeOf$5 = objectIsPrototypeOf;
  var getIterator = getIterator$1;
  var getIteratorMethod = getIteratorMethod$2;
  var iteratorClose = iteratorClose$1;

  var $TypeError$7 = TypeError;

  var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  var ResultPrototype = Result.prototype;

  var iterate$5 = function (iterable, unboundFunction, options) {
    var that = options && options.that;
    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
    var IS_RECORD = !!(options && options.IS_RECORD);
    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
    var INTERRUPTED = !!(options && options.INTERRUPTED);
    var fn = bind$4(unboundFunction, that);
    var iterator, iterFn, index, length, result, next, step;

    var stop = function (condition) {
      if (iterator) iteratorClose(iterator, 'normal', condition);
      return new Result(true, condition);
    };

    var callFn = function (value) {
      if (AS_ENTRIES) {
        anObject$2(value);
        return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
      } return INTERRUPTED ? fn(value, stop) : fn(value);
    };

    if (IS_RECORD) {
      iterator = iterable.iterator;
    } else if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (!iterFn) throw $TypeError$7(tryToString$2(iterable) + ' is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = lengthOfArrayLike$2(iterable); length > index; index++) {
          result = callFn(iterable[index]);
          if (result && isPrototypeOf$5(ResultPrototype, result)) return result;
        } return new Result(false);
      }
      iterator = getIterator(iterable, iterFn);
    }

    next = IS_RECORD ? iterable.next : iterator.next;
    while (!(step = call$7(next, iterator)).done) {
      try {
        result = callFn(step.value);
      } catch (error) {
        iteratorClose(iterator, 'throw', error);
      }
      if (typeof result == 'object' && result && isPrototypeOf$5(ResultPrototype, result)) return result;
    } return new Result(false);
  };

  var classof$5 = classof$7;

  var $String = String;

  var toString$4 = function (argument) {
    if (classof$5(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
    return $String(argument);
  };

  var toString$3 = toString$4;

  var normalizeStringArgument$1 = function (argument, $default) {
    return argument === undefined ? arguments.length < 2 ? '' : $default : toString$3(argument);
  };

  var $$f = _export;
  var isPrototypeOf$4 = objectIsPrototypeOf;
  var getPrototypeOf$2 = objectGetPrototypeOf;
  var setPrototypeOf = objectSetPrototypeOf;
  var copyConstructorProperties = copyConstructorProperties$1;
  var create$2 = objectCreate;
  var createNonEnumerableProperty$4 = createNonEnumerableProperty$8;
  var createPropertyDescriptor$2 = createPropertyDescriptor$6;
  var installErrorCause = installErrorCause$1;
  var installErrorStack = errorStackInstall;
  var iterate$4 = iterate$5;
  var normalizeStringArgument = normalizeStringArgument$1;
  var wellKnownSymbol$a = wellKnownSymbol$g;

  var TO_STRING_TAG$2 = wellKnownSymbol$a('toStringTag');
  var $Error = Error;
  var push$1 = [].push;

  var $AggregateError = function AggregateError(errors, message /* , options */) {
    var isInstance = isPrototypeOf$4(AggregateErrorPrototype, this);
    var that;
    if (setPrototypeOf) {
      that = setPrototypeOf($Error(), isInstance ? getPrototypeOf$2(this) : AggregateErrorPrototype);
    } else {
      that = isInstance ? this : create$2(AggregateErrorPrototype);
      createNonEnumerableProperty$4(that, TO_STRING_TAG$2, 'Error');
    }
    if (message !== undefined) createNonEnumerableProperty$4(that, 'message', normalizeStringArgument(message));
    installErrorStack(that, $AggregateError, that.stack, 1);
    if (arguments.length > 2) installErrorCause(that, arguments[2]);
    var errorsArray = [];
    iterate$4(errors, push$1, { that: errorsArray });
    createNonEnumerableProperty$4(that, 'errors', errorsArray);
    return that;
  };

  if (setPrototypeOf) setPrototypeOf($AggregateError, $Error);
  else copyConstructorProperties($AggregateError, $Error, { name: true });

  var AggregateErrorPrototype = $AggregateError.prototype = create$2($Error.prototype, {
    constructor: createPropertyDescriptor$2(1, $AggregateError),
    message: createPropertyDescriptor$2(1, ''),
    name: createPropertyDescriptor$2(1, 'AggregateError')
  });

  // `AggregateError` constructor
  // https://tc39.es/ecma262/#sec-aggregate-error-constructor
  $$f({ global: true, constructor: true, arity: 2 }, {
    AggregateError: $AggregateError
  });

  var global$8 = global$h;
  var isCallable$7 = isCallable$i;

  var WeakMap$1 = global$8.WeakMap;

  var weakMapBasicDetection = isCallable$7(WeakMap$1) && /native code/.test(String(WeakMap$1));

  var NATIVE_WEAK_MAP = weakMapBasicDetection;
  var global$7 = global$h;
  var isObject$4 = isObject$b;
  var createNonEnumerableProperty$3 = createNonEnumerableProperty$8;
  var hasOwn$3 = hasOwnProperty_1;
  var shared = sharedStore;
  var sharedKey = sharedKey$3;
  var hiddenKeys = hiddenKeys$4;

  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var TypeError$2 = global$7.TypeError;
  var WeakMap = global$7.WeakMap;
  var set$1, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set$1(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject$4(it) || (state = get(it)).type !== TYPE) {
        throw TypeError$2('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (NATIVE_WEAK_MAP || shared.state) {
    var store$1 = shared.state || (shared.state = new WeakMap());
    /* eslint-disable no-self-assign -- prototype methods protection */
    store$1.get = store$1.get;
    store$1.has = store$1.has;
    store$1.set = store$1.set;
    /* eslint-enable no-self-assign -- prototype methods protection */
    set$1 = function (it, metadata) {
      if (store$1.has(it)) throw TypeError$2(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      store$1.set(it, metadata);
      return metadata;
    };
    get = function (it) {
      return store$1.get(it) || {};
    };
    has = function (it) {
      return store$1.has(it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys[STATE] = true;
    set$1 = function (it, metadata) {
      if (hasOwn$3(it, STATE)) throw TypeError$2(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty$3(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return hasOwn$3(it, STATE) ? it[STATE] : {};
    };
    has = function (it) {
      return hasOwn$3(it, STATE);
    };
  }

  var internalState = {
    set: set$1,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var DESCRIPTORS$2 = descriptors;
  var hasOwn$2 = hasOwnProperty_1;

  var FunctionPrototype = Function.prototype;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getDescriptor = DESCRIPTORS$2 && Object.getOwnPropertyDescriptor;

  var EXISTS = hasOwn$2(FunctionPrototype, 'name');
  // additional protection from minified / mangled / dropped function names
  var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
  var CONFIGURABLE = EXISTS && (!DESCRIPTORS$2 || (DESCRIPTORS$2 && getDescriptor(FunctionPrototype, 'name').configurable));

  var functionName = {
    EXISTS: EXISTS,
    PROPER: PROPER,
    CONFIGURABLE: CONFIGURABLE
  };

  var createNonEnumerableProperty$2 = createNonEnumerableProperty$8;

  var defineBuiltIn$3 = function (target, key, value, options) {
    if (options && options.enumerable) target[key] = value;
    else createNonEnumerableProperty$2(target, key, value);
    return target;
  };

  var fails$4 = fails$h;
  var isCallable$6 = isCallable$i;
  var isObject$3 = isObject$b;
  var create$1 = objectCreate;
  var getPrototypeOf$1 = objectGetPrototypeOf;
  var defineBuiltIn$2 = defineBuiltIn$3;
  var wellKnownSymbol$9 = wellKnownSymbol$g;

  var ITERATOR$2 = wellKnownSymbol$9('iterator');
  var BUGGY_SAFARI_ITERATORS$1 = false;

  // `%IteratorPrototype%` object
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype$1, PrototypeOfArrayIteratorPrototype, arrayIterator;

  /* eslint-disable es/no-array-prototype-keys -- safe */
  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
    else {
      PrototypeOfArrayIteratorPrototype = getPrototypeOf$1(getPrototypeOf$1(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$1 = PrototypeOfArrayIteratorPrototype;
    }
  }

  var NEW_ITERATOR_PROTOTYPE = !isObject$3(IteratorPrototype$1) || fails$4(function () {
    var test = {};
    // FF44- legacy iterators case
    return IteratorPrototype$1[ITERATOR$2].call(test) !== test;
  });

  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$1 = {};
  else IteratorPrototype$1 = create$1(IteratorPrototype$1);

  // `%IteratorPrototype%[@@iterator]()` method
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
  if (!isCallable$6(IteratorPrototype$1[ITERATOR$2])) {
    defineBuiltIn$2(IteratorPrototype$1, ITERATOR$2, function () {
      return this;
    });
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype$1,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
  };

  var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
  var classof$4 = classof$7;

  // `Object.prototype.toString` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
    return '[object ' + classof$4(this) + ']';
  };

  var TO_STRING_TAG_SUPPORT = toStringTagSupport;
  var defineProperty$1 = objectDefineProperty.f;
  var createNonEnumerableProperty$1 = createNonEnumerableProperty$8;
  var hasOwn$1 = hasOwnProperty_1;
  var toString$2 = objectToString;
  var wellKnownSymbol$8 = wellKnownSymbol$g;

  var TO_STRING_TAG$1 = wellKnownSymbol$8('toStringTag');

  var setToStringTag$3 = function (it, TAG, STATIC, SET_METHOD) {
    if (it) {
      var target = STATIC ? it : it.prototype;
      if (!hasOwn$1(target, TO_STRING_TAG$1)) {
        defineProperty$1(target, TO_STRING_TAG$1, { configurable: true, value: TAG });
      }
      if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
        createNonEnumerableProperty$1(target, 'toString', toString$2);
      }
    }
  };

  var IteratorPrototype = iteratorsCore.IteratorPrototype;
  var create = objectCreate;
  var createPropertyDescriptor$1 = createPropertyDescriptor$6;
  var setToStringTag$2 = setToStringTag$3;
  var Iterators$3 = iterators;

  var returnThis$1 = function () { return this; };

  var iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor$1(+!ENUMERABLE_NEXT, next) });
    setToStringTag$2(IteratorConstructor, TO_STRING_TAG, false, true);
    Iterators$3[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var $$e = _export;
  var call$6 = functionCall;
  var FunctionName = functionName;
  var createIteratorConstructor = iteratorCreateConstructor;
  var getPrototypeOf = objectGetPrototypeOf;
  var setToStringTag$1 = setToStringTag$3;
  var defineBuiltIn$1 = defineBuiltIn$3;
  var wellKnownSymbol$7 = wellKnownSymbol$g;
  var Iterators$2 = iterators;
  var IteratorsCore = iteratorsCore;

  var PROPER_FUNCTION_NAME = FunctionName.PROPER;
  FunctionName.CONFIGURABLE;
  IteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$1 = wellKnownSymbol$7('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis = function () { return this; };

  var iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$1]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        setToStringTag$1(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
        Iterators$2[TO_STRING_TAG] = returnThis;
      }
    }

    // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
    if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      {
        INCORRECT_VALUES_NAME = true;
        defaultIterator = function values() { return call$6(nativeIterator, this); };
      }
    }

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          defineBuiltIn$1(IterablePrototype, KEY, methods[KEY]);
        }
      } else $$e({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
    }

    // define iterator
    if ((FORCED) && IterablePrototype[ITERATOR$1] !== defaultIterator) {
      defineBuiltIn$1(IterablePrototype, ITERATOR$1, defaultIterator, { name: DEFAULT });
    }
    Iterators$2[NAME] = defaultIterator;

    return methods;
  };

  // `CreateIterResultObject` abstract operation
  // https://tc39.es/ecma262/#sec-createiterresultobject
  var createIterResultObject$2 = function (value, done) {
    return { value: value, done: done };
  };

  var toIndexedObject = toIndexedObject$5;
  var Iterators$1 = iterators;
  var InternalStateModule$2 = internalState;
  objectDefineProperty.f;
  var defineIterator$1 = iteratorDefine;
  var createIterResultObject$1 = createIterResultObject$2;

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$2 = InternalStateModule$2.set;
  var getInternalState$1 = InternalStateModule$2.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.es/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.es/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.es/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.es/ecma262/#sec-createarrayiterator
  defineIterator$1(Array, 'Array', function (iterated, kind) {
    setInternalState$2(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$1(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return createIterResultObject$1(undefined, true);
    }
    if (kind == 'keys') return createIterResultObject$1(index, false);
    if (kind == 'values') return createIterResultObject$1(target[index], false);
    return createIterResultObject$1([index, target[index]], false);
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.es/ecma262/#sec-createmappedargumentsobject
  Iterators$1.Arguments = Iterators$1.Array;

  var classof$3 = classofRaw$2;

  var engineIsNode = typeof process != 'undefined' && classof$3(process) == 'process';

  var defineProperty = objectDefineProperty;

  var defineBuiltInAccessor$1 = function (target, name, descriptor) {
    return defineProperty.f(target, name, descriptor);
  };

  var getBuiltIn$4 = getBuiltIn$8;
  var defineBuiltInAccessor = defineBuiltInAccessor$1;
  var wellKnownSymbol$6 = wellKnownSymbol$g;
  var DESCRIPTORS$1 = descriptors;

  var SPECIES$4 = wellKnownSymbol$6('species');

  var setSpecies$1 = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn$4(CONSTRUCTOR_NAME);

    if (DESCRIPTORS$1 && Constructor && !Constructor[SPECIES$4]) {
      defineBuiltInAccessor(Constructor, SPECIES$4, {
        configurable: true,
        get: function () { return this; }
      });
    }
  };

  var isPrototypeOf$3 = objectIsPrototypeOf;

  var $TypeError$6 = TypeError;

  var anInstance$1 = function (it, Prototype) {
    if (isPrototypeOf$3(Prototype, it)) return it;
    throw $TypeError$6('Incorrect invocation');
  };

  var uncurryThis$3 = functionUncurryThis;
  var isCallable$5 = isCallable$i;
  var store = sharedStore;

  var functionToString = uncurryThis$3(Function.toString);

  // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
  if (!isCallable$5(store.inspectSource)) {
    store.inspectSource = function (it) {
      return functionToString(it);
    };
  }

  var inspectSource$2 = store.inspectSource;

  var uncurryThis$2 = functionUncurryThis;
  var fails$3 = fails$h;
  var isCallable$4 = isCallable$i;
  var classof$2 = classof$7;
  var getBuiltIn$3 = getBuiltIn$8;
  var inspectSource$1 = inspectSource$2;

  var noop = function () { /* empty */ };
  var empty = [];
  var construct = getBuiltIn$3('Reflect', 'construct');
  var constructorRegExp = /^\s*(?:class|function)\b/;
  var exec = uncurryThis$2(constructorRegExp.exec);
  var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

  var isConstructorModern = function isConstructor(argument) {
    if (!isCallable$4(argument)) return false;
    try {
      construct(noop, empty, argument);
      return true;
    } catch (error) {
      return false;
    }
  };

  var isConstructorLegacy = function isConstructor(argument) {
    if (!isCallable$4(argument)) return false;
    switch (classof$2(argument)) {
      case 'AsyncFunction':
      case 'GeneratorFunction':
      case 'AsyncGeneratorFunction': return false;
    }
    try {
      // we can't check .prototype since constructors produced by .bind haven't it
      // `Function#toString` throws on some built-it function in some legacy engines
      // (for example, `DOMQuad` and similar in FF41-)
      return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource$1(argument));
    } catch (error) {
      return true;
    }
  };

  isConstructorLegacy.sham = true;

  // `IsConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-isconstructor
  var isConstructor$2 = !construct || fails$3(function () {
    var called;
    return isConstructorModern(isConstructorModern.call)
      || !isConstructorModern(Object)
      || !isConstructorModern(function () { called = true; })
      || called;
  }) ? isConstructorLegacy : isConstructorModern;

  var isConstructor$1 = isConstructor$2;
  var tryToString$1 = tryToString$5;

  var $TypeError$5 = TypeError;

  // `Assert: IsConstructor(argument) is true`
  var aConstructor$1 = function (argument) {
    if (isConstructor$1(argument)) return argument;
    throw $TypeError$5(tryToString$1(argument) + ' is not a constructor');
  };

  var anObject$1 = anObject$a;
  var aConstructor = aConstructor$1;
  var isNullOrUndefined = isNullOrUndefined$4;
  var wellKnownSymbol$5 = wellKnownSymbol$g;

  var SPECIES$3 = wellKnownSymbol$5('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-speciesconstructor
  var speciesConstructor$2 = function (O, defaultConstructor) {
    var C = anObject$1(O).constructor;
    var S;
    return C === undefined || isNullOrUndefined(S = anObject$1(C)[SPECIES$3]) ? defaultConstructor : aConstructor(S);
  };

  var $TypeError$4 = TypeError;

  var validateArgumentsLength$1 = function (passed, required) {
    if (passed < required) throw $TypeError$4('Not enough arguments');
    return passed;
  };

  var userAgent$2 = engineUserAgent;

  // eslint-disable-next-line redos/no-vulnerable -- safe
  var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent$2);

  var global$6 = global$h;
  var apply = functionApply;
  var bind$3 = functionBindContext;
  var isCallable$3 = isCallable$i;
  var hasOwn = hasOwnProperty_1;
  var fails$2 = fails$h;
  var html = html$2;
  var arraySlice = arraySlice$2;
  var createElement = documentCreateElement$1;
  var validateArgumentsLength = validateArgumentsLength$1;
  var IS_IOS$1 = engineIsIos;
  var IS_NODE$3 = engineIsNode;

  var set = global$6.setImmediate;
  var clear = global$6.clearImmediate;
  var process$3 = global$6.process;
  var Dispatch = global$6.Dispatch;
  var Function$1 = global$6.Function;
  var MessageChannel = global$6.MessageChannel;
  var String$1 = global$6.String;
  var counter = 0;
  var queue$2 = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var $location, defer, channel, port;

  fails$2(function () {
    // Deno throws a ReferenceError on `location` access without `--location` flag
    $location = global$6.location;
  });

  var run = function (id) {
    if (hasOwn(queue$2, id)) {
      var fn = queue$2[id];
      delete queue$2[id];
      fn();
    }
  };

  var runner = function (id) {
    return function () {
      run(id);
    };
  };

  var eventListener = function (event) {
    run(event.data);
  };

  var globalPostMessageDefer = function (id) {
    // old engines have not location.origin
    global$6.postMessage(String$1(id), $location.protocol + '//' + $location.host);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set || !clear) {
    set = function setImmediate(handler) {
      validateArgumentsLength(arguments.length, 1);
      var fn = isCallable$3(handler) ? handler : Function$1(handler);
      var args = arraySlice(arguments, 1);
      queue$2[++counter] = function () {
        apply(fn, undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue$2[id];
    };
    // Node.js 0.8-
    if (IS_NODE$3) {
      defer = function (id) {
        process$3.nextTick(runner(id));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(runner(id));
      };
    // Browsers with MessageChannel, includes WebWorkers
    // except iOS - https://github.com/zloirock/core-js/issues/624
    } else if (MessageChannel && !IS_IOS$1) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = eventListener;
      defer = bind$3(port.postMessage, port);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (
      global$6.addEventListener &&
      isCallable$3(global$6.postMessage) &&
      !global$6.importScripts &&
      $location && $location.protocol !== 'file:' &&
      !fails$2(globalPostMessageDefer)
    ) {
      defer = globalPostMessageDefer;
      global$6.addEventListener('message', eventListener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in createElement('script')) {
      defer = function (id) {
        html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(runner(id), 0);
      };
    }
  }

  var task$1 = {
    set: set,
    clear: clear
  };

  var Queue$2 = function () {
    this.head = null;
    this.tail = null;
  };

  Queue$2.prototype = {
    add: function (item) {
      var entry = { item: item, next: null };
      var tail = this.tail;
      if (tail) tail.next = entry;
      else this.head = entry;
      this.tail = entry;
    },
    get: function () {
      var entry = this.head;
      if (entry) {
        var next = this.head = entry.next;
        if (next === null) this.tail = null;
        return entry.item;
      }
    }
  };

  var queue$1 = Queue$2;

  var userAgent$1 = engineUserAgent;

  var engineIsIosPebble = /ipad|iphone|ipod/i.test(userAgent$1) && typeof Pebble != 'undefined';

  var userAgent = engineUserAgent;

  var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent);

  var global$5 = global$h;
  var bind$2 = functionBindContext;
  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
  var macrotask = task$1.set;
  var Queue$1 = queue$1;
  var IS_IOS = engineIsIos;
  var IS_IOS_PEBBLE = engineIsIosPebble;
  var IS_WEBOS_WEBKIT = engineIsWebosWebkit;
  var IS_NODE$2 = engineIsNode;

  var MutationObserver = global$5.MutationObserver || global$5.WebKitMutationObserver;
  var document$2 = global$5.document;
  var process$2 = global$5.process;
  var Promise$1 = global$5.Promise;
  // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
  var queueMicrotaskDescriptor = getOwnPropertyDescriptor$1(global$5, 'queueMicrotask');
  var microtask$1 = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
  var notify$1, toggle, node, promise$6, then;

  // modern engines have queueMicrotask method
  if (!microtask$1) {
    var queue = new Queue$1();

    var flush = function () {
      var parent, fn;
      if (IS_NODE$2 && (parent = process$2.domain)) parent.exit();
      while (fn = queue.get()) try {
        fn();
      } catch (error) {
        if (queue.head) notify$1();
        throw error;
      }
      if (parent) parent.enter();
    };

    // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
    // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
    if (!IS_IOS && !IS_NODE$2 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
      toggle = true;
      node = document$2.createTextNode('');
      new MutationObserver(flush).observe(node, { characterData: true });
      notify$1 = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (!IS_IOS_PEBBLE && Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise$6 = Promise$1.resolve(undefined);
      // workaround of WebKit ~ iOS Safari 10.1 bug
      promise$6.constructor = Promise$1;
      then = bind$2(promise$6.then, promise$6);
      notify$1 = function () {
        then(flush);
      };
    // Node.js without promises
    } else if (IS_NODE$2) {
      notify$1 = function () {
        process$2.nextTick(flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessage
    // - onreadystatechange
    // - setTimeout
    } else {
      // `webpack` dev server bug on IE global methods - use bind(fn, global)
      macrotask = bind$2(macrotask, global$5);
      notify$1 = function () {
        macrotask(flush);
      };
    }

    microtask$1 = function (fn) {
      if (!queue.head) notify$1();
      queue.add(fn);
    };
  }

  var microtask_1 = microtask$1;

  var hostReportErrors$1 = function (a, b) {
    try {
      // eslint-disable-next-line no-console -- safe
      arguments.length == 1 ? console.error(a) : console.error(a, b);
    } catch (error) { /* empty */ }
  };

  var perform$6 = function (exec) {
    try {
      return { error: false, value: exec() };
    } catch (error) {
      return { error: true, value: error };
    }
  };

  var global$4 = global$h;

  var promiseNativeConstructor = global$4.Promise;

  /* global Deno -- Deno case */
  var engineIsDeno = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';

  var IS_DENO$1 = engineIsDeno;
  var IS_NODE$1 = engineIsNode;

  var engineIsBrowser = !IS_DENO$1 && !IS_NODE$1
    && typeof window == 'object'
    && typeof document == 'object';

  var global$3 = global$h;
  var NativePromiseConstructor$5 = promiseNativeConstructor;
  var isCallable$2 = isCallable$i;
  var isForced = isForced_1;
  var inspectSource = inspectSource$2;
  var wellKnownSymbol$4 = wellKnownSymbol$g;
  var IS_BROWSER = engineIsBrowser;
  var IS_DENO = engineIsDeno;
  var V8_VERSION$1 = engineV8Version;

  var NativePromisePrototype$2 = NativePromiseConstructor$5 && NativePromiseConstructor$5.prototype;
  var SPECIES$2 = wellKnownSymbol$4('species');
  var SUBCLASSING = false;
  var NATIVE_PROMISE_REJECTION_EVENT$1 = isCallable$2(global$3.PromiseRejectionEvent);

  var FORCED_PROMISE_CONSTRUCTOR$5 = isForced('Promise', function () {
    var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor$5);
    var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor$5);
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION$1 === 66) return true;
    // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
    if (!(NativePromisePrototype$2['catch'] && NativePromisePrototype$2['finally'])) return true;
    // We can't use @@species feature detection in V8 since it causes
    // deoptimization and performance degradation
    // https://github.com/zloirock/core-js/issues/679
    if (!V8_VERSION$1 || V8_VERSION$1 < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
      // Detect correctness of subclassing with @@species support
      var promise = new NativePromiseConstructor$5(function (resolve) { resolve(1); });
      var FakePromise = function (exec) {
        exec(function () { /* empty */ }, function () { /* empty */ });
      };
      var constructor = promise.constructor = {};
      constructor[SPECIES$2] = FakePromise;
      SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
      if (!SUBCLASSING) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    } return !GLOBAL_CORE_JS_PROMISE && (IS_BROWSER || IS_DENO) && !NATIVE_PROMISE_REJECTION_EVENT$1;
  });

  var promiseConstructorDetection = {
    CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR$5,
    REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT$1,
    SUBCLASSING: SUBCLASSING
  };

  var newPromiseCapability$2 = {};

  var aCallable$5 = aCallable$b;

  var $TypeError$3 = TypeError;

  var PromiseCapability = function (C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw $TypeError$3('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aCallable$5(resolve);
    this.reject = aCallable$5(reject);
  };

  // `NewPromiseCapability` abstract operation
  // https://tc39.es/ecma262/#sec-newpromisecapability
  newPromiseCapability$2.f = function (C) {
    return new PromiseCapability(C);
  };

  var $$d = _export;
  var IS_NODE = engineIsNode;
  var global$2 = global$h;
  var call$5 = functionCall;
  var defineBuiltIn = defineBuiltIn$3;
  var setToStringTag = setToStringTag$3;
  var setSpecies = setSpecies$1;
  var aCallable$4 = aCallable$b;
  var isCallable$1 = isCallable$i;
  var isObject$2 = isObject$b;
  var anInstance = anInstance$1;
  var speciesConstructor$1 = speciesConstructor$2;
  var task = task$1.set;
  var microtask = microtask_1;
  var hostReportErrors = hostReportErrors$1;
  var perform$5 = perform$6;
  var Queue = queue$1;
  var InternalStateModule$1 = internalState;
  var NativePromiseConstructor$4 = promiseNativeConstructor;
  var PromiseConstructorDetection = promiseConstructorDetection;
  var newPromiseCapabilityModule$7 = newPromiseCapability$2;

  var PROMISE = 'Promise';
  var FORCED_PROMISE_CONSTRUCTOR$4 = PromiseConstructorDetection.CONSTRUCTOR;
  var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
  PromiseConstructorDetection.SUBCLASSING;
  var getInternalPromiseState = InternalStateModule$1.getterFor(PROMISE);
  var setInternalState$1 = InternalStateModule$1.set;
  var NativePromisePrototype$1 = NativePromiseConstructor$4 && NativePromiseConstructor$4.prototype;
  var PromiseConstructor = NativePromiseConstructor$4;
  var PromisePrototype = NativePromisePrototype$1;
  var TypeError$1 = global$2.TypeError;
  var document$1 = global$2.document;
  var process$1 = global$2.process;
  var newPromiseCapability$1 = newPromiseCapabilityModule$7.f;
  var newGenericPromiseCapability = newPromiseCapability$1;

  var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$2.dispatchEvent);
  var UNHANDLED_REJECTION = 'unhandledrejection';
  var REJECTION_HANDLED = 'rejectionhandled';
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;

  var Internal, OwnPromiseCapability, PromiseWrapper;

  // helpers
  var isThenable = function (it) {
    var then;
    return isObject$2(it) && isCallable$1(then = it.then) ? then : false;
  };

  var callReaction = function (reaction, state) {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var handler = ok ? reaction.ok : reaction.fail;
    var resolve = reaction.resolve;
    var reject = reaction.reject;
    var domain = reaction.domain;
    var result, then, exited;
    try {
      if (handler) {
        if (!ok) {
          if (state.rejection === UNHANDLED) onHandleUnhandled(state);
          state.rejection = HANDLED;
        }
        if (handler === true) result = value;
        else {
          if (domain) domain.enter();
          result = handler(value); // can throw
          if (domain) {
            domain.exit();
            exited = true;
          }
        }
        if (result === reaction.promise) {
          reject(TypeError$1('Promise-chain cycle'));
        } else if (then = isThenable(result)) {
          call$5(then, result, resolve, reject);
        } else resolve(result);
      } else reject(value);
    } catch (error) {
      if (domain && !exited) domain.exit();
      reject(error);
    }
  };

  var notify = function (state, isReject) {
    if (state.notified) return;
    state.notified = true;
    microtask(function () {
      var reactions = state.reactions;
      var reaction;
      while (reaction = reactions.get()) {
        callReaction(reaction, state);
      }
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(state);
    });
  };

  var dispatchEvent = function (name, promise, reason) {
    var event, handler;
    if (DISPATCH_EVENT) {
      event = document$1.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global$2.dispatchEvent(event);
    } else event = { promise: promise, reason: reason };
    if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global$2['on' + name])) handler(event);
    else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
  };

  var onUnhandled = function (state) {
    call$5(task, global$2, function () {
      var promise = state.facade;
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;
      if (IS_UNHANDLED) {
        result = perform$5(function () {
          if (IS_NODE) {
            process$1.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };

  var isUnhandled = function (state) {
    return state.rejection !== HANDLED && !state.parent;
  };

  var onHandleUnhandled = function (state) {
    call$5(task, global$2, function () {
      var promise = state.facade;
      if (IS_NODE) {
        process$1.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };

  var bind$1 = function (fn, state, unwrap) {
    return function (value) {
      fn(state, value, unwrap);
    };
  };

  var internalReject = function (state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify(state, true);
  };

  var internalResolve = function (state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (state.facade === value) throw TypeError$1("Promise can't be resolved itself");
      var then = isThenable(value);
      if (then) {
        microtask(function () {
          var wrapper = { done: false };
          try {
            call$5(then, value,
              bind$1(internalResolve, wrapper, state),
              bind$1(internalReject, wrapper, state)
            );
          } catch (error) {
            internalReject(wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify(state, false);
      }
    } catch (error) {
      internalReject({ done: false }, error, state);
    }
  };

  // constructor polyfill
  if (FORCED_PROMISE_CONSTRUCTOR$4) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromisePrototype);
      aCallable$4(executor);
      call$5(Internal, this);
      var state = getInternalPromiseState(this);
      try {
        executor(bind$1(internalResolve, state), bind$1(internalReject, state));
      } catch (error) {
        internalReject(state, error);
      }
    };

    PromisePrototype = PromiseConstructor.prototype;

    // eslint-disable-next-line no-unused-vars -- required for `.length`
    Internal = function Promise(executor) {
      setInternalState$1(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: new Queue(),
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };

    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability$1(speciesConstructor$1(this, PromiseConstructor));
      state.parent = true;
      reaction.ok = isCallable$1(onFulfilled) ? onFulfilled : true;
      reaction.fail = isCallable$1(onRejected) && onRejected;
      reaction.domain = IS_NODE ? process$1.domain : undefined;
      if (state.state == PENDING) state.reactions.add(reaction);
      else microtask(function () {
        callReaction(reaction, state);
      });
      return reaction.promise;
    });

    OwnPromiseCapability = function () {
      var promise = new Internal();
      var state = getInternalPromiseState(promise);
      this.promise = promise;
      this.resolve = bind$1(internalResolve, state);
      this.reject = bind$1(internalReject, state);
    };

    newPromiseCapabilityModule$7.f = newPromiseCapability$1 = function (C) {
      return C === PromiseConstructor || C === PromiseWrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };
  }

  $$d({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR$4 }, {
    Promise: PromiseConstructor
  });

  setToStringTag(PromiseConstructor, PROMISE, false, true);
  setSpecies(PROMISE);

  var wellKnownSymbol$3 = wellKnownSymbol$g;

  var ITERATOR = wellKnownSymbol$3('iterator');
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ };
      },
      'return': function () {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR] = function () {
      return this;
    };
    // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
    Array.from(iteratorWithReturn, function () { throw 2; });
  } catch (error) { /* empty */ }

  var checkCorrectnessOfIteration$1 = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR] = function () {
        return {
          next: function () {
            return { done: ITERATION_SUPPORT = true };
          }
        };
      };
      exec(object);
    } catch (error) { /* empty */ }
    return ITERATION_SUPPORT;
  };

  var NativePromiseConstructor$3 = promiseNativeConstructor;
  var checkCorrectnessOfIteration = checkCorrectnessOfIteration$1;
  var FORCED_PROMISE_CONSTRUCTOR$3 = promiseConstructorDetection.CONSTRUCTOR;

  var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$3 || !checkCorrectnessOfIteration(function (iterable) {
    NativePromiseConstructor$3.all(iterable).then(undefined, function () { /* empty */ });
  });

  var $$c = _export;
  var call$4 = functionCall;
  var aCallable$3 = aCallable$b;
  var newPromiseCapabilityModule$6 = newPromiseCapability$2;
  var perform$4 = perform$6;
  var iterate$3 = iterate$5;
  var PROMISE_STATICS_INCORRECT_ITERATION$3 = promiseStaticsIncorrectIteration;

  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  $$c({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION$3 }, {
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapabilityModule$6.f(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform$4(function () {
        var $promiseResolve = aCallable$3(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate$3(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          remaining++;
          call$4($promiseResolve, C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  var $$b = _export;
  var FORCED_PROMISE_CONSTRUCTOR$2 = promiseConstructorDetection.CONSTRUCTOR;
  var NativePromiseConstructor$2 = promiseNativeConstructor;

  NativePromiseConstructor$2 && NativePromiseConstructor$2.prototype;

  // `Promise.prototype.catch` method
  // https://tc39.es/ecma262/#sec-promise.prototype.catch
  $$b({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR$2, real: true }, {
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });

  var $$a = _export;
  var call$3 = functionCall;
  var aCallable$2 = aCallable$b;
  var newPromiseCapabilityModule$5 = newPromiseCapability$2;
  var perform$3 = perform$6;
  var iterate$2 = iterate$5;
  var PROMISE_STATICS_INCORRECT_ITERATION$2 = promiseStaticsIncorrectIteration;

  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  $$a({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION$2 }, {
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapabilityModule$5.f(C);
      var reject = capability.reject;
      var result = perform$3(function () {
        var $promiseResolve = aCallable$2(C.resolve);
        iterate$2(iterable, function (promise) {
          call$3($promiseResolve, C, promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  var $$9 = _export;
  var call$2 = functionCall;
  var newPromiseCapabilityModule$4 = newPromiseCapability$2;
  var FORCED_PROMISE_CONSTRUCTOR$1 = promiseConstructorDetection.CONSTRUCTOR;

  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  $$9({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR$1 }, {
    reject: function reject(r) {
      var capability = newPromiseCapabilityModule$4.f(this);
      call$2(capability.reject, undefined, r);
      return capability.promise;
    }
  });

  var anObject = anObject$a;
  var isObject$1 = isObject$b;
  var newPromiseCapability = newPromiseCapability$2;

  var promiseResolve$2 = function (C, x) {
    anObject(C);
    if (isObject$1(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var $$8 = _export;
  var getBuiltIn$2 = getBuiltIn$8;
  var IS_PURE = isPure;
  var NativePromiseConstructor$1 = promiseNativeConstructor;
  var FORCED_PROMISE_CONSTRUCTOR = promiseConstructorDetection.CONSTRUCTOR;
  var promiseResolve$1 = promiseResolve$2;

  var PromiseConstructorWrapper = getBuiltIn$2('Promise');
  var CHECK_WRAPPER = !FORCED_PROMISE_CONSTRUCTOR;

  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  $$8({ target: 'Promise', stat: true, forced: IS_PURE  }, {
    resolve: function resolve(x) {
      return promiseResolve$1(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor$1 : this, x);
    }
  });

  var $$7 = _export;
  var call$1 = functionCall;
  var aCallable$1 = aCallable$b;
  var newPromiseCapabilityModule$3 = newPromiseCapability$2;
  var perform$2 = perform$6;
  var iterate$1 = iterate$5;
  var PROMISE_STATICS_INCORRECT_ITERATION$1 = promiseStaticsIncorrectIteration;

  // `Promise.allSettled` method
  // https://tc39.es/ecma262/#sec-promise.allsettled
  $$7({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION$1 }, {
    allSettled: function allSettled(iterable) {
      var C = this;
      var capability = newPromiseCapabilityModule$3.f(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform$2(function () {
        var promiseResolve = aCallable$1(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate$1(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          remaining++;
          call$1(promiseResolve, C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = { status: 'fulfilled', value: value };
            --remaining || resolve(values);
          }, function (error) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = { status: 'rejected', reason: error };
            --remaining || resolve(values);
          });
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  var $$6 = _export;
  var call = functionCall;
  var aCallable = aCallable$b;
  var getBuiltIn$1 = getBuiltIn$8;
  var newPromiseCapabilityModule$2 = newPromiseCapability$2;
  var perform$1 = perform$6;
  var iterate = iterate$5;
  var PROMISE_STATICS_INCORRECT_ITERATION = promiseStaticsIncorrectIteration;

  var PROMISE_ANY_ERROR = 'No one promise resolved';

  // `Promise.any` method
  // https://tc39.es/ecma262/#sec-promise.any
  $$6({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
    any: function any(iterable) {
      var C = this;
      var AggregateError = getBuiltIn$1('AggregateError');
      var capability = newPromiseCapabilityModule$2.f(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform$1(function () {
        var promiseResolve = aCallable(C.resolve);
        var errors = [];
        var counter = 0;
        var remaining = 1;
        var alreadyResolved = false;
        iterate(iterable, function (promise) {
          var index = counter++;
          var alreadyRejected = false;
          remaining++;
          call(promiseResolve, C, promise).then(function (value) {
            if (alreadyRejected || alreadyResolved) return;
            alreadyResolved = true;
            resolve(value);
          }, function (error) {
            if (alreadyRejected || alreadyResolved) return;
            alreadyRejected = true;
            errors[index] = error;
            --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
          });
        });
        --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  var $$5 = _export;
  var NativePromiseConstructor = promiseNativeConstructor;
  var fails$1 = fails$h;
  var getBuiltIn = getBuiltIn$8;
  var isCallable = isCallable$i;
  var speciesConstructor = speciesConstructor$2;
  var promiseResolve = promiseResolve$2;

  var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

  // Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
  var NON_GENERIC = !!NativePromiseConstructor && fails$1(function () {
    // eslint-disable-next-line unicorn/no-thenable -- required for testing
    NativePromisePrototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
  });

  // `Promise.prototype.finally` method
  // https://tc39.es/ecma262/#sec-promise.prototype.finally
  $$5({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
    'finally': function (onFinally) {
      var C = speciesConstructor(this, getBuiltIn('Promise'));
      var isFunction = isCallable(onFinally);
      return this.then(
        isFunction ? function (x) {
          return promiseResolve(C, onFinally()).then(function () { return x; });
        } : onFinally,
        isFunction ? function (e) {
          return promiseResolve(C, onFinally()).then(function () { throw e; });
        } : onFinally
      );
    }
  });

  var uncurryThis$1 = functionUncurryThis;
  var toIntegerOrInfinity$1 = toIntegerOrInfinity$4;
  var toString$1 = toString$4;
  var requireObjectCoercible = requireObjectCoercible$3;

  var charAt$1 = uncurryThis$1(''.charAt);
  var charCodeAt = uncurryThis$1(''.charCodeAt);
  var stringSlice = uncurryThis$1(''.slice);

  var createMethod$1 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = toString$1(requireObjectCoercible($this));
      var position = toIntegerOrInfinity$1(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = charCodeAt(S, position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size
        || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING
            ? charAt$1(S, position)
            : first
          : CONVERT_TO_STRING
            ? stringSlice(S, position, position + 2)
            : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$1(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$1(true)
  };

  var charAt = stringMultibyte.charAt;
  var toString = toString$4;
  var InternalStateModule = internalState;
  var defineIterator = iteratorDefine;
  var createIterResultObject = createIterResultObject$2;

  var STRING_ITERATOR = 'String Iterator';
  var setInternalState = InternalStateModule.set;
  var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState(this, {
      type: STRING_ITERATOR,
      string: toString(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return createIterResultObject(undefined, true);
    point = charAt(string, index);
    state.index += point.length;
    return createIterResultObject(point, false);
  });

  var path = path$6;

  var promise$5 = path.Promise;

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };

  var DOMIterables = domIterables;
  var global$1 = global$h;
  var classof$1 = classof$7;
  var createNonEnumerableProperty = createNonEnumerableProperty$8;
  var Iterators = iterators;
  var wellKnownSymbol$2 = wellKnownSymbol$g;

  var TO_STRING_TAG = wellKnownSymbol$2('toStringTag');

  for (var COLLECTION_NAME in DOMIterables) {
    var Collection = global$1[COLLECTION_NAME];
    var CollectionPrototype = Collection && Collection.prototype;
    if (CollectionPrototype && classof$1(CollectionPrototype) !== TO_STRING_TAG) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    Iterators[COLLECTION_NAME] = Iterators.Array;
  }

  var parent$b = promise$5;


  var promise$4 = parent$b;

  var $$4 = _export;
  var newPromiseCapabilityModule$1 = newPromiseCapability$2;

  // `Promise.withResolvers` method
  // https://github.com/tc39/proposal-promise-with-resolvers
  $$4({ target: 'Promise', stat: true }, {
    withResolvers: function withResolvers() {
      var promiseCapability = newPromiseCapabilityModule$1.f(this);
      return {
        promise: promiseCapability.promise,
        resolve: promiseCapability.resolve,
        reject: promiseCapability.reject
      };
    }
  });

  var parent$a = promise$4;


  var promise$3 = parent$a;

  // TODO: Remove from `core-js@4`
  var $$3 = _export;
  var newPromiseCapabilityModule = newPromiseCapability$2;
  var perform = perform$6;

  // `Promise.try` method
  // https://github.com/tc39/proposal-promise-try
  $$3({ target: 'Promise', stat: true, forced: true }, {
    'try': function (callbackfn) {
      var promiseCapability = newPromiseCapabilityModule.f(this);
      var result = perform(callbackfn);
      (result.error ? promiseCapability.reject : promiseCapability.resolve)(result.value);
      return promiseCapability.promise;
    }
  });

  var parent$9 = promise$3;
  // TODO: Remove from `core-js@4`





  var promise$2 = parent$9;

  var promise$1 = promise$2;

  var promise = promise$1;

  var _Promise = /*@__PURE__*/getDefaultExportFromCjs(promise);

  var classof = classofRaw$2;

  // `IsArray` abstract operation
  // https://tc39.es/ecma262/#sec-isarray
  // eslint-disable-next-line es/no-array-isarray -- safe
  var isArray$2 = Array.isArray || function isArray(argument) {
    return classof(argument) == 'Array';
  };

  var isArray$1 = isArray$2;
  var isConstructor = isConstructor$2;
  var isObject = isObject$b;
  var wellKnownSymbol$1 = wellKnownSymbol$g;

  var SPECIES$1 = wellKnownSymbol$1('species');
  var $Array = Array;

  // a part of `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesConstructor$1 = function (originalArray) {
    var C;
    if (isArray$1(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (isConstructor(C) && (C === $Array || isArray$1(C.prototype))) C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES$1];
        if (C === null) C = undefined;
      }
    } return C === undefined ? $Array : C;
  };

  var arraySpeciesConstructor = arraySpeciesConstructor$1;

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate$2 = function (originalArray, length) {
    return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
  };

  var bind = functionBindContext;
  var uncurryThis = functionUncurryThis;
  var IndexedObject = indexedObject;
  var toObject$1 = toObject$6;
  var lengthOfArrayLike$1 = lengthOfArrayLike$4;
  var arraySpeciesCreate$1 = arraySpeciesCreate$2;

  var push = uncurryThis([].push);

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
  var createMethod = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var IS_FILTER_REJECT = TYPE == 7;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject$1($this);
      var self = IndexedObject(O);
      var boundFunction = bind(callbackfn, that);
      var length = lengthOfArrayLike$1(self);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate$1;
      var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
      var value, result;
      for (;length > index; index++) if (NO_HOLES || index in self) {
        value = self[index];
        result = boundFunction(value, index, O);
        if (TYPE) {
          if (IS_MAP) target[index] = result; // map
          else if (result) switch (TYPE) {
            case 3: return true;              // some
            case 5: return value;             // find
            case 6: return index;             // findIndex
            case 2: push(target, value);      // filter
          } else switch (TYPE) {
            case 4: return false;             // every
            case 7: push(target, value);      // filterReject
          }
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    forEach: createMethod(0),
    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    map: createMethod(1),
    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    filter: createMethod(2),
    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    some: createMethod(3),
    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    every: createMethod(4),
    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    find: createMethod(5),
    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod(6),
    // `Array.prototype.filterReject` method
    // https://github.com/tc39/proposal-array-filtering
    filterReject: createMethod(7)
  };

  var $$2 = _export;
  var $findIndex = arrayIteration.findIndex;

  var FIND_INDEX = 'findIndex';
  var SKIPS_HOLES = true;

  // Shouldn't skip holes
  // eslint-disable-next-line es/no-array-prototype-findindex -- testing
  if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findindex
  $$2({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
    findIndex: function findIndex(callbackfn /* , that = undefined */) {
      return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var entryVirtual$2 = entryVirtual$5;

  var findIndex$6 = entryVirtual$2('Array').findIndex;

  var isPrototypeOf$2 = objectIsPrototypeOf;
  var method$2 = findIndex$6;

  var ArrayPrototype$2 = Array.prototype;

  var findIndex$5 = function (it) {
    var own = it.findIndex;
    return it === ArrayPrototype$2 || (isPrototypeOf$2(ArrayPrototype$2, it) && own === ArrayPrototype$2.findIndex) ? method$2 : own;
  };

  var parent$8 = findIndex$5;

  var findIndex$4 = parent$8;

  var parent$7 = findIndex$4;

  var findIndex$3 = parent$7;

  var parent$6 = findIndex$3;

  var findIndex$2 = parent$6;

  var findIndex$1 = findIndex$2;

  var findIndex = findIndex$1;

  var _findIndexInstanceProperty = /*@__PURE__*/getDefaultExportFromCjs(findIndex);

  var DESCRIPTORS = descriptors;
  var isArray = isArray$2;

  var $TypeError$2 = TypeError;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Safari < 13 does not throw an error in this case
  var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
    // makes no sense without proper strict mode support
    if (this !== undefined) return true;
    try {
      // eslint-disable-next-line es/no-object-defineproperty -- safe
      Object.defineProperty([], 'length', { writable: false }).length = 1;
    } catch (error) {
      return error instanceof TypeError;
    }
  }();

  var arraySetLength = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
    if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
      throw $TypeError$2('Cannot set read only .length');
    } return O.length = length;
  } : function (O, length) {
    return O.length = length;
  };

  var $TypeError$1 = TypeError;
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

  var doesNotExceedSafeInteger$1 = function (it) {
    if (it > MAX_SAFE_INTEGER) throw $TypeError$1('Maximum allowed index exceeded');
    return it;
  };

  var toPropertyKey = toPropertyKey$3;
  var definePropertyModule = objectDefineProperty;
  var createPropertyDescriptor = createPropertyDescriptor$6;

  var createProperty$1 = function (object, key, value) {
    var propertyKey = toPropertyKey(key);
    if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  var tryToString = tryToString$5;

  var $TypeError = TypeError;

  var deletePropertyOrThrow$1 = function (O, P) {
    if (!delete O[P]) throw $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
  };

  var fails = fails$h;
  var wellKnownSymbol = wellKnownSymbol$g;
  var V8_VERSION = engineV8Version;

  var SPECIES = wellKnownSymbol('species');

  var arrayMethodHasSpeciesSupport$2 = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return V8_VERSION >= 51 || !fails(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var $$1 = _export;
  var toObject = toObject$6;
  var toAbsoluteIndex = toAbsoluteIndex$2;
  var toIntegerOrInfinity = toIntegerOrInfinity$4;
  var lengthOfArrayLike = lengthOfArrayLike$4;
  var setArrayLength = arraySetLength;
  var doesNotExceedSafeInteger = doesNotExceedSafeInteger$1;
  var arraySpeciesCreate = arraySpeciesCreate$2;
  var createProperty = createProperty$1;
  var deletePropertyOrThrow = deletePropertyOrThrow$1;
  var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$2;

  var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('splice');

  var max = Math.max;
  var min = Math.min;

  // `Array.prototype.splice` method
  // https://tc39.es/ecma262/#sec-array.prototype.splice
  // with adding support of @@species
  $$1({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
    splice: function splice(start, deleteCount /* , ...items */) {
      var O = toObject(this);
      var len = lengthOfArrayLike(O);
      var actualStart = toAbsoluteIndex(start, len);
      var argumentsLength = arguments.length;
      var insertCount, actualDeleteCount, A, k, from, to;
      if (argumentsLength === 0) {
        insertCount = actualDeleteCount = 0;
      } else if (argumentsLength === 1) {
        insertCount = 0;
        actualDeleteCount = len - actualStart;
      } else {
        insertCount = argumentsLength - 2;
        actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
      }
      doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
      A = arraySpeciesCreate(O, actualDeleteCount);
      for (k = 0; k < actualDeleteCount; k++) {
        from = actualStart + k;
        if (from in O) createProperty(A, k, O[from]);
      }
      A.length = actualDeleteCount;
      if (insertCount < actualDeleteCount) {
        for (k = actualStart; k < len - actualDeleteCount; k++) {
          from = k + actualDeleteCount;
          to = k + insertCount;
          if (from in O) O[to] = O[from];
          else deletePropertyOrThrow(O, to);
        }
        for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow(O, k - 1);
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from in O) O[to] = O[from];
          else deletePropertyOrThrow(O, to);
        }
      }
      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }
      setArrayLength(O, len - actualDeleteCount + insertCount);
      return A;
    }
  });

  var entryVirtual$1 = entryVirtual$5;

  var splice$6 = entryVirtual$1('Array').splice;

  var isPrototypeOf$1 = objectIsPrototypeOf;
  var method$1 = splice$6;

  var ArrayPrototype$1 = Array.prototype;

  var splice$5 = function (it) {
    var own = it.splice;
    return it === ArrayPrototype$1 || (isPrototypeOf$1(ArrayPrototype$1, it) && own === ArrayPrototype$1.splice) ? method$1 : own;
  };

  var parent$5 = splice$5;

  var splice$4 = parent$5;

  var parent$4 = splice$4;

  var splice$3 = parent$4;

  var parent$3 = splice$3;

  var splice$2 = parent$3;

  var splice$1 = splice$2;

  var splice = splice$1;

  var _spliceInstanceProperty = /*@__PURE__*/getDefaultExportFromCjs(splice);

  var $ = _export;
  var $filter = arrayIteration.filter;
  var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$2;

  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  $({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var entryVirtual = entryVirtual$5;

  var filter$6 = entryVirtual('Array').filter;

  var isPrototypeOf = objectIsPrototypeOf;
  var method = filter$6;

  var ArrayPrototype = Array.prototype;

  var filter$5 = function (it) {
    var own = it.filter;
    return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.filter) ? method : own;
  };

  var parent$2 = filter$5;

  var filter$4 = parent$2;

  var parent$1 = filter$4;

  var filter$3 = parent$1;

  var parent = filter$3;

  var filter$2 = parent;

  var filter$1 = filter$2;

  var filter = filter$1;

  var _filterInstanceProperty = /*@__PURE__*/getDefaultExportFromCjs(filter);

  var _excluded = ["precision", "before", "after", "cancel"];
  var TAProperty =
  // 过渡需要变化的值
  function TAProperty(value) {
    this.value = value;
  };
  var Transition = /*#__PURE__*/function () {
    // 该属性执行所有过渡的动画集合
    function Transition(_ref) {
      var element = _ref.element,
        propertyName = _ref.propertyName,
        propertyValue = _ref.propertyValue;
      // 过渡的元素
      // 当前将要过渡的动画应用在元素的哪个属性上
      // 当前将要过渡的动画属性的实时值
      this._animation = [];
      this.element = element;
      // 将驼峰转换为 - 连字符，style.setProperty只支持 - 连字符，不支持驼峰（不生效）
      this.propertyName = propertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.element.style.setProperty(this.propertyName, propertyValue.toString());
      this.propertyValue = propertyValue;
    }
    var _proto = Transition.prototype;
    _proto.bind = function bind(value) {
      // 这里直接做一次校准
      var element = this.element,
        propertyName = this.propertyName,
        propertyValue = this.propertyValue;
      var newValue = {};
      _Object$keys(value).forEach(function (key) {
        var val = value[key];
        if (typeof val === 'number') {
          newValue[key] = val;
        }
      });
      propertyValue.value = newValue;
      element.style.setProperty(propertyName, propertyValue.toString());
    };
    _proto.apply = function apply(deltaValue, options) {
      var _this = this;
      return new _Promise(function (resolve) {
        var _options$precision = options.precision,
          precision = _options$precision === void 0 ? {} : _options$precision,
          _options$before = options.before,
          before = _options$before === void 0 ? function () {} : _options$before,
          _options$after = options.after,
          after = _options$after === void 0 ? function () {} : _options$after,
          _options$cancel = options.cancel,
          cancel = _options$cancel === void 0 ? true : _options$cancel,
          restOptions = _objectWithoutPropertiesLoose(options, _excluded);
        var element = _this.element,
          propertyName = _this.propertyName,
          propertyValue = _this.propertyValue;
        var produced = {};
        // 做一次精度筛选
        _Object$keys(deltaValue).forEach(function (key) {
          var val = deltaValue[key];
          if (typeof val === 'number') {
            // 大于精度的先存起来，后面启用动画
            if (Math.abs(val) > (precision[key] || 0)) {
              produced[key] = val;
            } else {
              // 小于精度的直接累加到value
              if (typeof propertyValue.value[key] === 'number') {
                propertyValue.value[key] += val;
              }
            }
          }
        });
        var producedKeys = _Object$keys(produced);
        // 存在需要执行动画的增量(大于精度的)，进行动画处理
        if (producedKeys.length > 0) {
          // 存储每一帧动画后还有多少剩余没有执行
          var remainValue = _extends({}, produced);
          // 创建动画，并存储到this
          var animation = new Animation(restOptions);
          _this._animation.push({
            animation: animation,
            remainValue: remainValue,
            cancel: cancel
          });
          // 开启动画
          animation.start(function (progress) {
            var next = before(progress, propertyValue.value);
            if (next !== false) {
              var _progress = progress;
              if (typeof next === 'number') {
                _progress = next;
              }
              // 根据动画进度对value进行累加
              producedKeys.forEach(function (key) {
                // 总的需要消费数减去已经消费的部分，即为这一帧之后未消费的部分，_progress为已消费的进度
                var unconsumed = produced[key] * (1 - _progress);
                if (typeof propertyValue.value[key] === 'number') {
                  // 上一帧未消费的部分减去这一帧之后未消费的部分，即为本次需要消费的部分
                  propertyValue.value[key] += remainValue[key] - unconsumed;
                }
                // 更新最新剩余未消费的
                remainValue[key] = unconsumed;
              });
              // 每帧动画后应用到元素并执行帧回调
              element.style.setProperty(propertyName, propertyValue.toString());
            }
            after(progress, propertyValue.value);
            if (progress === 1) {
              var _context;
              // 动画结束后删除集合中的这个动画对象
              var index = _findIndexInstanceProperty(_context = _this._animation).call(_context, function (a) {
                return animation === a.animation;
              });
              // 一般情况不出出现-1，这里强判断（防止动画出现了两次progress为1的情况）
              if (index !== -1) {
                var _context2;
                _spliceInstanceProperty(_context2 = _this._animation).call(_context2, index, 1);
              }
              resolve(propertyValue.value);
            }
          });
        } else {
          // 不存在需要执行动画的增量(小于精度的)，就直接将精度筛选时累加的值应用到元素并执行帧回调
          element.style.setProperty(propertyName, propertyValue.toString());
          resolve(propertyValue.value);
        }
      });
    };
    _proto.cancel = function cancel(end) {
      var _context3;
      if (end === void 0) {
        end = false;
      }
      // end是告诉动画取消时是停留在当前还是执行到终点
      var remainValues = [];
      this._animation = _filterInstanceProperty(_context3 = this._animation).call(_context3, function (_ref2) {
        var animation = _ref2.animation,
          remainValue = _ref2.remainValue,
          cancel = _ref2.cancel;
        if (cancel) {
          animation[end ? 'end' : 'stop']();
          // 存储剩余没有执行的部分返回给调用者
          remainValues.push(remainValue);
          return false;
        }
        return true;
      });
      return remainValues;
    };
    _proto.transitioning = function transitioning() {
      return this._animation.length !== 0;
    };
    return Transition;
  }();

  /*
   * @Author: Huangjs
   * @Date: 2023-02-13 15:22:58
   * @LastEditors: Huangjs
   * @LastEditTime: 2023-07-19 14:47:27
   * @Description: ******
   */

  // 对于函数 s = f(t)
  // 函数平移(x,y)（函数自变量t变为t-x，整体结果s+y）
  // 函数缩放 k 倍（函数自变量t变为t/k，整体结果s*k）
  // 先平移再缩放：s = (f((t/k)-x)+y)*k
  // 先缩放再平移：s = (f((t-x)/k)*k)+y

  var baseEase = {
    linear: function linear(t) {
      return t;
    },
    inQuad: function inQuad(t) {
      return t * t;
    },
    outQuad: function outQuad(t) {
      return 1 - (1 - t) * (1 - t);
    },
    inCubic: function inCubic(t) {
      return t * t * t;
    },
    outCubic: function outCubic(t) {
      return 1 - (1 - t) * (1 - t) * (1 - t);
    },
    inQuart: function inQuart(t) {
      return t * t * t * t;
    },
    outQuart: function outQuart(t) {
      return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t);
    },
    inQuint: function inQuint(t) {
      return t * t * t * t * t;
    },
    outQuint: function outQuint(t) {
      return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t) * (1 - t);
    }
  };
  // 取值easeFn函数变量的某一段转成easing函数，a为开始变量值，b为结束变量值
  function createEase(a, b, easeFn) {
    if (a === void 0) {
      a = 0;
    }
    if (b === void 0) {
      b = 1;
    }
    if (easeFn === void 0) {
      easeFn = baseEase.linear;
    }
    var k = 1 / (b - a);
    if (!k || k <= 0) {
      return function () {
        return 0;
      };
    }
    // easeFn先平移( -a , -easeFn(a) )，再缩放 k 倍
    // 接着使函数值也在(0,1)之间，即：经上述变换之后的函数，另变量为1，求函数值，函数再除以该函数值得到最终的函数
    return function (t) {
      return (easeFn(t / k + a) - easeFn(a)) * k / ((easeFn(1 / k + a) - easeFn(a)) * k);
    };
  }
  // 把两个easing函数连接转成新的easing函数，k为比例
  function createEaseInOut(k, easeIn, easeOut) {
    if (k === void 0) {
      k = 1 / 2;
    }
    if (easeIn === void 0) {
      easeIn = baseEase.linear;
    }
    if (easeOut === void 0) {
      easeOut = baseEase.linear;
    }
    if (k <= 0) {
      return easeOut;
    }
    if (k >= 1) {
      return easeIn;
    }
    return function (t) {
      return t <= k ?
      // easeIn直接缩放k
      easeIn(t / k) * k :
      // easeOut衔接easeIn，需要先平移( k/(1-k) , k/(1-k) )，再缩放 1-k
      (easeOut(t / (1 - k) - k / (1 - k)) + k / (1 - k)) * (1 - k);
    };
  }
  var easeInOutQuad = createEaseInOut(1 / 2, baseEase.outQuad, baseEase.inQuad);
  var easeOutInQuad = createEaseInOut(1 / 2, baseEase.inQuad, baseEase.outQuad);
  var easeOutQuad = baseEase.outQuad;
  var easeOutQuart = baseEase.outQuart;

  /*
   * @Author: Huangjs
   * @Date: 2023-07-26 16:28:46
   * @LastEditors: Huangjs
   * @LastEditTime: 2023-07-27 10:49:30
   * @Description: ******
   */

  exports.Animation = Animation;
  exports.TAProperty = TAProperty;
  exports.createEase = createEase;
  exports.createEaseInOut = createEaseInOut;
  exports.default = Transition;
  exports.easeInOutQuad = easeInOutQuad;
  exports.easeOutInQuad = easeOutInQuad;
  exports.easeOutQuad = easeOutQuad;
  exports.easeOutQuart = easeOutQuart;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=transition.js.map
