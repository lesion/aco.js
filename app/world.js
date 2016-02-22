module.exports = (function() {

  var self = {}

  self.edges = []
  self.nodes = []
  let Edge = require('edge')
  let Node = require('node')

  let best_path

  self.edges_length = 0
  

  self.load = function() {
    $.getJSON('map2.json')
      .then(loaded_edges => {
        loaded_edges.forEach(e => {
          let nodeFrom = new Node(e[0][0], e[0][1])
          let nodeTo = new Node(e[1][0], e[1][1])

          if (!nodeFrom.in(self.nodes))
            self.nodes.push(nodeFrom)
          if (!nodeTo.in(self.nodes))
            self.nodes.push(nodeTo)
          try {
            self.edges.push(new Edge(nodeFrom.in(self.nodes), nodeTo.in(self.nodes),false))
          }
          catch(e){
            console.log(e)
          }
        })
        self.canvas.reset()
      })
  }

  self.save = function() {
    return self.edges.map(edge => [
      [edge.nodeFrom.x, edge.nodeFrom.y],
      [edge.nodeTo.x, edge.nodeTo.y]
    ])
  }

  self.restart = function() {
    console.log('deosidnfo')
    self.edges = []
    self.nodes = []
    self.edges_length = 0
    this.canvas.reset()
  }

  self.get_best_path = function() {
    return best_path
  }

  self.add_node = function(node) {
    self.nodes.push(node)
    self.canvas.draw_node(node)
    return node
  }

  self.get_random_node = function() {
    return self.nodes[Math.floor(Math.random() * self.nodes.length)]
  }

  self.get_random_edge = function() {
    return self.edges[Math.floor(Math.random() * self.edges.length)]
  }

  function rand(max) {
    return Math.floor(Math.random() * max)
  }

  self.add_random_node = function(max_x, max_y) {
    var node = new Node(rand(max_x), rand(max_y))
    if (self.nodes.findIndex(n => n.equals(node)) !== -1) {
      self.add_random_node()
      return
    }
    self.add_node(node)
  }

  self.add_random_edge = function() {
    var nodeFrom = rand(self.nodes.length)
    var nodeTo = rand(self.nodes.length)

    // ensure node index is different
    while (nodeTo === nodeFrom)
      nodeTo = rand(self.nodes.length)

    let edge = new Edge(self.nodes[nodeFrom], self.nodes[nodeTo])
    self.add_edge(edge)
  }

  let Ant = require('ant')

  self.search_odd_node = function() {
    console.log("Total self.nodes " + self.nodes.length)
    let odds = self.nodes.filter(node => node.connections.length % 2)
    console.log("Odd self.nodes: " + odds.length)
    self.canvas.draw_nodes(odds)
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

  self.add_edge = function(edge) {
    if (!edge.in(self.edges)) {
      self.edges.push(edge)

      self.canvas.draw_edge(edge)
      self.edges_length += edge.weight
      self.edges_length = parseFloat(self.edges_length).toFixed(2)
    } else
      console.log('edge doppio o nodeFrom=nodeTo')
    return edge
  }


  self.get_nodes = () => self.nodes
  self.get_edges = () => self.edges

  self.get_node_at = function(x, y) {
    let res = self.nodes.filter(node => (node.x === x && node.y === y))
    if (res.length === 1)
      return res[0]
    else
      return false
  }

  self.get_node_near = function(x, y, distance) {
    let res = self.nodes.filter(function(node) {
      return node.distance(x, y) <= distance
    })
    if (res.length >= 1)
      return res[0]
    return false
  }



  return self

})()