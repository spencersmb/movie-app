var _ = require('lodash');
var Note = require('../models/note')

module.exports = function(app) {
  app.get('/movies', function(req, res) {
    res.json(Note.all());
  });

  app.post('/movies', function(req, res) {
    // Add a delay here to simulate the delay of a live server
    // So things like button isSubmitting states can be demonstrated
    setTimeout(function(){
      res.json(Note.create(req.body));
    }, 1000);
  });

  app.put('/movies/:id', function(req, res) {
    // Add a delay here to simulate the delay of a live server
    // So things like button isSubmitting states can be demonstrated
    setTimeout(function(){
      res.json(Note.update(req.body));
    },1000)
  });

  app.get('/movies/:id', function(req, res) {
    var noteId = parseInt(req.param('id'), 10);
    res.json(Note.get(noteId) || {});
  });

  app.delete('/movies/:id', function(req, res) {
    res.json(Note.delete(parseInt(req.param('id'), 10)) || {});
  });
};
