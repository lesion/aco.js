var obj = require('./piossa2.json')
var Node = require('../app/node.js')
var Edge = require('../app/edge.js')

// console.log(obj)

// add nodes before
// var nodes = []
// var edges = []

// strade.forEach(strada => {
//     console.log(strada.properties.name)
//     console.log(strada.geometry.coordinates.length)
//     strada.geometry.coordinates.forEach(nodo => {
//       var node = new Node(nodo[0], nodo[1])
//       if (!node.in(nodes)) {
//         console.log('Aggiungo nodo ' + nodes.length)
//         nodes.push(node)
//       } else {
//         console.log('nodo gia esiste')
//       }
//     })
//   })



// strade.forEach(strada => {
//     console.log(strada.properties.name)
//     console.log(strada.geometry.coordinates.length)
//     strada.geometry.coordinates.forEach(nodo => {
//       var node = new Node(nodo[0], nodo[1])
//       if (!node.in(nodes)) {
//         console.log('Aggiungo nodo ' + nodes.length)
//         nodes.push(node)
//       } else {
//         console.log('nodo gia esiste')
//       }
//     })
//   })


var strade = obj.features.filter(o => o.properties.hasOwnProperty('highway') &&
  ['unclassified',
    'residential',
    'primary',
    'service',
    'secondary',
    'road',
    'motorway',
    'trunk',
    'tertiary',
    'secondary_link',
    'tertiary_link',
    'living_street'
  ].indexOf(o.properties.highway) > -1)



var max_x = 0
var min_x = Infinity
var min_y = Infinity
var max_y = 0

var edges = []
strade.forEach(strada => {
  var from_node = null
  var one_way = (strada.properties.hasOwnProperty('oneway') &&
    strada.properties.oneway == 'yes')
  var rotonda = (strada.properties.hasOwnProperty('junction') &&
    strada.properties.junction == 'roundabout')
  strada.geometry.coordinates.forEach(node => {
    if (!from_node) {
      from_node = node
      return
    }
    if ((from_node[0] == node[0] && from_node[1] == node[1])) return
    var edge = {
      from: {
        x: from_node[0],
        y: from_node[1]
      },
      to: {
        x: node[0],
        y: node[1]
      },
      one_way: one_way || rotonda,
      rotonda: rotonda
    }
    edges.push(edge)
    from_node = node
  })
})


// devo aggiungere il one way 

console.log(JSON.stringify(edges))
  // console.log("min_x: ", min_x )
  // console.log("min_y: ", min_y )
  // console.log("max_x: ", max_x )
  // console.log("max_y: ", max_y )

// console.log('nodi: ' + nodes.length)
// console.log('archi: ' + edges.length)

// strade.forEach( s => console.log(s))

// console.log(strade.length)
// console.log(strade)