'use strict';

angular.module('MovieApp')
  //.config(function ($stateProvider) {
  //  $stateProvider
  //    .state('notewrangler.notes.movieDetails', {
  //      url: 'notes/:noteId',
  //      views: {
  //        'mainView@': {
  //          controller: 'NotesCtrl as ctrl',
  //          templateUrl: 'app/notes/movieDetails/movieDetails.tmpl.html'
  //        }
  //      }
  //    })
  //})
  .controller('MovieDetailsCtrl', function (NotesModel, $stateParams, $state) {
    var ctrl = this,
      movieTitle = $stateParams.movieTitle,
      movieId = $stateParams.movieId;
      //console.log($stateParams.movieId);

    //NotesModel.setCurrentMovie(movieId);

    //pass in movieDetails id from URL first
    ctrl.getCurrentActorsId = NotesModel.getCurrentActorsId;

    //get movieDetails by ID and set the obj available to the scope using stateParams
    NotesModel.getMovieByTitle(movieTitle).then(function (result) {
      ctrl.note = result;
      //NotesModel.setCurrentMovie(movieTitle);
      NotesModel.setCurrentMovie(movieId);
      //console.log(ctrl.note);
    });

    NotesModel.getCurrentActorsId(movieId).then(function (result) {
      ctrl.actor = result;

      //ctrl.photos = NotesModel.getMyPhotos(result);
      //console.log(ctrl.photos);
      NotesModel.getMyPhotos(result).then(function(actors){
        ctrl.actors = actors;
        //console.log(actors); //contains cast memeber name and role they play in movie

      });

    });

    NotesModel.getNew().then(function(result){
      //console.log(result);
    });
    //ctrl.getCurrentPhotos = NotesModel.getCurrentPhotos;
    //console.log(ctrl.getCurrentPhotos());

    //NotesModel.getMyPhoto().then(function(result){
    //  ctrl.photo = result;
    //  console.log(result.preferredImage.uri);
    //});



    //ctrl.currentActors = NotesModel.getCurrentActors;




    //make http request for categories
    //CategoriesModel.getCategories().then(function (result) {
    //  ctrl.categories = result;
    //});


    //get categrory name based on current notecard category id
    //ctrl.getcatname = CategoriesModel.getCurrentNoteCategoryName;

    //Get users
    //UsersModel.getUserByNoteId(noteId).then(function (result) {
    //  ctrl.user = result;
    //});

    function returnToMovies(){
      $state.go('movies', {
        //passs in param
        //noteId: noteId
      })
    }

    function goBack(){
      returnToMovies();
      ctrl.reset();
    }

    //function deleteNote(note){
    //
    //  ctrl.deleteNote = NotesModel.deleteBookmark;
    //  ctrl.deleteNote(note);
    //  returnToNotes();
    //}
    ctrl.goBack = goBack;

    ctrl.reset = NotesModel.reset;

    //ctrl.deleted = deleteNote;

});