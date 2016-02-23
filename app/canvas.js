module.exports = (function() {

  var self = {}
  let canvas,
    height, width,
    edge_mode,
    canvas_element,
    tmp_nodeFrom, tmp_nodeTo,
    world,
    Edge = require('edge'),
    Node = require('node')

  self.init = function(w, h, wo) {
    // $('body').css('maxWidth', width)
    // $('body').append(`<canvas id="canvas"  width="${w}" height="${h}" style="width: ${w*2}; height: ${h*2}"></canvas>`)
    world = wo
    world.canvas = self
    height = h
    width = w
    canvas_element = document.getElementsByTagName('canvas')[0]//$('#canvas')[0]
    canvas = canvas_element.getContext('2d')
    edge_mode = false
    // tmp_edge = null
    $(canvas_element).click(on_click)

    clear()
    return self
  }

  self.random_map = function() {
    let n_elements = 50
    let n_edge = n_elements * 4

    for (let i = 0; i < n_elements; i++)
      world.add_random_node(width,height)

    for (let i = 0; i < n_edge; i++) 
      world.add_random_edge()

    self.reset()
  }


  function init_edge_mode(node) {
    tmp_nodeFrom = node
    tmp_nodeTo = new Node(0,0)
    // tmp_edge = new Edge(tmp_nodeFrom, new Node(0, 0),false)
    edge_mode = true
    $(canvas_element).on('mousemove', on_move)

  }

  function end_edge_mode(node) {
    // tmp_edge.setTo(node)
    world.add_edge(tmp_nodeFrom,node,false)
    tmp_nodeFrom = node
    // tmp_edge = new Edge(node, new Node(0, 0),false)
    self.reset()
  }

  function interrupt_edge_mode() {
    $(canvas_element).off('mousemove', on_move)
    edge_mode = false
    self.reset()
  }

  function on_click(e) {
    let x = e.clientX
    let y = e.clientY


    let node = world.get_node_near(x, y, 15)

    if (node) { // found a node near click
      if (!edge_mode)
        init_edge_mode(node)
      else
        end_edge_mode(node)

    } else {
      if (edge_mode)
        interrupt_edge_mode()
      else {
        node = world.add_node(x,y)
        self.draw_node(node)
      }
    }
  }


  self.restart = function(){
    world.restart()
    clear()
  }

  self.reset =function() {
    clear()
    self.draw_nodes()
    self.draw_edges()
  }

  function on_move(e) {
    self.reset()

    let node = world.get_node_near(e.clientX, e.clientY, 20)
    if (node) {
      tmp_nodeTo.x = node.x
      tmp_nodeTo.y = node.y
    } else {
      tmp_nodeTo.x = e.clientX
      tmp_nodeTo.y = e.clientY

    }

    self.draw_tmp_edge( '#f60', 0.5, 2)
  }


  self.draw_nodes = function(nodes) {
    if(nodes)
      nodes.map(node => self.draw_node(node,2,'#c99'))
    else
      _.map(world.nodes,node => self.draw_node(node))
  }



  self.draw_edges = function(edges = false, color = '#000', alpha = 0.4, lineWidth = 1) {
    if (!edges)
    {
      _.map(world.edges,edge => self.draw_edge(edge, color, alpha, lineWidth))
    }
    else
      edges.map(edge => self.draw_edge(edge, color, alpha, lineWidth))
  }

  function clear() {
    canvas.clearRect(0, 0, width, height);
  }

  self.draw_node = function(node, size = 1, color = '#00f', alpha = 0.9) {

    canvas.shadowColor = '#666';
    canvas.shadowBlur = 3;
    canvas.shadowOffsetX = 0;
    canvas.shadowOffsetY = 0;

    canvas.globalAlpha = alpha;
    canvas.fillStyle = color;
    canvas.beginPath();
    canvas.arc(node.x, node.y, size, 0, 2 * Math.PI);
    canvas.fill();
  }

  self.draw_tmp_edge = function( color = '#000', alpha = 0.4, lineWidth = 1){
    canvas.shadowBlur = 0;
    canvas.globalAlpha = alpha;
    canvas.strokeStyle = color;
    canvas.lineWidth = lineWidth;
    canvas.beginPath();
    canvas.moveTo(tmp_nodeFrom.x,tmp_nodeFrom.y);
    canvas.lineTo(tmp_nodeTo.x, tmp_nodeTo.y);
    canvas.stroke();
  }

  self.draw_edge = function(edge, color = '#000', alpha = 0.4, lineWidth = 1) {
    if(!edge.one_way) lineWidth*=2
    canvas.shadowBlur = 0;
    canvas.globalAlpha = alpha;
    canvas.strokeStyle = color;
    canvas.lineWidth = lineWidth;
    canvas.beginPath();
    canvas.moveTo(edge.nodeFrom.x, edge.nodeFrom.y);
    canvas.lineTo(edge.nodeTo.x, edge.nodeTo.y);
    canvas.stroke();
  }

  return self

})()



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