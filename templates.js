(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("view/world", function(exports, require, module) {
module.exports = function template(locals) {
var jade_debug = [ new jade.DebugItem( 1, "app/view/world.jade" ) ];
try {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
jade_debug.unshift(new jade.DebugItem( 0, "app/view/world.jade" ));
jade_debug.unshift(new jade.DebugItem( 1, "app/view/world.jade" ));
buf.push("\n<div id=\"container\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 2, "app/view/world.jade" ));
buf.push("\n  <canvas width=\"900px\" height=\"600px\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.shift();
buf.push("</canvas>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 3, "app/view/world.jade" ));
buf.push("\n  <div id=\"panel\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 4, "app/view/world.jade" ));
buf.push("\n    <div class=\"left\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 5, "app/view/world.jade" ));
buf.push("\n      <button @click=\"restart\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 5, jade_debug[0].filename ));
buf.push("Clear All");
jade_debug.shift();
jade_debug.shift();
buf.push("</button>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 6, "app/view/world.jade" ));
buf.push("\n      <button @click=\"random_map\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 6, jade_debug[0].filename ));
buf.push("Generate random map");
jade_debug.shift();
jade_debug.shift();
buf.push("</button>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 7, "app/view/world.jade" ));
buf.push("\n      <button @click=\"add_node\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 7, jade_debug[0].filename ));
buf.push("Add random Node");
jade_debug.shift();
jade_debug.shift();
buf.push("</button>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 8, "app/view/world.jade" ));
buf.push("\n      <button @click=\"add_edge\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 8, jade_debug[0].filename ));
buf.push("Add random Edge");
jade_debug.shift();
jade_debug.shift();
buf.push("</button>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 9, "app/view/world.jade" ));
buf.push("\n      <button @click=\"load_map\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 9, jade_debug[0].filename ));
buf.push("Load map");
jade_debug.shift();
jade_debug.shift();
buf.push("</button>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 10, "app/view/world.jade" ));
buf.push("\n      <button @click=\"save_map\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 10, jade_debug[0].filename ));
buf.push("Save map");
jade_debug.shift();
jade_debug.shift();
buf.push("</button>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 11, "app/view/world.jade" ));
buf.push("\n      <button @click=\"create_ant\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 11, jade_debug[0].filename ));
buf.push("Create ant");
jade_debug.shift();
jade_debug.shift();
buf.push("</button>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 12, "app/view/world.jade" ));
buf.push("\n      <button @click=\"move_ant\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 12, jade_debug[0].filename ));
buf.push("Move ant");
jade_debug.shift();
jade_debug.shift();
buf.push("</button>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 13, "app/view/world.jade" ));
buf.push("\n      <button @click=\"search_odd_node\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 13, jade_debug[0].filename ));
buf.push("Odd vertex");
jade_debug.shift();
jade_debug.shift();
buf.push("</button>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 14, "app/view/world.jade" ));
buf.push("\n      <button @click=\"remove_leafs\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 14, jade_debug[0].filename ));
buf.push("Remove leafs");
jade_debug.shift();
jade_debug.shift();
buf.push("</button>");
jade_debug.shift();
jade_debug.shift();
buf.push("\n    </div>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 16, "app/view/world.jade" ));
buf.push("\n    <div class=\"left\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 17, "app/view/world.jade" ));
buf.push("\n      <ul>");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 19, "app/view/world.jade" ));
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 20, "app/view/world.jade" ));
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 21, "app/view/world.jade" ));
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 22, "app/view/world.jade" ));
jade_debug.shift();
jade_debug.shift();
buf.push("\n      </ul>");
jade_debug.shift();
jade_debug.shift();
buf.push("\n    </div>");
jade_debug.shift();
jade_debug.shift();
buf.push("\n  </div>");
jade_debug.shift();
jade_debug.shift();
buf.push("\n</div>");
jade_debug.shift();
jade_debug.shift();;return buf.join("");
} catch (err) {
  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, "#container\n  canvas(width=\"900px\",height=\"600px\")\n  #panel\n    .left\n      button(@click='restart') Clear All\n      button(@click='random_map') Generate random map\n      button(@click='add_node') Add random Node\n      button(@click='add_edge') Add random Edge\n      button(@click='load_map') Load map\n      button(@click='save_map') Save map\n      button(@click='create_ant') Create ant\n      button(@click='move_ant') Move ant\n      button(@click='search_odd_node') Odd vertex\n      button(@click='remove_leafs') Remove leafs\n\n    .left\n      ul\n        //- li n.nodes {{ n_nodes }}\n        //- li n.edges {{ n_edges }}\n        //- li length {{ edges_length }}\n        //- li ant {{ ant.path_l }}\n");
}
};
});


//# sourceMappingURL=templates.js.map