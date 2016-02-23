Vue.config.debug = true

new Vue({
  el: '#app',
  template: require('view/world')(),
  replace: true,
  data: {
    // world: null,
    // canvas: null,
    // ant: {}
  },
  created: function() {
    console.log('sdf')
    let world = require('world')
    let canvas = require('canvas')
    this.world = world
    this.canvas = canvas

  },
  ready: function() {
    this.canvas.init(900, 600, this.world)
  },
  computed: {
    n_nodes: function() {
      return this.world.nodes.length
    },
    n_edges: function() {
      return this.world.edges.length
    },
    edges_length: function() {
      return this.world.edges_length
    }

  },
  methods: {
    restart: function() {
      // console.log(this.world)
      this.world.restart()
    },
    random_map: function() {
      this.canvas.random_map()
    },
    add_node: function() {
      console.log('add node')
      this.world.add_random_node(900, 600)
    },
    add_edge: function() {
      this.world.add_random_edge()
    },
    load_map: function(){
      this.world.load()
    },
    save_map: function(){
      var link = document.createElement('a')
      document.body.appendChild(link)
      var data = JSON.stringify(this.world.save())
      var jsonData = 'data:application/json;charset=utf-8,' + encodeURIComponent(data)
      link.href = jsonData
      link.target = '_blank'
      link.download = 'map.json'
      link.click()
      document.body.removeChild(link)
    },
    search_odd_node: function(){
      this.world.search_odd_node()
    },
    create_ant: function(){
      var Ant = require('ant')
      this.ant = new Ant()
    },
    move_ant: function(){
      console.log('vado di move')
      this.ant.move()
      console.log('vado di move fine')
    },
    remove_leafs : function(){
      this.world.remove_leafs()
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
})


// webapp.$mount('#world')