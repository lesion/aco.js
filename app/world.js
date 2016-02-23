module.exports = (function() {

  var self = {}

  self.edges = {}
  self.nodes = {}
  let Edge = require('edge')
  let Node = require('node')
  let Ant = require('ant')

  let best_path
  self.edges_length = 0

  self.add_node = function(x, y) {
    let node = new Node(x, y)
      // console.log(node)
    node = node.in(self.nodes) || node
    self.nodes[node.id] = node
    self.canvas.draw_node(node)
    return node
  }

  self.add_edge = function(nodeFrom, nodeTo, one_way) {
    // console.log(nodeFrom)
    // console.log(nodeTo)

    let edge = new Edge(nodeFrom, nodeTo, one_way)
    self.edges[edge.id] = edge
    self.canvas.draw_edge(edge)
    self.edges_length += edge.weight
    self.edges_length = parseFloat(self.edges_length).toFixed(2)
    return edge
  }

  self.load = function() {
    $.getJSON('map2.json')
      .then(loaded_edges => {
        loaded_edges.forEach(e => {

          let nodeFrom = self.add_node(e[0][0], e[0][1])
          let nodeTo = self.add_node(e[1][0], e[1][1])

          self.add_edge(nodeFrom, nodeTo, false) //e[2]) // dentro e[2] c'e' one way

        })
        self.canvas.reset()
      })
  }


  self.save = function() {
    return _.map(self.edges, edge => [
      [edge.nodeFrom.x, edge.nodeFrom.y],
      [edge.nodeTo.x, edge.nodeTo.y]
    ])
  }

  self.restart = function() {
    console.log('deosidnfo')
    self.edges = {}
    self.nodes = {}
    self.edges_length = 0
    this.canvas.reset()
  }

  self.get_best_path = function() {
    return best_path
  }

  self.get_random_node = function() {
    return _.sample(self.nodes)
      // return self.nodes[Math.floor(Math.random() * self.nodes.length)]
  }

  self.get_random_edge = function() {
    return _.sample(self.edges) //[Math.floor(Math.random() * self.edges.length)]
  }

  function rand(max) {
    return Math.floor(Math.random() * max)
  }

  self.add_random_node = function(max_x, max_y) {
    self.add_node(rand(max_x), rand(max_y))
  }

  self.add_random_edge = function() {
    self.add_edge(self.get_random_node(), self.get_random_node(), false)
  }


  self.search_odd_node = function() {
    console.log("Total self.nodes " + _(self.nodes).size())
    let odds = _.filter(self.nodes, node => node.connections.length % 2)
    console.log("Odd self.nodes: " + odds.length)
    self.canvas.draw_nodes(odds)
    return odds
  }


  self.get_leaf_nodes = function() {
    return _.filter(self.nodes, node => node.connections.length === 1)
  }

  self.get_random_leaf_node = function() {
    var leaf_nodes = self.get_leaf_nodes()
    if (leaf_nodes.length)
      return _.sample(leaf_nodes)
    return false
  }


  self.cycle = function() {
    let n_ants = 60
    let n_cycle = 10

    let a = new Ant()
    best_path = []
    let best_path_l = Infinity

    for (let n = 0; n < n_cycle; n++) {
      console.log("cycle " + n)
      for (let i = 0; i < n_ants; i++) {
        a.reset()
        a.run()
        if (a.path_l < best_path_l) {
          console.log('trovato best: ' + a.path.length + " " + a.path_l)
          best_path = a.path.slice()
          best_path_l = a.path_l
        }

      }

      console.log(best_path_l)
        // sul path migliore, metto dei pesi
      for (let edge of best_path) {
        edge.nodeFrom.add_pherormone(edge)
      }
    }

  }

  self.get_connected_edges = function(el) {
    let res = []
    if (el instanceof Edge)
      res = self.edges.filter(e => e.connected(el))
    else if (el instanceof Node)
      res = self.edges.filter(e => e.nodeFrom.equals(el) || e.nodeTo.equals(el))
    return res
  }

  self.remove_leafs = function() {
    self.get_leaf_nodes().forEach(self.remove_until_t)
    self.canvas.reset()
  }

  self.remove_until_t = function(from_node) {
    var current_node = from_node
    let edge_id_to_remove = null
    let edge = null
    let next_node = null

    while (current_node.connections.length === 1) {
      edge_id_to_remove = current_node.connections[0]
      edge = self.edges[edge_id_to_remove]
      next_node = current_node.other_side(edge)
      current_node.remove_connection(edge_id_to_remove)
      next_node.remove_connection(edge_id_to_remove)
      delete self.edges[edge_id_to_remove]
      delete self.nodes[current_node.id]
      current_node = next_node
    }
    // self.canvas.reset()
  }

  self.get_node_at = function(x, y) {
    let res = _(self.nodes).filter(node => (node.x === x && node.y === y))
    if (res.length === 1)
      return res[0]
    else
      return false
  }

  self.get_node_near = function(x, y, distance) {
    return _.find(self.nodes, node => node.distance(x, y) <= distance)
  }



  return self

})()