
'use strict';

angular.module('MovieApp')
  //.config(function ($stateProvider) {
  //  $stateProvider
  //    .state('notewrangler.movies', {
  //      url: '/',
  //      views: {
  //        'mainView@': {
  //          controller: 'NotesListCtrl as ctrl',
  //          templateUrl: 'app/movies/movies.tmpl.html'
  //        }
  //      }
  //    })
  //})
  .controller('MoviesListCtrl', function (MoviesModel) {
    var ctrl = this;

    //get dynamic id for theater and pass to URL
    ctrl.theaterID = angular.element( "body").data('theater');

    ctrl.URL_DYN = MoviesModel.URL_DYN;

    ctrl.URL_DYN(ctrl.theaterID);

    //rename movies to movies
    MoviesModel.getMovies(ctrl.URL_DYN(ctrl.theaterID)).then(function (result) {
      ctrl.movies = result;
      console.log(result);
      // var img = angular.element( "body");
      
    });

    //Select Drop down
    ctrl.options = MoviesModel.options;

    //make dropdown start with alphabetical
    ctrl.descending = MoviesModel.options[0];

    //function to make release dates into sortable numbers
    ctrl.releaseDates =  MoviesModel.releaseDates;


  });

