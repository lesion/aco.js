function Ant(start_node = null) {

  this.world = require('world')
  this.canvas = require('canvas')
  this.visited_edge = []
  this.unvisited_edge = this.world.get_edges().slice()
  this.path = []
  this.path_l = 0
  this.current_node = start_node

  this.last_edge = null

  if (!this.current_node)
    this.current_node = this.world.get_random_node()

}

Ant.prototype.reset = function() {
  this.visited_edge = []
  this.unvisited_edge = this.world.get_edges().slice()
  this.path = []
  this.path_l = 0
  this.current_node = this.world.get_random_node()
}

Ant.prototype.visit = function(edge) {

  // console.log(edge)  

  // add this edge to path
  this.path.push(edge)

  // increase the path length
  this.path_l += edge.weight


  // this.current_node.add_pherormone(edge)
  // console.log(this.current_node.connection_weight)

  // update current node
  this.current_node = (this.current_node.equals(edge.nodeFrom) ? edge.nodeTo : edge.nodeFrom)

  //add this edge to visited one
  // this.visited_edge.push(edge)

  // search the index of this edge in unvisited edges
  let edge_index = this.unvisited_edge.findIndex(e => edge.equals(e))
  this.last_edge = edge
    //remove this edge from unvisited edges!
  if (edge_index > -1)
    this.unvisited_edge.splice(edge_index, 1)


  // edge.add_pherormone()
};

Ant.prototype.move = function() {

  let next_edge = null
    // se ho solamente due scelte, vado avanti
  if (this.current_node.connections.length == 2 && this.last_edge != null) {
    if (this.current_node.connections[0].equals(this.last_edge))
      next_edge = this.current_node.connections[1]
    else
      next_edge = this.current_node.connections[0]
      // this.canvas.draw_node(this.current_node, 2, '#f66',0.5)
    this.visit(next_edge)
    this.canvas.draw_edge(next_edge, '#f66', 0.4, 3)
    this.move()
    return false

  } else
    next_edge = this.decision_maker()

  // this.canvas.draw_node(this.current_node, 2, '#f66')
  this.visit(next_edge)
  this.canvas.draw_edge(next_edge, '#f66', 0.4, 3)
  // this.canvas.draw_edge(next_edge, '#f66')

  // check if path is complete and all edges are visited
  if (this.has_finish()) {
    return ([this.path_l, this.path])
  }
  return false
}

Ant.prototype.run = function() {
  // let next_edge = null
  var ret = this.move()
  while (ret == false){
    ret = this.move()
  }
  console.log(ret)
  console.log('sono qui ?')
  return ret
};

Ant.prototype.has_finish = function() {
  return (this.unvisited_edge.length === 0)
};

Ant.prototype.is_unvisited = function(edge) {
  return edge.in(this.unvisited_edge)
}

Ant.prototype.is_visited = function(edge) {
  return edge.in(this.visited_edge)
}

Ant.prototype.n_visited = function(edge) {
  let v = this.path.reduce((tot, e) => (e.equals(edge) ? ++tot : tot), 0)
  return v
};

var choose = require('choose')
Ant.prototype.decision_maker = function() {
  // this.canvas.reset()
  let possible_edges = this.current_node.connections


  // se ho solo due scelte possibili, non torno indietro 
  // if(possible_edges.length==2)

  let edges_height = this.current_node.connection_weight
  let edges_probabilities = []

  // this.canvas.draw_edges(possible_edges,'#6f6')

  // ogni via ha una probabilita' di essere presa
  // che dipende da diversi fattori
  // 1- e' gia' stata percorsa da me ?
  // 2- quandi ferormoni ci sono ?
  // 3- quanto e' lunga la strada ?
  // 4- se sono state tutte percorse, quale e' quella percorsa meno volte?
  // 5- quale strada mi avvicina di piu' alla strada piu' vicina non visitata

  edges_probabilities = possible_edges.map((e, idx) => this.get_probability(e, edges_height[idx]))
  return choose(possible_edges, edges_probabilities)

}

var Edge = require('edge')

Ant.prototype.get_probability = function(edge, enjoy) {
  return (10*edge.weight / (this.n_visited(edge)*1000))


  return ((1000 + enjoy * 1000) / this.n_visited(edge) * 100) / edge.weight
  let probability = 10000


  // piu' e' stata percorsa meno voglio ripercorrerla
  // if(this.n_visited(edge)) 
  probability *= enjoy
  probability /= (this.n_visited(edge) * 200)
  probability /= edge.weight


  return probability
}



module.exports = Ant