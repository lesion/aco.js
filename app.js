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
require.register("aco", function(exports, require, module) {
'use strict';

Vue.config.debug = true;

new Vue({
  el: '#app',
  template: require('view/world')(),
  replace: true,
  data: {
    // world: null,
    // canvas: null,
    // ant: {}
  },
  created: function created() {
    console.log('sdf');
    var world = require('world');
    var canvas = require('canvas');
    this.world = world;
    this.canvas = canvas;
  },
  ready: function ready() {
    this.canvas.init(900, 600, this.world);
  },
  computed: {
    n_nodes: function n_nodes() {
      return this.world.nodes.length;
    },
    n_edges: function n_edges() {
      return this.world.edges.length;
    },
    edges_length: function edges_length() {
      return this.world.edges_length;
    }

  },
  methods: {
    restart: function restart() {
      // console.log(this.world)
      this.world.restart();
    },
    random_map: function random_map() {
      this.canvas.random_map();
    },
    add_node: function add_node() {
      console.log('add node');
      this.world.add_random_node(900, 600);
    },
    add_edge: function add_edge() {
      this.world.add_random_edge();
    },
    load_map: function load_map() {
      this.world.load();
    },
    save_map: function save_map() {
      var link = document.createElement('a');
      document.body.appendChild(link);
      var data = JSON.stringify(this.world.save());
      var jsonData = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
      link.href = jsonData;
      link.target = '_blank';
      link.download = 'map.json';
      link.click();
      document.body.removeChild(link);
    },
    search_odd_node: function search_odd_node() {
      this.world.search_odd_node();
    },
    create_ant: function create_ant() {
      var Ant = require('ant');
      this.ant = new Ant();
    },
    move_ant: function move_ant() {
      console.log('vado di move');
      this.ant.move();
      console.log('vado di move fine');
    },
    remove_leafs: function remove_leafs() {
      this.world.remove_leafs();
    }

  }
  // const height = 500
  // const width = 900

  // let self = {}

  // let world = require('world')
  // let canvas = require('canvas')
  // canvas.init(width, height, world)

  // $(document).ready(function() {
  //   $('#restart').click(canvas.restart)
  //   $('#reset').click(canvas.reset)
  //   $('#add_node').click(function() {
  //     world.add_random_node(width, height)
  //   })
  //   $('#add_edge').click(world.add_random_edge)
  //   $('#random_map').click(canvas.random_map)

  //   $('#cycle').click(world.cycle)
  //   $('#go_ant').click(world.add_ant)
  //   $('#search_odd_nodes').click(world.search_odd_node)
  //   $('#load_map').click(world.load)
  //   $('#save_world').click(function() {
  //     var data = JSON.stringify(world.save())
  //     var jsonData = 'data:application/json;charset=utf-8,' + encodeURIComponent(data)
  //     this.href = jsonData
  //     this.target = '_bla'
  //     this.download = 'map.json'
  //   })

  // })

  // return self
});

// webapp.$mount('#world')
});

;require.register("ant", function(exports, require, module) {
'use strict';

function Ant() {
  var start_node = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

  this.world = require('world');
  this.canvas = require('canvas');
  this.visited_edge = {};
  this.unvisited_edge = _.cloneDeep(this.world.edges);
  this.path = [];
  this.path_l = 0;
  this.current_node = start_node;

  this.last_edge_id = -1;

  if (!this.current_node) this.current_node = this.world.get_random_leaf_node();
}

Ant.prototype.reset = function () {
  this.visited_edge = {};
  this.unvisited_edge = _.cloneDeep(this.world.edges);
  this.path = [];
  this.path_l = 0;
  this.last_edge_id = -1;
  this.current_node = this.world.get_random_leaf_node();
};

Ant.prototype.visit = function (edge_id) {

  var edge = this.current_node.connections[edge_id];

  // add this edge to path
  this.path.push(edge_id);

  // increase the path length
  this.path_l += edge.weight;

  // this.current_node.add_pherormone(edge)
  // console.log(this.current_node.connection_weight)

  // update current node
  this.current_node = this.current_node.other_size(edge); //(this.current_node.equals(edge.nodeFrom) ? edge.nodeTo : edge.nodeFrom)

  //add this edge to visited one
  // this.visited_edge.push(edge)

  // search the index of this edge in unvisited edges
  // let edge_index = this.unvisited_edge.findIndex(e => edge.equals(e))
  this.last_edge_id = edge_id;
  //remove this edge from unvisited edges!
  // if (edge_index > -1)
  delete this.unvisited_edge[edge_id];
  // this.unvisited_edge.splice(edge_index, 1)

  this.canvas.draw_edge(edge, '#f66', 0.4, 3);

  // edge.add_pherormone()
};

// faccio una mossa
Ant.prototype.move = function () {
  if (this.has_finish()) {
    console.log('FINITO!');
    return [this.path_l, this.path];
  }
  if (this.forced_move()) return false;
  var next_edge_id = this.decision_maker();
  this.visit(next_edge_id);
  this.forced_move();

  return false;
};

// fa una mossa forzata (ad esempio se sono davanti ad un vicolo cieco o se posso solo andare avanti)
Ant.prototype.forced_move = function () {
  var edges = _.map(this.current_node.connections, function (edge) {
    return edge.id;
  });
  var next_edge_id = null;
  if (edges.length == 1) next_edge_id = edges[0];else if (edges.length === 2 && this.last_edge_id != null) {
    if (edges[0] === last_edge_id) next_edge_id = edges[1];else next_edge_id = edges[0];
  }

  if (!next_edge_id) return false;

  this.visit(next_edge_id);
  this.forced_move();
  return true;
};

Ant.prototype.run = function () {
  var that = this;
  var ret = this.move();
  var loop = setInterval(function () {
    ret = that.move();
    if (ret != false) {
      console.log('finito!!');
      clearTimeout(loop);
    }
  }, 50);
};

Ant.prototype.has_finish = function () {
  console.log(this.unvisited_edge.length, "unvisited");
  return _.size(this.unvisited_edge.length) === 0;
};

Ant.prototype.is_unvisited = function (edge) {
  return this.unvisited_edge[edge.id];
};

var choose = require('choose');

/**
 * It selects a move by applying a probabilistic decision rule. The
probabilistic decision rule is a function of (1) the locally available
pheromone trails and heuristic values (i.e., pheromone trails and
heuristic values associated with components and connections in the
neighborhood of the ant’s current location on graph GC); (2) the
ant’s private memory storing its current state; and (3) the problem
constraints.
 * [decision_maker description]
 * @return {[type]} [description]
 */
Ant.prototype.decision_maker = function () {
  var _this = this;

  // this.canvas.reset()
  var possible_edges = this.current_node.connections;

  // se ho solo due scelte possibili, non torno indietro
  // if(possible_edges.length==2)

  var edges_height = this.current_node.connection_weight;
  var edges_probabilities = [];

  // this.canvas.draw_edges(possible_edges,'#6f6')

  // ogni via ha una probabilita' di essere presa
  // che dipende da diversi fattori
  // 1- e' gia' stata percorsa da me ?
  // 2- quandi ferormoni ci sono ?
  // 3- quanto e' lunga la strada ?
  // 4- se sono state tutte percorse, quale e' quella percorsa meno volte?
  // 5- quale strada mi avvicina di piu' alla strada piu' vicina non visitata

  edges_probabilities = possible_edges.map(function (e, idx) {
    return _this.get_probability(e, edges_height[idx]);
  });
  return choose(possible_edges, edges_probabilities);
};

var Edge = require('edge');

Ant.prototype.get_probability = function (edge, enjoy) {
  return 10 * edge.weight / (this.n_visited(edge) * 1000);

  return (1000 + enjoy * 1000) / this.n_visited(edge) * 100 / edge.weight;
  var probability = 10000;

  // piu' e' stata percorsa meno voglio ripercorrerla
  // if(this.n_visited(edge))
  probability *= enjoy;
  probability /= this.n_visited(edge) * 200;
  probability /= edge.weight;

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
      tmp_nodeFrom = undefined,
      tmp_nodeTo = undefined,
      world = undefined,
      Edge = require('edge'),
      Node = require('node');

  self.init = function (w, h, wo) {
    // $('body').css('maxWidth', width)
    // $('body').append(`<canvas id="canvas"  width="${w}" height="${h}" style="width: ${w*2}; height: ${h*2}"></canvas>`)
    world = wo;
    world.canvas = self;
    height = h;
    width = w;
    canvas_element = document.getElementsByTagName('canvas')[0]; //$('#canvas')[0]
    canvas = canvas_element.getContext('2d');
    edge_mode = false;
    // tmp_edge = null
    $(canvas_element).click(on_click);

    clear();
    return self;
  };

  self.random_map = function () {
    var n_elements = 50;
    var n_edge = n_elements * 4;

    for (var i = 0; i < n_elements; i++) {
      world.add_random_node(width, height);
    }for (var i = 0; i < n_edge; i++) {
      world.add_random_edge();
    }self.reset();
  };

  function init_edge_mode(node) {
    tmp_nodeFrom = node;
    tmp_nodeTo = new Node(0, 0);
    // tmp_edge = new Edge(tmp_nodeFrom, new Node(0, 0),false)
    edge_mode = true;
    $(canvas_element).on('mousemove', on_move);
  }

  function end_edge_mode(node) {
    // tmp_edge.setTo(node)
    world.add_edge(tmp_nodeFrom, node, false);
    tmp_nodeFrom = node;
    // tmp_edge = new Edge(node, new Node(0, 0),false)
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
        node = world.add_node(x, y);
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
    self.draw_nodes();
    self.draw_edges();
  };

  function on_move(e) {
    self.reset();

    var node = world.get_node_near(e.clientX, e.clientY, 20);
    if (node) {
      tmp_nodeTo.x = node.x;
      tmp_nodeTo.y = node.y;
    } else {
      tmp_nodeTo.x = e.clientX;
      tmp_nodeTo.y = e.clientY;
    }

    self.draw_tmp_edge('#f60', 0.5, 2);
  }

  self.draw_nodes = function (nodes) {
    if (nodes) nodes.map(function (node) {
      return self.draw_node(node, 2, '#c99');
    });else _.map(world.nodes, function (node) {
      return self.draw_node(node);
    });
  };

  self.draw_edges = function () {
    var edges = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var color = arguments.length <= 1 || arguments[1] === undefined ? '#000' : arguments[1];
    var alpha = arguments.length <= 2 || arguments[2] === undefined ? 0.4 : arguments[2];
    var lineWidth = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

    if (!edges) {
      _.map(world.edges, function (edge) {
        return self.draw_edge(edge, color, alpha, lineWidth);
      });
    } else edges.map(function (edge) {
      return self.draw_edge(edge, color, alpha, lineWidth);
    });
  };

  function clear() {
    canvas.clearRect(0, 0, width, height);
  }

  self.draw_node = function (node) {
    var size = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var color = arguments.length <= 2 || arguments[2] === undefined ? '#00f' : arguments[2];
    var alpha = arguments.length <= 3 || arguments[3] === undefined ? 0.9 : arguments[3];

    canvas.shadowColor = '#666';
    canvas.shadowBlur = 3;
    canvas.shadowOffsetX = 0;
    canvas.shadowOffsetY = 0;

    canvas.globalAlpha = alpha;
    canvas.fillStyle = color;
    canvas.beginPath();
    canvas.arc(node.x, node.y, size, 0, 2 * Math.PI);
    canvas.fill();
  };

  self.draw_tmp_edge = function () {
    var color = arguments.length <= 0 || arguments[0] === undefined ? '#000' : arguments[0];
    var alpha = arguments.length <= 1 || arguments[1] === undefined ? 0.4 : arguments[1];
    var lineWidth = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    canvas.shadowBlur = 0;
    canvas.globalAlpha = alpha;
    canvas.strokeStyle = color;
    canvas.lineWidth = lineWidth;
    canvas.beginPath();
    canvas.moveTo(tmp_nodeFrom.x, tmp_nodeFrom.y);
    canvas.lineTo(tmp_nodeTo.x, tmp_nodeTo.y);
    canvas.stroke();
  };

  self.draw_edge = function (edge) {
    var color = arguments.length <= 1 || arguments[1] === undefined ? '#000' : arguments[1];
    var alpha = arguments.length <= 2 || arguments[2] === undefined ? 0.4 : arguments[2];
    var lineWidth = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

    if (!edge.one_way) lineWidth *= 2;
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
'use strict';

var Edge = (function () {
  var id = 0;

  return function Edge(nodeFrom, nodeTo, one_way) {

    console.log(nodeFrom);
    if (nodeFrom.equals(nodeTo)) throw new Error('Impossibile creare un arco tra due nodi equivalenti');

    if (nodeFrom.other_side_is(nodeTo)) throw new Error('Edge gia presente!!');

    if (nodeTo.other_side_is(nodeFrom)) throw new Error('Edge gia presentsdf se!!');

    this.id = id++;
    this.nodeFrom = nodeFrom;
    this.nodeTo = nodeTo;
    nodeFrom.add_connection(this.id);
    this.weight = this.length();
    this.one_way = one_way;
    if (!this.one_way) {
      console.log('non e one way quindi aggiungo anche la connection al contrario');
      nodeTo.add_connection(this.id);
    }
    return id;
  };
})();

Edge.prototype.in = function (edges) {
  return edges.find(function (e) {
    this.equals(e);
  });
};

Edge.prototype.length = function () {
  // if (this.nodeFrom && this.nodeTo) {
  //   var lat1 = this.nodeFrom.x,
  //     lat2 = this.nodeTo.x,
  //     lon1 = this.nodeFrom.y,
  //     lon2 = this.nodeTo.y
  //   var p = 0.017453292519943295; // Math.PI / 180
  //   var c = Math.cos;
  //   var a = 0.5 - c((lat2 - lat1) * p) / 2 +
  //     c(lat1 * p) * c(lat2 * p) *
  //     (1 - c((lon2 - lon1) * p)) / 2;

  //   return 12742 * Math.asin(Math.sqrt(a));
  //  
  return this.nodeFrom.distance(this.nodeTo.x, this.nodeFrom.y);

  // return Math.sqrt(Math.pow(this.nodeFrom.x - this.nodeTo.x, 2) + Math.pow(this.nodeFrom.y - this.nodeTo.y, 2))
  // } else
  // return 0
};

Edge.prototype.setFrom = function (nodeFrom) {
  this.nodeFrom = nodeFrom;
  this.weight = this.length();
};

Edge.prototype.setTo = function (nodeTo) {
  this.nodeTo = nodeTo;
  this.nodeFrom.add_connection(this);
  this.nodeTo.add_connection(this);
  this.weight = this.length();
};

Edge.prototype.equals = function (edge) {
  return edge.nodeFrom == this.nodeFrom && edge.nodeTo == this.nodeTo || edge.nodeTo == this.nodeFrom && edge.nodeFrom == this.nodeTo;
};

module.exports = Edge;
});

;require.register("node", function(exports, require, module) {
"use strict";

var Node = (function () {
  var id = 0;

  return function Node(x, y) {
    this.id = id++;
    this.x = x;
    this.y = y;
    this.connections = [];
    // this.n_connections = 0
  };
})();

Node.prototype.connected_to = function (edge_id) {
  return this.connections.indexOf(edge_id);
};

Node.prototype.other_side_is = function (nodeTo) {
  var world = require('world');
  return this.connections.find(function (edge_id) {
    return world.edges[edge_id].nodeTo.id == nodeTo.id;
  });
};

Node.prototype.other_side = function (edge) {
  if (edge.nodeFrom == this) return edge.nodeTo;
  if (edge.nodeTo == this) return edge.nodeFrom;
  console.log("IMPOSSIBILE esser qui !!!");
};

Node.prototype.add_connection = function (edge_id) {
  this.connections.push(edge_id);
};

Node.prototype.remove_connection = function (edge_id) {
  _.remove(this.connections, function (edge) {
    return edge == edge_id;
  });
};

Node.prototype.in = function (nodes) {
  var _this = this;

  // console.log(nodes)
  return _(nodes).find(function (n) {
    return _this.equals(n);
  });
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

  self.edges = {};
  self.nodes = {};
  var Edge = require('edge');
  var Node = require('node');
  var Ant = require('ant');

  var best_path = undefined;
  self.edges_length = 0;

  self.add_node = function (x, y) {
    var node = new Node(x, y);
    // console.log(node)
    node = node.in(self.nodes) || node;
    self.nodes[node.id] = node;
    self.canvas.draw_node(node);
    return node;
  };

  self.add_edge = function (nodeFrom, nodeTo, one_way) {
    // console.log(nodeFrom)
    // console.log(nodeTo)

    var edge = new Edge(nodeFrom, nodeTo, one_way);
    self.edges[edge.id] = edge;
    self.canvas.draw_edge(edge);
    self.edges_length += edge.weight;
    self.edges_length = parseFloat(self.edges_length).toFixed(2);
    return edge;
  };

  self.load = function () {
    $.getJSON('map2.json').then(function (loaded_edges) {
      loaded_edges.forEach(function (e) {

        var nodeFrom = self.add_node(e[0][0], e[0][1]);
        var nodeTo = self.add_node(e[1][0], e[1][1]);

        self.add_edge(nodeFrom, nodeTo, false); //e[2]) // dentro e[2] c'e' one way
      });
      self.canvas.reset();
    });
  };

  self.save = function () {
    return _.map(self.edges, function (edge) {
      return [[edge.nodeFrom.x, edge.nodeFrom.y], [edge.nodeTo.x, edge.nodeTo.y]];
    });
  };

  self.restart = function () {
    console.log('deosidnfo');
    self.edges = {};
    self.nodes = {};
    self.edges_length = 0;
    this.canvas.reset();
  };

  self.get_best_path = function () {
    return best_path;
  };

  self.get_random_node = function () {
    return _.sample(self.nodes);
    // return self.nodes[Math.floor(Math.random() * self.nodes.length)]
  };

  self.get_random_edge = function () {
    return _.sample(self.edges); //[Math.floor(Math.random() * self.edges.length)]
  };

  function rand(max) {
    return Math.floor(Math.random() * max);
  }

  self.add_random_node = function (max_x, max_y) {
    self.add_node(rand(max_x), rand(max_y));
  };

  self.add_random_edge = function () {
    self.add_edge(self.get_random_node(), self.get_random_node(), false);
  };

  self.search_odd_node = function () {
    console.log("Total self.nodes " + _(self.nodes).size());
    var odds = _.filter(self.nodes, function (node) {
      return node.connections.length % 2;
    });
    console.log("Odd self.nodes: " + odds.length);
    self.canvas.draw_nodes(odds);
    return odds;
  };

  self.get_leaf_nodes = function () {
    return _.filter(self.nodes, function (node) {
      return node.connections.length === 1;
    });
  };

  self.get_random_leaf_node = function () {
    var leaf_nodes = self.get_leaf_nodes();
    if (leaf_nodes.length) return _.sample(leaf_nodes);
    return false;
  };

  self.cycle = function () {
    var n_ants = 60;
    var n_cycle = 10;

    var a = new Ant();
    best_path = [];
    var best_path_l = Infinity;

    for (var n = 0; n < n_cycle; n++) {
      console.log("cycle " + n);
      for (var i = 0; i < n_ants; i++) {
        a.reset();
        a.run();
        if (a.path_l < best_path_l) {
          console.log('trovato best: ' + a.path.length + " " + a.path_l);
          best_path = a.path.slice();
          best_path_l = a.path_l;
        }
      }

      console.log(best_path_l);
      // sul path migliore, metto dei pesi
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = best_path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var edge = _step.value;

          edge.nodeFrom.add_pherormone(edge);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  };

  self.get_connected_edges = function (el) {
    var res = [];
    if (el instanceof Edge) res = self.edges.filter(function (e) {
      return e.connected(el);
    });else if (el instanceof Node) res = self.edges.filter(function (e) {
      return e.nodeFrom.equals(el) || e.nodeTo.equals(el);
    });
    return res;
  };

  self.remove_leafs = function () {
    self.get_leaf_nodes().forEach(self.remove_until_t);
    self.canvas.reset();
  };

  self.remove_until_t = function (from_node) {
    var current_node = from_node;
    var edge_id_to_remove = null;
    var edge = null;
    var next_node = null;

    while (current_node.connections.length === 1) {
      edge_id_to_remove = current_node.connections[0];
      edge = self.edges[edge_id_to_remove];
      next_node = current_node.other_side(edge);
      current_node.remove_connection(edge_id_to_remove);
      next_node.remove_connection(edge_id_to_remove);
      delete self.edges[edge_id_to_remove];
      delete self.nodes[current_node.id];
      current_node = next_node;
    }
    // self.canvas.reset()
  };

  self.get_node_at = function (x, y) {
    var res = _(self.nodes).filter(function (node) {
      return node.x === x && node.y === y;
    });
    if (res.length === 1) return res[0];else return false;
  };

  self.get_node_near = function (x, y, distance) {
    return _.find(self.nodes, function (node) {
      return node.distance(x, y) <= distance;
    });
  };

  return self;
})();
});

;
//# sourceMappingURL=app.js.map