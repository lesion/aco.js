module.exports = (function() {

  var self = {}

  let edges = []
  let nodes = []
  let ants = []
  let Edge = require('edge')
  let Node = require('node')

  let edges_length = 0

  self.restart = function(){
    edges = []
    nodes = []
    edges_length = 0
  }

  self.add_node = function(node) {
    nodes.push(node)
    self.canvas.draw_node(node)
    $('#n_nodes').html(nodes.length)
    return node
  }

  self.get_random_node = function() {
    return nodes[Math.floor(Math.random() * nodes.length)]
  }

  self.get_random_edge = function() {
    return edges[Math.floor(Math.random() * edges.length)]
  }

  function rand(max) {
    return Math.floor(Math.random() * max)
  }

  self.add_random_node = function(max_x, max_y) {
    var node = new Node(rand(max_x), rand(max_y))
    if(nodes.findIndex(n=>n.equals(node)) !== -1)
    {
      self.add_random_node()
      return
    }
    self.add_node(node)
  }

  self.add_random_edge = function() {
    var nodeFrom = rand(nodes.length)
    var nodeTo = rand(nodes.length)

    // ensure node index is different
    while(nodeTo===nodeFrom)
      nodeTo = rand(nodes.length)

    let edge = new Edge(nodes[nodeFrom],nodes[nodeTo])
    self.add_edge(edge)
  }

  let Ant = require('ant')
  self.add_ant = function() {
    var a = new Ant()
    ants.push(a)
    console.log(a.move())
  }

  self.cycle = function(){
    let n_ants = 100
    let a = new Ant()
    let best_path = []
    let best_path_l = Infinity

    for(let i=0;i<n_ants;i++)
    {
      a.reset()
      a.move()
      if(a.path_l<best_path_l){
        console.log('trovato best: ' + a.path_l)
        best_path = a.path.slice()
        best_path_l = a.path_l
      }

    }

    // sul path migliore, metto dei pesi
    // for(edge of best_path){
      // edge.nodeFrom.
    // }


  }

  self.get_connected_edges = function(el) {
    let res = []
    if (el instanceof Edge)
      res = edges.filter(e => e.connected(el))
    else if (el instanceof Node)
      res = edges.filter(e => e.nodeFrom.equals(el) || e.nodeTo.equals(el))
    return res
  }

  self.add_edge = function(edge) {
    if (!edge.in(edges) && !edge.nodeFrom.equals(edge.nodeTo)){
      edges.push(edge)
      self.canvas.draw_edge(edge)
      $('#n_edges').html(edges.length)
      edges_length += edge.weight
      $('#edges_length').html(edges_length)
    }
    else
      console.log('edge doppio o nodeFrom=nodeTo')
    return edge
  }


  self.get_nodes = () => nodes
  self.get_edges = () => edges

  self.get_node_at = function(x, y) {
    let res = nodes.filter(node => (node.x === x && node.y === y))
    if (res.length === 1)
      return res[0]
    else
      return false
  }

  self.get_node_near = function(x, y, distance) {
    let res = nodes.filter(function(node) {
      return node.distance(x, y) <= distance
    })
    if (res.length >= 1)
      return res[0]
    return false
  }



  return self

})()