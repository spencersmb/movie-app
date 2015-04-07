'use strict';

angular.module('MovieApp')
  //.config(function ($stateProvider) {
  //  $stateProvider
  //    .state('notewrangler.notes.note', {
  //      url: 'notes/:noteId',
  //      views: {
  //        'mainView@': {
  //          controller: 'NotesCtrl as ctrl',
  //          templateUrl: 'app/notes/note/note.tmpl.html'
  //        }
  //      }
  //    })
  //})
  .controller('NotesCtrl', function (NotesModel, UsersModel, CategoriesModel, $stateParams, $state) {
    var ctrl = this,
      noteId = $stateParams.noteId;

    //pass in note id from URL first
    NotesModel.setCurrentNote(noteId);

    //get note by ID and set the obj available to the scope using stateParams
    NotesModel.getNoteById(noteId).then(function (result) {
      ctrl.note = result;

    });

    //make http request for categories
    CategoriesModel.getCategories().then(function (result) {
      ctrl.categories = result;
    });


    //get categrory name based on current notecard category id
    ctrl.getcatname = CategoriesModel.getCurrentNoteCategoryName;

    //Get users
    UsersModel.getUserByNoteId(noteId).then(function (result) {
      ctrl.user = result;
    });

    function returnToNotes(){
      $state.go('notes', {
        //passs in param
        //noteId: noteId
      })
    }

    function goBack(){
      returnToNotes();
    }

    function deleteNote(note){

      ctrl.deleteNote = NotesModel.deleteBookmark;
      ctrl.deleteNote(note);
      returnToNotes();
    }
    ctrl.goBack = goBack;

    ctrl.deleted = deleteNote;

});