
'use strict';

angular.module('MovieApp')
  //.config(function ($stateProvider) {
  //  $stateProvider
  //    .state('notewrangler.notes', {
  //      url: '/',
  //      views: {
  //        'mainView@': {
  //          controller: 'NotesListCtrl as ctrl',
  //          templateUrl: 'app/notes/notes.tmpl.html'
  //        }
  //      }
  //    })
  //})
  .controller('NotesListCtrl', function (NotesModel) {
    var ctrl = this;

    NotesModel.getNotes().then(function (result) {
    ctrl.notes = result;
      console.log(result)
    });

    ctrl.time = function(dateTime){
      //console.log(dateTime);
      var split = dateTime.split('');
      var removePt =_.without(split, 'P','T','M');
      //console.log(removePt);
      removePt.shift();
      //console.log(removePt);
      removePt[1] = 'hr';
      removePt.push('min');
      var comma = removePt.join("");
      //comma.replace('H', 'Hours');
      return comma;
    };

  });

