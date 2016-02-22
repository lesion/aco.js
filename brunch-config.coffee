module.exports=
    paths:
      public: ''
    files:
      javascripts:
        joinTo:
          'app.js': /^app/
          'vendor.js': /^(bower_components|node_modules)/
      stylesheets:
        joinTo:
          'app.css': /^app/
      templates:
        joinTo:
          'templates.js': /^app/

