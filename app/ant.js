function Ant(start_node = null) {

  this.world = require('world')
  this.canvas = require('canvas')
  this.visited_edge = {}
  this.unvisited_edge = _.cloneDeep(this.world.edges)
  this.path = []
  this.path_l = 0
  this.current_node = start_node

  this.last_edge_id = -1

  if (!this.current_node)
    this.current_node = this.world.get_random_leaf_node()

}

Ant.prototype.reset = function() {
  this.visited_edge = {}
  this.unvisited_edge = _.cloneDeep(this.world.edges)
  this.path = []
  this.path_l = 0
  this.last_edge_id = -1
  this.current_node = this.world.get_random_leaf_node()
}

Ant.prototype.visit = function(edge_id) {

  console.log('visito il edge', edge_id)
  let edge = this.world.edges[edge_id]

  // add this edge to path
  this.path.push(edge_id)

  // increase the path length
  this.path_l += edge.weight

  // this.current_node.add_pherormone(edge)
  // console.log(this.current_node.connection_weight)

  // update current node
  this.current_node = this.current_node.other_side(edge) //(this.current_node.equals(edge.nodeFrom) ? edge.nodeTo : edge.nodeFrom)

  //add this edge to visited one
  // this.visited_edge.push(edge)

  // search the index of this edge in unvisited edges
  // let edge_index = this.unvisited_edge.findIndex(e => edge.equals(e))
  this.last_edge_id = edge_id
    //remove this edge from unvisited edges!
    // if (edge_index > -1)
  delete this.unvisited_edge[edge_id]
    // this.unvisited_edge.splice(edge_index, 1)

  this.canvas.draw_edge(edge, '#6f6', 0.7, 5)

  // edge.add_pherormone()
}

// faccio una mossa
Ant.prototype.move = function() {
  if (this.has_finish()) {
    console.log('FINITO!')
    return ([this.path_l, this.path])
  }
  if (this.forced_move()) return false
  let next_edge_id = this.decision_maker()
  this.visit(next_edge_id)
  this.forced_move()

  return false
}


// fa una mossa forzata (ad esempio se sono davanti ad un vicolo cieco o se posso solo andare avanti)
Ant.prototype.forced_move = function() {
  // let edges = _.map(this.current_node.connections, edge => edge.id)
  let edges = this.current_node.connections
  let next_edge_id = null
  if (edges.length == 1)
    next_edge_id = edges[0]
  else if (edges.length === 2 && this.last_edge_id != -1 && this.world.edges[this.last_edge_id].rotonda) {
    if (edges[0] === this.last_edge_id)
      next_edge_id = edges[1]
    else
      next_edge_id = edges[0]
  }

  if (!next_edge_id) return false

  if(this.n_visited(next_edge_id)>20)
  {
    console.log('MA PORCODIO!')
    console.log(next_edge_id)
    return true
  }
  this.visit(next_edge_id)
  this.forced_move()
  return true

}

Ant.prototype.run = function() {
  var that = this
  var ret = this.move()
  var loop = setInterval(function() {
    ret = that.move()
    if (ret != false) {
      console.log('finito!!')
      clearTimeout(loop)
    }
  }, 50)

};

Ant.prototype.has_finish = function() {
  console.log(_.size(this.unvisited_edge), "unvisited")
  return (_.size(this.unvisited_edge) === 0)
};

Ant.prototype.is_unvisited = function(edge) {
  return this.unvisited_edge[edge.id]
}


var choose = require('choose')

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
Ant.prototype.decision_maker = function() {
  // this.canvas.reset()
  let possible_edges = this.current_node.connections
  let edges_probabilities = []



  // ogni via ha una probabilita' di essere presa
  // che dipende da diversi fattori
  // 1- e' gia' stata percorsa da me ?
  // 2- quandi ferormoni ci sono ?
  // 3- quanto e' lunga la strada ?
  // 4- se sono state tutte percorse, quale e' quella percorsa meno volte?
  // 5- quale strada mi avvicina di piu' alla strada piu' vicina non visitata

  edges_probabilities = possible_edges.map(e => this.get_probability(e))
  console.log(possible_edges)
  console.log(edges_probabilities)
  var c = choose(possible_edges, edges_probabilities)
  return c

}

var Edge = require('edge')

Ant.prototype.n_visited = function(edge_id) {
  var n = 1
  this.path.forEach(e => e == edge_id ? n += 1 : 0)
  return n
};

Ant.prototype.get_probability = function(edge_id, enjoy) {
  if(this.is_unvisited(edge_id))
    return 100

  let edge = this.world.edges[edge_id]
  return (1000 / Math.pow(this.n_visited(edge_id),3))


  return ((1000 + enjoy * 1000) / this.n_visited(edge_id) * 100) / edge.weight
  let probability = 10000


  // piu' e' stata percorsa meno voglio ripercorrerla
  // if(this.n_visited(edge)) 
  probability *= enjoy
  probability /= (this.n_visited(edge_id) * 200)
  probability /= edge.weight


  return probability
}



module.exports = Ant