(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.HB = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  /**
   * @description     
   */
  var Observer =
  /*#__PURE__*/
  function () {
    function Observer(next, error, completed) {
      classCallCheck(this, Observer);

      this.isStopped = !1;
      this.isPendding = !1;

      if (_typeof_1(next) === "object") {
        this.onNext = next.next;
        this.onError = next.error;
        this.onCompleted = next.complete;
      } else {
        this.onNext = next;
        this.onError = error;
        this.onCompleted = completed;
      }
    }

    createClass(Observer, [{
      key: "next",
      value: function next(value) {
        this.isPendding = !0;

        if (!this.isStopped && this.onNext) {
          this.onNext(value);
        }
      }
    }, {
      key: "error",
      value: function error(err) {
        this.isPendding = !0;

        if (!this.isStopped && this.onError) {
          // this.isStopped = !0;
          this.onError(err);
        }
      }
    }, {
      key: "complete",
      value: function complete(res) {
        if (!this.isStopped && this.onCompleted) {
          this.isStopped = !0;
          this.onCompleted(res);
        }

        this.isPendding = !1;
      }
    }]);

    return Observer;
  }();

  var Subscription =
  /*#__PURE__*/
  function () {
    function Subscription(observer, result) {
      classCallCheck(this, Subscription);

      this.observer = observer;
      this.result = result;
    } // 取消observer的订阅


    createClass(Subscription, [{
      key: "unsubscribe",
      value: function unsubscribe() {
        this.observer.isStopped = !0;
        this.result();
      }
    }]);

    return Subscription;
  }();

  var Observable =
  /*#__PURE__*/
  function () {
    function Observable(subscribeAction) {
      classCallCheck(this, Observable);

      this.subscribeAction = subscribeAction;
    }

    createClass(Observable, [{
      key: "subscribe",
      value: function subscribe(oOrOnNext, error, completed) {
        var observer = new Observer(oOrOnNext, error, completed);
        var result = this.subscribeAction(observer); // 开始发射数据并拿到subscribeAction的返回值

        return new Subscription(observer, result); // 创造控制observer和subscribeAction的实例对象
      }
    }]);

    return Observable;
  }();

  /* eslint-disable*/
  var connect = function connect(url) {

    if (!url) {
      return;
    }

    try {
      document.location = url; // window[callbackName]({
      //     data: {},
      //     msg: 'success',
      //     code: '0'
      // });
    } catch (e) {
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.documentElement.appendChild(iframe);
      setTimeout(function () {
        document.documentElement.removeChild(iframe);
      }, 20);
    }
  };

  var FuncProto = Function.prototype;
   // 判断环境

  var inBrowser = typeof window !== 'undefined';
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  console.log(UA);
  var device = {
    isAndroid: UA && /(Android)/i.test(UA),
    isIOS: UA && /iphone|ipad|ipod|ios/.test(UA),
    isWeixin: UA && /micromessenger/i.test(UA)
    /**
     * @description 通过ua获取app相关信息
     */

  };
  var hybirdInfo = function getHybirdInfo() {
    var matche = UA && UA.split('hybird')[1];
    var info = {};
    var headers = {}; //切割拿到jwtToken

    if (matche) {
      var urls = matche.split('-');
      var urlStr = urls.length && urls[5] || '';
      var tokenSplit = urlStr.split('jwt_TokenIdentify');
      var jwt = tokenSplit.length ? tokenSplit[1] : '';
      var headerStr = tokenSplit.length ? tokenSplit[0] : ''; // if(tokenSplit){
      //获取原生的headers

      (jwt) && (headers = Object.assign({}, JSON.parse(headerStr)), headers.jwtToken = jwt); // }

      info = {
        isAPP: urls[1] === 'MKAPP',
        // 是否在app内
        version: urls[2],
        // app版本号
        appType: urls[3],
        // app类型
        isParents: urls[4] === 'Parents',
        // 是否app家长端
        isStudent: urls[4] === 'Student',
        // 是否app学生端
        isTeacher: urls[4] === 'Teacher' // 是否app老师端

      };
    }

    return Object.assign({}, info, {
      headers: headers
    });
  }(); // 空函数

  var noop = function noop() {};
  /**
   * 是否为非NULL对象
   * @param  {Object}  obj 预期传入对象
   * @return {Boolean}     返回判断值
   */

  var isObject = function isObject(obj) {
    return obj !== null && _typeof_1(obj) === 'object';
  };
  /**
   * 是否为字符串
   * @param  {String}  str 预期传入字符串
   * @return {Boolean}     返回判断值
   */

  var isString = function isString(str) {
    return typeof str === 'string';
  };
  /**
   * @description     序列化对象
   * @param {Object} param 
   * @return  {String}    
   */

  var serialize = function serialize(param) {
    var query = '';

    if (isObject(param)) {
      query = Object.keys(param).reduce(function (prev, key) {
        return prev = "".concat(prev, "&").concat(key, "=").concat(param[key]), prev;
      }, '');
    }

    return query;
  };
  var getCode = function getCode() {
    return "mk_".concat(+new Date()).concat(Math.random().toString(16).substr(2, 8));
  };

  /**
   * @description 
   * @param {*} e 
   */
  var formatJson = function formatJson(e) {
    try {
      return JSON.stringify(e, null, "  ");
    } catch (t) {
      return JSON.stringify(e);
    }
  };
  /**
   * @description
   */


  var logger = {
    info: function info() {
      var showLog = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !1;

      var _arg = formatJson(arguments.length <= 1 ? undefined : arguments[1]);

      if (showLog && "object" == (typeof console === "undefined" ? "undefined" : _typeof_1(console)) && console.log) {
        console.log(_arg);
      }
    },
    warn: function warn() {
      var _arg = formatJson(arguments.length <= 0 ? undefined : arguments[0]);

      if ("object" == (typeof console === "undefined" ? "undefined" : _typeof_1(console)) && console.warn) {
        console.warn(_arg);
      }
    }
  };

  var hybirdInfo$1 = hybirdInfo;
  /**
   * @description 
   * @param {String} callbackName 
   */

  var registerObserver = function registerObserver(ctx) {
    return function (observer) {
      var callbackName = ctx.quene.shift();
      console.log(callbackName);

      window[callbackName] = function (res) {
        console.log('old callback');
        var data = res;

        if (isString(data)) {
          data = JSON.parse(data);
        }

        if (data && !parseInt(data.code)) {
          observer.next(data);
        } else {
          observer.error(data);
        }

        observer.complete(data);
      }; // return utils.noop;


      return function () {
        console.log('unsubscribe');
        window[callbackName] && !observer.isPendding && (window[callbackName] = function () {
          console.log('new callback');
          window[callbackName] = null;
          delete window[callbackName];
        });
      }; // return res => {console.log('callback')
      //     let data = res;
      //     if ( utils.isString(data) ){
      //         data = JSON.parse(data);
      //     }
      //     if ( data && !parseInt(data.code) ) {
      //         observer.next(data);
      //     } else {
      //         observer.error(data);
      //     }
      //     observer.complete(data);
      // } 
    };
  };

  var HB =
  /*#__PURE__*/
  function () {
    createClass(HB, null, [{
      key: "create",

      /**
       * @description  是否在app内
       */

      /**
       * @description  获取app版本号
       */

      /**
       * @description  获取app类型
       */

      /**
       * @description  是否app家长端
       */

      /**
       * @description  是否app学生端
       */

      /**
       * @description  是否app老师端
       */

      /**
       * @description     创建
       * @param {String}    eventName 
       * @param {Boolean}     async 
       */
      value: function create() {
        var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var hb = null;
        var hybirdFn = ''; // 桥接方法名

        var callbackName = ''; // 前端提供的回调方法名

        var baseUrl = ''; // 基本链接，无自定义参数

        if (UA) {
          if (isString(eventName)) {
            callbackName = "".concat(eventName, "Callback");
            baseUrl = "hybrid://".concat(eventName);
            hb = new HB({
              baseUrl: baseUrl,
              hybirdFn: hybirdFn,
              callbackName: callbackName
            });
            hb.observable = new Observable(registerObserver(hb));
          } else {
            logger.warn('初始化失败，方法名应该是字符串格式');
          }
        } else {
          logger.warn('初始化失败，非浏览器环境');
        }

        return hb;
      }
    }]);

    function HB(options) {
      classCallCheck(this, HB);

      this.baseUrl = options.baseUrl;
      this.hybirdFn = options.hybirdFn; // 

      this.callbackName = options.callbackName; // 

      this.observable = options.observable || {};
      this.quene = [];
    }

    createClass(HB, [{
      key: "connect",
      value: function connect$1(param) {
        var query = serialize(param);
        var url = "".concat(this.baseUrl).concat(query ? '?' + query : '');
        console.log(url);

        connect(url, param.callback);
      }
    }, {
      key: "subscribe",
      value: function subscribe(_ref) {
        var _ref$param = _ref.param,
            param = _ref$param === void 0 ? {} : _ref$param,
            _ref$success = _ref.success,
            success = _ref$success === void 0 ? noop : _ref$success,
            _ref$fail = _ref.fail,
            fail = _ref$fail === void 0 ? noop : _ref$fail,
            _ref$complete = _ref.complete,
            _complete = _ref$complete === void 0 ? noop : _ref$complete;

        var callbackName = '';
        var subscription = noop;
        this.observable && ( // 生成唯一名称
        callbackName = "".concat(this.callbackName, "_").concat(getCode()), // 推入事件队列
        this.quene.push(callbackName), subscription = this.observable.subscribe({
          next: success,
          error: fail,
          complete: function complete(res) {
            _complete(res);

            console.log('complete');
            window[callbackName] = null;
            delete window[callbackName];
          }
        }), // window[callbackName] = subscription.result,
        // console.log('回调方法', callbackName),
        // this.observable.subscribe({ next: success, error: fail, complete }),
        this.connect(Object.assign({
          callback: callbackName
        }, param)));
        return subscription;
      }
    }]);

    return HB;
  }();

  HB.isAPP = hybirdInfo$1.isAPP;
  HB.version = hybirdInfo$1.version;
  HB.appType = hybirdInfo$1.appType;
  HB.isParents = hybirdInfo$1.isParents;
  HB.isStudent = hybirdInfo$1.isStudent;
  HB.isTeacher = hybirdInfo$1.isTeacher;

  return HB;

}));
