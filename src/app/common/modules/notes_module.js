angular.module('MovieApp.models.notes', [

])
  .service('NotesModel', function ($http, $q) {

    //Set date
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

    if( day < 10 ){
      day = '0'+day;
    }

    if( month < 10 ){
      month = '0'+ month;
    }

    var fullDate = year + '-' + month + '-' + day;

    //theater options
    var currentMovieId = '';
    var theaterAvalon = 10991;
    var urlFront = 'http://data.tmsapi.com/v1.1/theatres/';
    var movieActorApi = 'http://data.tmsapi.com/v1.1/movies/';
    var showingsDate = '/showings?startDate='+fullDate;
    var urlEnd = '&imageSize=Lg&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t';
    var urlEndActor = '/versions?imageSize=Md&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t';
    var model = this,
      URL_Notes = {
        //FETCH: 'http://data.tmsapi.com/v1.1/theatres/10991/showings?startDate=2015-04-07&imageSize=Lg&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t'
        FETCH: urlFront + theaterAvalon + showingsDate + urlEnd
      },
      URL_Actors = {
        FETCH: 'http://data.tmsapi.com/v1.1/movies/10679969/versions?imageSize=Md&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t'
        //FETCH: movieActorApi + currentMovieId + urlEndActor
      },
      notes,
      currentActors,
      currentMovie,
      actorId = [],
      currentNote;

    //before we send data to ctrl - we extract it here
    function extract(result) {
      return result.data
    }

    function cacheActors(result){
      currentActors = extract(result);
      currentActors = currentActors.pop();
      console.log(currentActors);
      return currentActors;
    }

    function cacheNotes(result) {

      notes = extract(result);
      angular.forEach(notes, function(note){
        var date = note.releaseDate;
        date =_.without(date, '2015');
        //console.log(date);
        var newDate = date.slice(5);
        var join = newDate.join("");
        //console.log(join);
        note.releaseDate = join;
        return note;
      });
      return notes;
    }

    model.getNotes = function(){
      return (notes) ? $q.when(notes) : $http.get(URL_Notes.FETCH).then(cacheNotes);
    };


    model.getActors = function(){
      return (currentActors) ? $q.when(currentActors) : $http.get(URL_Actors.FETCH).then(cacheActors);
    };

    //2nd function that takes in the current ID from URL and runs the fetch to get the movieDetails from the json file that matches the ID in the url
    model.setCurrentMovie = function(movieId){
      //console.log('movie Id from mod' + movieId);
      //passing noteID success
      return model.getMovieById(movieId).then(function (movie) {
        //console.log(movieDetails);
        currentMovie = movie;
        currentMovieId = currentMovie.rootId;

      })
    };

    model.getCurrentNoteTitle = function () {
      return currentNote ? currentNote.title : ''
    };

    //model.getCurrentActors = function () {
    //  return currentMovie ? currentMovie.topCast : ''
    //};


    //3rd run the promise for notes
    model.getMovieByTitle = function (movieTitle) {
      //console.log(movieTitle);

      //create a deferred object
      var deferred = $q.defer();

      function findId() {
        //finds a match if one exists when we call getCategoryByName
        return _.find(notes, function (c) {

          //console.log(c.rootId == movieTitle);
          return c.title == movieTitle;
        })
      }


      //if it exists just loop over it and resolve the promise with that value
      if(notes){

        deferred.resolve(findId());
      } else {
        //console.log('else');
        //if it doesnt make a call to the server then loop over it and return the promise
        model.getNotes().then(function (result) {
          deferred.resolve(findId());
        })
      }

      //then return that with a promise
      //console.log('promise' + deferred.promise);
      return deferred.promise;
    };

    model.getMovieById = function (movieId) {
      //console.log(movieTitle);

      //create a deferred object
      var deferred = $q.defer();

      function findId() {
        //finds a match if one exists when we call getCategoryByName
        return _.find(notes, function (c) {

          //console.log(c.rootId == movieTitle);
          return c.rootId == movieId;
        })
      }


      //if it exists just loop over it and resolve the promise with that value
      if(notes){

        deferred.resolve(findId());
      } else {
        //console.log('else');
        //if it doesnt make a call to the server then loop over it and return the promise
        model.getNotes().then(function (result) {
          deferred.resolve(findId());
        })
      }

      //then return that with a promise
      //console.log('promise' + deferred.promise);
      return deferred.promise;
    };


    model.getCurrentActorsId = function(rootId){

      var deferred = $q.defer();

      function findActorId() {
        angular.forEach(currentActors.cast, function(actor){
          //console.log(actor);
          _.find(currentMovie.topCast, function(currentActor){
            if(currentActor == actor.name){
              actorId.push(actor.nameId);
            }
          });
        });

       //console.log(currentMovie);
       //angular.forEach(currentMovie.topCast, function(c){
       //
       //   angular.forEach(currentActors.cast, function(actor){
       //     console.log(actor);
       //     //_.find(actor.cast, function(a){
       //     //  console.log(c);
       //     //});
       //   });
       //})
      return actorId;
      }

      //if it exists just loop over it and resolve the promise with that value
      if(currentMovie ){
        //console.log('exist');
        deferred.resolve(findActorId());

      } else {

        //console.log('else');
        //if it doesnt make a call to the server then loop over it and return the promise
        model.getActors().then(function (result) {
          deferred.resolve(findActorId());
        })
      }

      //Figureout how to call get actors after current movie is set
      



      //version A
      //model.getActors();
      //console.log(currentMovie);
      //if(currentMovie){
      //
      //
      //  //working A
      //  //angular.forEach(currentActors, function(actor){
      //  //  angular.forEach(actor.cast, function(cast){
      //  //    _.find(currentMovie.topCast, function(c){
      //  //      //console.log(c);
      //  //      console.log(c === cast.name);
      //  //      if(c === cast.name){
      //  //        actorId.push(cast.nameId);
      //  //
      //  //      }
      //  //    });
      //  //  });
      //  //
      //  //
      //  //})
      //}else{
      //  console.log('no luck');
      //}
      //console.log(actorId);
      ////remove dups
    };

    model.getActorsPics = function(){

    };

    //model.updateNote = function (note) {
    //  //this simulates backend memory function
    //  //we are editing this object in memory.
    //
    //  var index = _.findIndex(notes, function (n) {
    //    //return the object index number that matches
    //    return n.id == note.id;
    //  });
    //
    //  //now get the current bookmark with index and replace with new object
    //  notes[index] = note;
    //};
    //
    //model.deleteBookmark = function(note){
    //
    //  //this may simulate backend api function
    //  //find a match for the movieDetails and the notes array
    //  var filterId =_.filter(notes,function (n) {
    //
    //    return n.id === note.id;
    //  });
    //
    //  //if true get index, then splice the array
    //  if(filterId){
    //    var index = _.indexOf(notes, note);
    //    //splice works off of the position index in-case you're working from 0 indexed array
    //    notes.splice(index, 1);
    //  }
    //};
    //
    ////Create New movieDetails - step 1
    //model.createNote = function (note) {
    //  //console.log('movieDetails ' + movieDetails);
    //
    //  //adding plus one because the array length replaces the last movieDetails, not add to it
    //  note.id = notes.length + 1;
    //  console.log(note.id);
    //  notes.push(note);
    //  //console.log('notes '+notes.length);
    //  //console.log(notes);
    //};

    model.releaseDates = function(object){
        var date = object;
        date =_.without(object, '2015');
        //console.log(date);
        var newDate = object.slice(5);
        //var join = newDate.join("");
        //console.log(newDate);
        return newDate;
    };

    model.options = [
      //{label: 'Alphabetical', value: 'title'},
      {label: 'Alphabetical', value: 'title'},
      {label: 'Newest Movies', value: '-releaseDate'}
    ];


});