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
'use strict';

/* jshint ignore:start */
(function () {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = window.brunch || {};
  var ar = br['auto-reload'] = br['auto-reload'] || {};
  if (!WebSocket || ar.disabled) return;

  var cacheBuster = function cacheBuster(url) {
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function page() {
      window.location.reload(true);
    },

    stylesheet: function stylesheet() {
      [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (link) {
        var val = link.getAttribute('data-autoreload');
        return link.href && val != 'false';
      }).forEach(function (link) {
        link.href = cacheBuster(link.href);
      });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function () {
        document.body.offsetHeight;
      }, 25);
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function connect() {
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function (event) {
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function () {
      if (connection.readyState) connection.close();
    };
    connection.onclose = function () {
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */
;require.register("aco", function(exports, require, module) {
'use strict';

module.exports = (function () {

  var height = 500;
  var width = 500;

  var self = {};

  var world = require('world');
  var canvas = require('canvas');
  canvas.init(width, height, world);

  $(document).ready(function () {
    $('#reset').click(canvas.restart);
    $('#add_node').click(function () {
      world.add_random_node(width, height);
    });
    $('#add_edge').click(world.add_random_edge);
    $('#random_map').click(canvas.random_map);

    $('#cycle').click(world.cycle);
    $('#go_ant').click(world.add_ant);
  });

  return self;
})();
});

;require.register("ant", function(exports, require, module) {
'use strict';

function Ant() {
  var start_node = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

  this.world = require('world');
  this.canvas = require('canvas');
  this.visited_edge = [];
  this.unvisited_edge = this.world.get_edges().slice();
  this.path = [];
  this.path_l = 0;
  this.current_node = start_node;

  if (!this.current_node) this.current_node = this.world.get_random_node();
}

Ant.prototype.reset = function () {
  this.visited_edge = [];
  this.unvisited_edge = this.world.get_edges().slice();
  this.path = [];
  this.path_l = 0;
  this.current_node = this.world.get_random_node();
};

Ant.prototype.visit = function (edge) {
  // add this edge to path
  this.path.push(edge);

  // increase the path length
  this.path_l += edge.weight;

  // update current node
  this.current_node = this.current_node.equals(edge.nodeFrom) ? edge.nodeTo : edge.nodeFrom;

  //add this edge to visited one
  // this.visited_edge.push(edge)

  // search the index of this edge in unvisited edges
  var edge_index = this.unvisited_edge.findIndex(function (e) {
    return edge.equals(e);
  });

  //remove this edge from unvisited edges!
  if (edge_index > -1) this.unvisited_edge.splice(edge_index, 1);

  edge.add_pherormone();
};

Ant.prototype.move = function () {
  var next_edge = this.decision_maker();

  this.visit(next_edge);
  this.canvas.draw_edge(next_edge, '#f66');

  // check if path is complete and all edges are visited
  if (this.has_finish()) {
    return [this.path_l, this.path];
  } else this.move();
};

Ant.prototype.has_finish = function () {
  return this.unvisited_edge.length === 0;
};

Ant.prototype.is_unvisited = function (edge) {
  return edge.in(this.unvisited_edge);
};

Ant.prototype.is_visited = function (edge) {
  return edge.in(this.visited_edge);
};

Ant.prototype.n_visited = function (edge) {
  var v = this.path.reduce(function (tot, e) {
    return e.equals(edge) ? ++tot : tot;
  }, 0);
  return v;
};

var choose = require('choose');
Ant.prototype.decision_maker = function () {
  var _this = this;

  // this.canvas.reset()
  var possible_edges = this.world.get_connected_edges(this.current_node);
  var edges_probabilities = [];

  // this.canvas.draw_edges(possible_edges,'#6f6')

  // ogni via ha una probabilita' di essere presa
  // che dipende da diversi fattori
  // 1- e' gia' stata percorsa da me ?
  // 2- quandi ferormoni ci sono ?
  // 3- quanto e' lunga la strada ?
  // 4- se sono state tutte percorse, quale e' quella percorsa meno volte?
  // 5- quale strada mi avvicina di piu' alla strada piu' vicina non visitata

  edges_probabilities = possible_edges.map(function (e) {
    return _this.get_probability(e);
  });
  return choose(possible_edges, edges_probabilities);
};

var Edge = require('edge');

Ant.prototype.get_probability = function (edge) {
  var probability = 10;

  // piu' e' stata percorsa meno voglio ripercorrerla
  // if(this.n_visited(edge))
  probability /= this.n_visited(edge) * 30;

  return probability;
};

module.exports = Ant;
});

;require.register("canvas", function(exports, require, module) {
'use strict';

module.exports = (function () {

  var self = {};
  var canvas = undefined,
      height = undefined,
      width = undefined,
      edge_mode = undefined,
      canvas_element = undefined,
      tmp_edge = undefined,
      world = undefined,
      Edge = require('edge'),
      Node = require('node');

  self.init = function (w, h, wo) {
    $('body').css('maxWidth', width);
    $('body').append('<canvas id="canvas"  width="' + w + '" height="' + h + '"></canvas>');
    world = wo;
    world.canvas = self;
    height = h;
    width = w;
    canvas_element = $('#canvas')[0];
    canvas = canvas_element.getContext('2d');
    edge_mode = false;
    tmp_edge = null;
    $(canvas_element).click(on_click);

    clear();
  };

  self.random_map = function () {
    var n_elements = 200;
    var n_edge = n_elements * 4;

    for (var i = 0; i < n_elements; i++) {
      world.add_random_node(height, width);
    }for (var i = 0; i < n_edge; i++) {
      world.add_random_edge();
    }self.reset();
  };

  function init_edge_mode(node) {
    tmp_edge = new Edge(node, new Node(0, 0));
    edge_mode = true;
    $(canvas_element).on('mousemove', on_move);
  }

  function end_edge_mode(node) {
    tmp_edge.setTo(node);
    world.add_edge(tmp_edge);
    tmp_edge = new Edge(node, new Node(0, 0));
    self.reset();
  }

  function interrupt_edge_mode() {
    $(canvas_element).off('mousemove', on_move);
    edge_mode = false;
    self.reset();
  }

  function on_click(e) {
    var x = e.clientX;
    var y = e.clientY;

    var node = world.get_node_near(x, y, 15);

    if (node) {
      // found a node near click
      if (!edge_mode) init_edge_mode(node);else end_edge_mode(node);
    } else {
      if (edge_mode) interrupt_edge_mode();else {
        node = new Node(x, y);
        world.add_node(node);
        self.draw_node(node);
      }
    }
  }

  self.restart = function () {
    world.restart();
    clear();
  };

  self.reset = function () {
    clear();
    draw_nodes();
    self.draw_edges();
  };

  function on_move(e) {
    self.reset();

    var node = world.get_node_near(e.clientX, e.clientY, 20);
    if (node) {
      tmp_edge.nodeTo.x = node.x;
      tmp_edge.nodeTo.y = node.y;
    } else {
      tmp_edge.nodeTo.x = e.clientX;
      tmp_edge.nodeTo.y = e.clientY;
    }

    self.draw_edge(tmp_edge, '#f60', 0.6, 3.5);
  }

  function draw_nodes() {
    world.get_nodes().map(function (node) {
      return self.draw_node(node);
    });
  }

  self.draw_edges = function () {
    var edges = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var color = arguments.length <= 1 || arguments[1] === undefined ? '#000' : arguments[1];
    var alpha = arguments.length <= 2 || arguments[2] === undefined ? 0.4 : arguments[2];
    var lineWidth = arguments.length <= 3 || arguments[3] === undefined ? 2 : arguments[3];

    if (!edges) world.get_edges().map(function (edge) {
      return self.draw_edge(edge, color, alpha, lineWidth);
    });else edges.map(function (edge) {
      return self.draw_edge(edge, color, alpha, lineWidth);
    });
  };

  function clear() {
    canvas.clearRect(0, 0, width, height);
  }

  self.draw_node = function (node) {
    var size = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];
    var color = arguments.length <= 2 || arguments[2] === undefined ? '#00f' : arguments[2];
    var alpha = arguments.length <= 3 || arguments[3] === undefined ? 0.9 : arguments[3];

    canvas.shadowColor = '#666';
    canvas.shadowBlur = 5;
    canvas.shadowOffsetX = 0;
    canvas.shadowOffsetY = 0;

    canvas.globalAlpha = alpha;
    canvas.fillStyle = color;
    canvas.beginPath();
    canvas.arc(node.x, node.y, size, 0, 2 * Math.PI);
    canvas.fill();
  };

  self.draw_edge = function (edge) {
    var color = arguments.length <= 1 || arguments[1] === undefined ? '#000' : arguments[1];
    var alpha = arguments.length <= 2 || arguments[2] === undefined ? 0.4 : arguments[2];
    var lineWidth = arguments.length <= 3 || arguments[3] === undefined ? 2 : arguments[3];

    canvas.shadowBlur = 0;
    canvas.globalAlpha = alpha;
    canvas.strokeStyle = color;
    canvas.lineWidth = lineWidth;
    canvas.beginPath();
    canvas.moveTo(edge.nodeFrom.x, edge.nodeFrom.y);
    canvas.lineTo(edge.nodeTo.x, edge.nodeTo.y);
    canvas.stroke();
  };

  return self;
})();

// "use strict"

// var Canvas = (function () {
//     function Canvas(canvasHolder, width, height) {
//         var canvasId = 'aoc-graph';

//         this._canvasSize = {
//             'width':width,
//             'height': height,
//         };

//         $(canvasHolder).css('maxWidth', this._canvasSize.width);
//         $(canvasHolder).append('<canvas id="' + canvasId + '" width="' + this._canvasSize.width + '" height="' + this._canvasSize.height + '" style="width:100%;"></canvas>');

//         this._canvasEle = $('#' + canvasId)[0];
//         this._canvas = this._canvasEle.getContext('2d');
//         this._canvasPos = this._canvasEle.getBoundingClientRect();
//         this._mousePos = {
//             'x': 0,
//             'y': 0,
//         };

//         $(this._canvasEle).click(this._click.bind(this));
//         $(this._canvasEle).mousemove(this._move.bind(this));

//         this._clickHook = null;
//         this._mouseMoveHook = null;
//     }

//     Canvas.prototype.getMouseX = function() { return this._mousePos.x };
//     Canvas.prototype.getMouseY = function() { return this._mousePos.y };
//     Canvas.prototype.getWidth = function() { return this._canvasSize.width };
//     Canvas.prototype.getHeight = function() { return this._canvasSize.height };
//     Canvas.prototype.getContext = function() { return this._canvas; };

//     Canvas.prototype._click = function(mouseEvt) {
//         this._updateMouseXY(mouseEvt);

//         if (typeof(this._clickHook) === 'function') {
//             this._clickHook();
//         }
//     };

//     Canvas.prototype._move = function(mouseEvt) {
//         this._updateMouseXY(mouseEvt);

//         if (typeof(this._mouseMoveHook) === 'function') {
//             this._mouseMoveHook();
//         }
//     };

//     Canvas.prototype.click = function(clickHook) {
//         this._clickHook = clickHook;
//     };

//     Canvas.prototype.mousemove = function(mouseMoveHook) {
//         this._mouseMoveHook = mouseMoveHook;
//     };

//     Canvas.prototype.clear = function() {
//         this._canvas.clearRect(0, 0, this._canvasSize.width, this._canvasSize.height);
//     };

//     Canvas.prototype.drawLine = function(fromX, fromY, toX, toY, params) {
//         var color = '#000';
//         var alpha = 1;
//         var lineWidth = 1;

//         if (params != undefined) {
//             if (params.color != undefined) {
//                 color = params.color;
//             }
//             if (params.alpha != undefined) {
//                 alpha = params.alpha;
//             }
//             if (params.width != undefined) {
//                 lineWidth = params.width;
//             }  
//         }  

//         this._canvas.shadowBlur = 0;
//         this._canvas.globalAlpha = alpha;
//         this._canvas.strokeStyle = color;
//         this._canvas.lineWidth = lineWidth;
//         this._canvas.beginPath();
//         this._canvas.moveTo(fromX, fromY);
//         this._canvas.lineTo(toX, toY);
//         this._canvas.stroke();
//     }

//     Canvas.prototype.drawCircle = function(x, y, params) {
//         var size = 6;
//         var color = '#000';
//         var alpha = 1;

//         if (params != undefined) {
//             if (params.size != undefined) {
//                 size = params.size;
//             }
//             if (params.color != undefined) {
//                 color = params.color;
//             }
//             if (params.alpha != undefined) {
//                 alpha = params.alpha;
//             }
//         }

//         this._canvas.shadowColor = '#666';
//         this._canvas.shadowBlur = 15;
//         this._canvas.shadowOffsetX = 0;
//         this._canvas.shadowOffsetY = 0;

//         this._canvas.globalAlpha = alpha;
//         this._canvas.fillStyle = color;
//         this._canvas.beginPath();
//         this._canvas.arc(x, y, size, 0, 2 * Math.PI);
//         this._canvas.fill();
//     };

//     Canvas.prototype.drawRectangle = function(pointA, pointB, pointC, pointD, params) {
//         var fill = '#000';
//         var alpha = 1;

//         if (params != undefined) {
//             if (params.fill != undefined) {
//                 fill = params.fill;
//             }
//             if (params.alpha != undefined) {
//                 alpha = params.alpha;
//             }
//         }

//         this._canvas.shadowBlur = 0;

//         this._canvas.globalAlpha = alpha;
//         this._canvas.fillStyle = fill;
//         this._canvas.fillRect(pointA, pointB, pointC, pointD);
//     }

//     Canvas.prototype._updateMouseXY = function(mouseEvt) {
//         this._canvasPos = this._canvasEle.getBoundingClientRect();
//         var mouseX = mouseEvt.clientX - this._canvasPos.left;
//         var mouseY = mouseEvt.clientY - this._canvasPos.top;
//         var widthScaled = $(this._canvasEle).width() / this._canvasSize.width;
//         var heightScaled = $(this._canvasEle).height() / this._canvasSize.height;
//         var x = Math.floor(mouseX / widthScaled);
//         var y = Math.floor(mouseY / heightScaled);

//         this._mousePos.x = x;
//         this._mousePos.y = y;
//     };

//     return Canvas;
// })();
});

require.register("choose", function(exports, require, module) {
"use strict";

module.exports = function (possibilities, probabilities) {

  var roulette_wheel = probabilities.reduce(function (tot, v) {
    return tot += v;
  }, 0);
  var wheel_target = roulette_wheel * Math.random();
  var tot = 0;

  for (var idx in probabilities) {
    tot += probabilities[idx];
    if (tot >= wheel_target) return possibilities[idx];
  }
};

/**
 * 
 * var choose = require('choose')
 *
 * var possibilities = ['Green','Blue','White']
 * var probabilities = [ 2.5, 3.5, 4 ]
 * var ret = { 'Green','Blue','White' }
 * 
 * for(var i=0;i<100000;i++){ ret[c(possibilities,probabilities)]++ }
 * Object {Green: 24888, Blue: 35087, White: 40025}
 * 
 */
});

;require.register("edge", function(exports, require, module) {
"use strict";

function Edge(nodeFrom, nodeTo) {

  // if(nodeFrom.equals(nodeTo)) return null

  this.nodeFrom = nodeFrom;
  this.nodeTo = nodeTo;

  nodeFrom.add_connection(this);
  nodeTo.add_connection(this);

  this.weight = this.length();

  console.log(this.weight);
  this.pherormon = 1;
}

Edge.prototype.length = function () {
  if (this.nodeFrom && this.nodeTo) return Math.sqrt(Math.pow(this.nodeFrom.x - this.nodeTo.x, 2) + Math.pow(this.nodeFrom.y - this.nodeTo.y, 2));else return 0;
};

Edge.prototype.add_pherormone = function () {
  this.pherormon++;
};

Edge.prototype.in = function (edges) {
  var _this = this;

  return edges.findIndex(function (e) {
    return e.equals(_this);
  }) !== -1;
};

Edge.prototype.setFrom = function (nodeFrom) {
  this.nodeFrom = nodeFrom;
  this.weight = this.length();
};

Edge.prototype.setTo = function (nodeTo) {
  this.nodeTo = nodeTo;
  this.weight = this.length();
};

Edge.prototype.equals = function (edge) {
  return edge.nodeFrom.equals(this.nodeFrom) && edge.nodeTo.equals(this.nodeTo) || edge.nodeTo.equals(this.nodeFrom) && edge.nodeFrom.equals(this.nodeTo);
};

Edge.prototype.connected = function (edge) {
  return edge.nodeFrom.equals(this.nodeFrom) || edge.nodeFrom.equals(this.nodeTo) || edge.nodeTo.equals(this.nodeFrom) || edge.nodeTo.equals(this.nodeTo);
};

module.exports = Edge;
});

;require.register("node", function(exports, require, module) {
"use strict";

function Node(x, y) {

  this.x = x;
  this.y = y;

  this.connections = [];
  this.connection_weight = [];
}

Node.prototype.add_connection = function (edge) {
  this.connections.push(edge);
  this.connection_weight.push(0);
};

Node.prototype.equals = function (node) {
  return node.x === this.x && node.y === this.y;
};

Node.prototype.distance = function (x, y) {
  return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
};

module.exports = Node;
});

;require.register("tour", function(exports, require, module) {
"use strict";
});

;require.register("world", function(exports, require, module) {
'use strict';

module.exports = (function () {

  var self = {};

  var edges = [];
  var nodes = [];
  var ants = [];
  var Edge = require('edge');
  var Node = require('node');

  var edges_length = 0;

  self.restart = function () {
    edges = [];
    nodes = [];
    edges_length = 0;
  };

  self.add_node = function (node) {
    nodes.push(node);
    self.canvas.draw_node(node);
    $('#n_nodes').html(nodes.length);
    return node;
  };

  self.get_random_node = function () {
    return nodes[Math.floor(Math.random() * nodes.length)];
  };

  self.get_random_edge = function () {
    return edges[Math.floor(Math.random() * edges.length)];
  };

  function rand(max) {
    return Math.floor(Math.random() * max);
  }

  self.add_random_node = function (max_x, max_y) {
    var node = new Node(rand(max_x), rand(max_y));
    if (nodes.findIndex(function (n) {
      return n.equals(node);
    }) !== -1) {
      self.add_random_node();
      return;
    }
    self.add_node(node);
  };

  self.add_random_edge = function () {
    var nodeFrom = rand(nodes.length);
    var nodeTo = rand(nodes.length);

    // ensure node index is different
    while (nodeTo === nodeFrom) {
      nodeTo = rand(nodes.length);
    }var edge = new Edge(nodes[nodeFrom], nodes[nodeTo]);
    self.add_edge(edge);
  };

  var Ant = require('ant');
  self.add_ant = function () {
    var a = new Ant();
    ants.push(a);
    console.log(a.move());
  };

  self.cycle = function () {
    var n_ants = 100;
    var a = new Ant();
    var best_path = [];
    var best_path_l = Infinity;

    for (var i = 0; i < n_ants; i++) {
      a.reset();
      a.move();
      if (a.path_l < best_path_l) {
        console.log('trovato best: ' + a.path_l);
        best_path = a.path.slice();
        best_path_l = a.path_l;
      }
    }

    // sul path migliore, metto dei pesi
    // for(edge of best_path){
    // edge.nodeFrom.
    // }
  };

  self.get_connected_edges = function (el) {
    var res = [];
    if (el instanceof Edge) res = edges.filter(function (e) {
      return e.connected(el);
    });else if (el instanceof Node) res = edges.filter(function (e) {
      return e.nodeFrom.equals(el) || e.nodeTo.equals(el);
    });
    return res;
  };

  self.add_edge = function (edge) {
    if (!edge.in(edges) && !edge.nodeFrom.equals(edge.nodeTo)) {
      edges.push(edge);
      self.canvas.draw_edge(edge);
      $('#n_edges').html(edges.length);
      edges_length += edge.weight;
      $('#edges_length').html(edges_length);
    } else console.log('edge doppio o nodeFrom=nodeTo');
    return edge;
  };

  self.get_nodes = function () {
    return nodes;
  };
  self.get_edges = function () {
    return edges;
  };

  self.get_node_at = function (x, y) {
    var res = nodes.filter(function (node) {
      return node.x === x && node.y === y;
    });
    if (res.length === 1) return res[0];else return false;
  };

  self.get_node_near = function (x, y, distance) {
    var res = nodes.filter(function (node) {
      return node.distance(x, y) <= distance;
    });
    if (res.length >= 1) return res[0];
    return false;
  };

  return self;
})();
});

;
//# sourceMappingURL=app.js.map