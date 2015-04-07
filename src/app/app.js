//MAIN APP FILE
angular.module('MovieApp', [
  'ui.router',
  'MovieApp.models.notes',
  'MovieApp.models.users',
  'MovieApp.models.categories'
])
.config(function($stateProvider, $urlRouterProvider) {
  //  $stateProvider
  //    .state('notewrangler', {
  //      url: '', //dont usee / in the url for main index
  //      abstract: true
  //      //templateUrl: 'app/categories/categories.tmpl.html',
  //      //controller: 'MainCtrl'
  //    });
  //
  //  $urlRouterProvider.otherwise('/')
  //})
  //Alternate state where all the views are in the same view
    $urlRouterProvider.otherwise('/movies');
    $stateProvider
      //.state('notewrangler',{
      //  url:'',
      //  //templateUrl:'app/notes/notes.tmpl.html'
      //  abstract:true
      //});
      .state('movies',{
        url:'/movies',
        templateUrl:'app/notes/notes.tmpl.html',
        controller: 'NotesListCtrl',
        controllerAs:'ctrl'
      })
      .state('note',{
        url:'/movies/:noteId',
        templateUrl:'app/notes/note/note.tmpl.html',
        controller:'NotesCtrl',
        controllerAs: 'ctrl'
      })
      .state('edit',{
        url:'/notes/:noteId/edit',
        templateUrl:'app/notes/note/edit/edit.tmpl.html',
        controller:'NotesEditCtrl',
        controllerAs: 'ctrl'
      })
      .state('create',{
        url:'/notes/create',
        templateUrl:'app/notes/note/create/create.tmpl.html',
        controller:'NotesCreateCtrl',
        controllerAs: 'ctrl'
      })
      .state('users',{
        url:'/users',
        templateUrl:'app/users/users.tmpl.html',
        controller:'UsersListCtrl',
        controllerAs: 'ctrl'
      })
      .state('user-detail',{
        url:'/users/:userName',
        templateUrl:'app/users/userDetails/userDetails.tmpl.html',
        controller:'UserDetailsCtrl',
        controllerAs: 'ctrl'
      });
      //.state('edit',{
      //  url:'/notes/:noteId/edit',
      //  views:{
      //    'editView@': {
      //      templateUrl:'app/notes/note/edit/edit.tmpl.html',
      //      controller:'NotesEditCtrl',
      //      controllerAs: 'ctrl'
      //    }
      //  }
      //
      //});
  })
  //.run(function ($rootScope, $state) {
  //  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
  //    event.preventDefault();
  //    if (error === 'AUTH_REQUIRED') {
  //      $state.go('login');
  //    }
  //  });
  //})
;