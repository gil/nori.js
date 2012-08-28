/*
* nori.js v0.0.1 - 2012-08-27 - https://github.com/gil/nori.js
* by André Gil (http://andregil.net/)
*
* Licensed under:
*    MIT - http://www.opensource.org/licenses/MIT
*/

(function(window, document, undefined){
var AOP, method, methods, _i, _len;

AOP = (function() {

  function AOP() {}

  AOP.before = function(target, method, handler) {
    var originalMethod;
    originalMethod = target[method];
    return target[method] = function() {
      var adviceArgs;
      adviceArgs = AOP._prepareArgs({
        method: method
      }, arguments);
      handler.apply(this, adviceArgs);
      return originalMethod.apply(this, arguments);
    };
  };

  AOP.after = function(target, method, handler) {
    var originalMethod;
    originalMethod = target[method];
    return target[method] = function() {
      var adviceArgs;
      adviceArgs = AOP._prepareArgs({
        method: method
      }, arguments);
      originalMethod.apply(this, arguments);
      return handler.apply(this, adviceArgs);
    };
  };

  AOP.afterThrow = function(target, method, handler) {
    var originalMethod;
    originalMethod = target[method];
    return target[method] = function() {
      var adviceArgs;
      try {
        return originalMethod.apply(this, arguments);
      } catch (exception) {
        adviceArgs = AOP._prepareArgs({
          method: method,
          exception: exception
        }, arguments);
        return handler.apply(this, adviceArgs);
      }
    };
  };

  AOP.afterFinally = function(target, method, handler) {
    var originalMethod;
    originalMethod = target[method];
    return target[method] = function() {
      var adviceArgs;
      try {
        return originalMethod.apply(this, arguments);
      } finally {
        adviceArgs = AOP._prepareArgs({
          method: method,
          failed: arguments[0]
        }, arguments);
        handler.apply(this, adviceArgs);
      }
    };
  };

  AOP.around = function(target, method, handler) {
    var originalMethod;
    originalMethod = target[method];
    return target[method] = function() {
      var adviceArgs, originalArgs,
        _this = this;
      originalArgs = arguments;
      adviceArgs = AOP._prepareArgs({
        method: method,
        "arguments": originalArgs,
        invoke: function() {
          return originalMethod.apply(_this, originalArgs);
        }
      }, arguments);
      return handler.apply(this, adviceArgs);
    };
  };

  AOP.introduction = function(target, method, handler) {
    return target[method] = function() {
      var adviceArgs;
      adviceArgs = AOP._prepareArgs({
        method: method
      }, arguments);
      return handler.apply(this, adviceArgs);
    };
  };

  AOP._prepareArgs = function(adviceData, args) {
    var arg, newArgs, _i, _len;
    newArgs = [adviceData];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      arg = args[_i];
      newArgs.push(arg);
    }
    return newArgs;
  };

  return AOP;

})();

methods = ["before", "after", "afterThrow", "afterFinally", "around", "introduction"];

for (_i = 0, _len = methods.length; _i < _len; _i++) {
  method = methods[_i];
  AOP.around(AOP, method, function(adviceData, target, method, handler) {
    var methodName, _results;
    if (method instanceof RegExp) {
      _results = [];
      for (methodName in target) {
        if (methodName.match(method)) {
          adviceData["arguments"][1] = methodName;
          _results.push(adviceData.invoke());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else {
      return adviceData.invoke();
    }
  });
}

var Nori;

Nori = (function() {
  var oldNori;

  function Nori() {
    this.beans = [];
    this.instances = {};
  }

  Nori.prototype.addBeans = function(beans) {
    var bean, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = beans.length; _i < _len; _i++) {
      bean = beans[_i];
      _results.push(this.addBean(bean));
    }
    return _results;
  };

  Nori.prototype.addBean = function(bean) {
    var oldBean, oldBeanIndex;
    oldBean = this._beanByName(bean.name);
    if (oldBean) {
      oldBeanIndex = this.beans.indexOf(oldBean);
      this.beans.splice(oldBeanIndex, 1);
    }
    return this.beans.push(bean);
  };

  Nori.prototype.instance = function(beanName) {
    var bean;
    bean = this._beanByName(beanName);
    if (bean && bean.type) {
      if (bean.singleton === false) {
        return this._newInstance(bean);
      } else {
        if (!this.instances[beanName]) {
          this.instances[beanName] = this._newInstance(bean);
        }
        return this.instances[beanName];
      }
    }
    return null;
  };

  Nori.prototype._newInstance = function(bean) {
    var advice, beanName, constructorParams, instance, param, property, propertyName, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
    constructorParams = [];
    if (bean.constructor) {
      _ref = bean.constructor;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        constructorParams.push(this.instance(param));
      }
    }
    instance = this._proxifyClass(bean.type, constructorParams);
    if (bean.properties instanceof Array) {
      _ref1 = bean.properties;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        property = _ref1[_j];
        instance[property] = this.instance(property);
      }
    } else if (bean.properties instanceof Object) {
      _ref2 = bean.properties;
      for (propertyName in _ref2) {
        beanName = _ref2[propertyName];
        instance[propertyName] = this.instance(beanName);
      }
    }
    if (bean.advices) {
      _ref3 = bean.advices;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        advice = _ref3[_k];
        AOP[advice.type](instance, advice.method, this.instance(advice.handler)[advice.handlerMethod]);
      }
    }
    return instance;
  };

  Nori.prototype.BeanProxy = function() {};

  Nori.prototype._proxifyClass = function(clazz, params) {
    var instance;
    this.BeanProxy.prototype = clazz.prototype;
    instance = new this.BeanProxy;
    clazz.apply(instance, params);
    return instance;
  };

  Nori.prototype._beanByName = function(beanName) {
    var bean, foundBean, _i, _len, _ref;
    foundBean = null;
    _ref = this.beans;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bean = _ref[_i];
      if (bean.name === beanName) {
        foundBean = bean;
      }
    }
    return foundBean;
  };

  Nori.AOP = AOP;

  oldNori = window.Nori;

  window.Nori = Nori;

  Nori.noConflict = function() {
    window.Nori = oldNori;
    return Nori;
  };

  return Nori;

})();

})(this, document);