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



    //pass in movieDetails id from URL first
    ctrl.getCurrentActorsId = NotesModel.getCurrentActorsId;

    //get movieDetails by ID and set the obj available to the scope using stateParams
    NotesModel.getMovieByTitle(movieTitle).then(function (result) {
      ctrl.note = result;
      NotesModel.setCurrentMovie(movieId);
      ctrl.getCurrentActorsId();

      //console.log(ctrl.note);
    });

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
    }

    //function deleteNote(note){
    //
    //  ctrl.deleteNote = NotesModel.deleteBookmark;
    //  ctrl.deleteNote(note);
    //  returnToNotes();
    //}
    ctrl.goBack = goBack;

    //ctrl.deleted = deleteNote;

});