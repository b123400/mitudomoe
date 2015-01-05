(function() {
  var key, utility, value,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  utility = {
    isString: function(obj) {
      return obj instanceof String || typeof obj === "string";
    },
    isNumber: function(obj) {
      return obj instanceof Number || typeof obj === "number";
    },
    unique: function(array) {
      return array.filter(function(v, i, self) {
        return i === self.indexOf(v);
      });
    },
    uniqueObjectKeys: function() {
      var keys, obj, objs, _i, _len;
      objs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      keys = [];
      for (_i = 0, _len = objs.length; _i < _len; _i++) {
        obj = objs[_i];
        keys.push.apply(keys, Object.keys(obj));
      }
      return this.unique(keys);
    },
    diffObject: function(oldObject, newObject, _arg) {
      var allKeys, flat, key, newValue, oldValue, ordered, result, _i, _len, _ref;
      if (oldObject == null) {
        oldObject = {};
      }
      if (newObject == null) {
        newObject = {};
      }
      _ref = _arg != null ? _arg : {}, flat = _ref.flat, ordered = _ref.ordered;
      allKeys = this.uniqueObjectKeys(oldObject, newObject);
      result = {};
      for (_i = 0, _len = allKeys.length; _i < _len; _i++) {
        key = allKeys[_i];
        oldValue = oldObject[key];
        newValue = newObject[key];
        if (oldValue && !newValue) {
          result[key] = 'removed';
        } else if (newValue && !oldValue) {
          result[key] = 'added';
        } else if ((oldValue instanceof Function) || (newValue instanceof Function)) {
          throw 'Function not allowed in diff!';
        } else if ((oldValue instanceof Object) && (newValue instanceof Object)) {
          if (!ordered && (oldValue instanceof Array) && (newValue instanceof Array)) {
            result[key] = this.diffArray(oldValue, newValue);
          } else if (flat) {
            result[key] = oldValue === newValue;
          } else {
            result[key] = this.diffObject(oldValue, newValue);
          }
        } else if (oldValue !== newValue) {
          result[key] = 'modified';
        }
      }
      return result;
    },
    diffArray: function(oldArray, newArray, _arg) {
      var flat, ordered, result, _ref;
      if (oldArray == null) {
        oldArray = [];
      }
      if (newArray == null) {
        newArray = [];
      }
      _ref = _arg != null ? _arg : {}, flat = _ref.flat, ordered = _ref.ordered;
      result = {};
      if (!ordered) {
        return {
          added: newArray.filter(function(v) {
            return __indexOf.call(oldArray, v) < 0;
          }),
          removed: oldArray.filter(function(v) {
            return __indexOf.call(newArray, v) < 0;
          })
        };
      } else {
        return this.diffObject(oldArray, newArray, {
          flat: flat,
          ordered: ordered
        });
      }
    },
    mergeState: function(base, delta) {
      var key, keys, result, _i, _len;
      if (base == null) {
        base = {};
      }
      if (delta == null) {
        delta = {};
      }
      result = {};
      keys = this.uniqueObjectKeys(base, delta);
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        if (!(key in base)) {
          result[key] = delta[key];
        } else if (!(key in delta)) {
          result[key] = base[key];
        } else {
          if (delta[key] === null) {
            continue;
          }
          if (this.isString(delta[key] || this.isNumber(delta[key] || delta[key] instanceof Array))) {
            result[key] = delta[key];
          } else if ((base[key] instanceof Object) && (delta[key] instanceof Object)) {
            result[key] = this.mergeState(base[key], delta[key]);
          } else {
            result[key] = delta[key] || base[key];
          }
        }
      }
      return result;
    },
    mixin: function() {
      var dest, key, src, srcs, value, _i, _len, _results;
      dest = arguments[0], srcs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _results = [];
      for (_i = 0, _len = srcs.length; _i < _len; _i++) {
        src = srcs[_i];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (value = _j = 0, _len1 = src.length; _j < _len1; value = ++_j) {
            key = src[value];
            if (dest[key]) {
              throw "" + key + " already exists, cannot mix";
            }
            _results1.push(dest[key] = src[key]);
          }
          return _results1;
        })());
      }
      return _results;
    }
  };

  for (key in utility) {
    value = utility[key];
    exports[key] = utility[key].bind(utility);
  }

}).call(this);
