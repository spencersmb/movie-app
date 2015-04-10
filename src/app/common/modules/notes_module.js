angular.module('MovieApp.models.notes', [

])
  .service('NotesModel', function ($http, $q) {

    //TODO make notes
    var request = $http({
      url : 'http://data.tmsapi.com/v1.1/celebs/154505',
      method : 'GET',
      params : {'imageSize' : 'md','api_key':'ew825g4medr9bpfy7reqzd5t' }
    });

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
        //FETCH: 'http://data.tmsapi.com/v1.1/movies/10679969/versions?imageSize=Md&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t'
        first: 'http://data.tmsapi.com/v1.1/movies/',
        last:'/versions?imageSize=Md&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t'
      },
      URL_Photos = {
        //FETCH: 'http://data.tmsapi.com/v1.1/movies/10679969/versions?imageSize=Md&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t'
        first: 'http://data.tmsapi.com/v1.1/celebs/',
        last:'?imageSize=Md&api_key=ew825g4medr9bpfy7reqzd5t'
      },
      notes,
      photos = [],
      photo = [],
      currentActors,
      currentMovie,
      actorId = [],
      myPhoto,
      currentNote;

    //before we send data to ctrl - we extract it here
    function extract(result) {
      return result.data
    }

    function getnew(result){
      //console.log(result);
      myPhoto = extract(result);
      //console.log('myphoto');
      //console.log(myPhoto);
      return myPhoto;
    }

    function cacheActors(result){
      currentActors = extract(result);
      currentActors = currentActors.pop();
      //console.log(currentActors);
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

    function extractArray(result){
      var newResult=[];
      angular.forEach(result, function(obj){
        newResult.push(obj.data);
      });
      return newResult;
    }
    function cachePhotos(result) {
      photo = extractArray(result);

      var newArr=[];

      angular.forEach(photo, function(obj){

        var object ={};
        object.image = obj.preferredImage.uri;
        object.name = obj.name.first + " " + obj.name.last;
        _.find(obj.credits, function(c){
          if(c.rootId === currentMovieId){

            if(c.characterName){
              //console.log(c.characterName);
              object.characterName = c.characterName;
            }
          }
        });
        newArr.push(object);
      });

      //console.log(newArr);


      //write new function inside here that extracts the photo+name+name of who they play in a new seperate object.
      //console.log(photo);
      return newArr;
    }

    model.getNotes = function(){
      return (notes) ? $q.when(notes) : $http.get(URL_Notes.FETCH).then(cacheNotes);
    };

    model.getMyPhotos = function(result){
//return result;
      var tmp = [];
      var deferred = $q.defer();

      angular.forEach(result, function(actorId){

        //return tmp.push(actorId);
        tmp.push($http.get(URL_Photos.first + actorId + URL_Photos.last).success(function(a){
          return deferred.resolve(a);
        }));

      });
      //console.log(tmp);
      return $q.all(tmp).then(cachePhotos);

    };

    model.getActors = function(movieId){
      //console.log('reset'+ currentActors);
      //console.log(currentMovie);

      //console.log(URL_Actors.first + currentMovieId + URL_Actors.last );
      return  $http.get(URL_Actors.first + movieId + URL_Actors.last).then(cacheActors);
    };

    model.getNew = function(){
      return request.then(getnew);
    };

    //2nd function that takes in the current ID from URL and runs the fetch to get the movieDetails from the json file that matches the ID in the url
    model.setCurrentMovie = function(movieId){
      //console.log('movie Id from mod' + movieId);
      //passing noteID success
      return model.getMovieById(movieId).then(function (movie) {
        //console.log(movie);
        currentMovie = movie;
        currentMovieId = movie.rootId;

        //model.getCurrentActorsId(movieId);

      })
    };

    model.getCurrentNoteTitle = function () {
      return currentNote ? currentNote.title : ''
    };



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

        //currentMovie=[];

        model.getNotes().then(function (result) {
          deferred.resolve(findId());
        })
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
    model.reset = function(){
      actorId=[];
    };

    model.getCurrentActorsId = function(movieId){
      //console.log(movieId);

      var deferred = $q.defer();

      function findActorId() {

        //console.log(currentMovie);
        //console.log(currentActors.cast);
       angular.forEach(currentMovie.topCast, function(topCast){
       console.log(topCast);

           _.find(currentActors.cast, function(cast){
             //console.log(cast);
             //console.log(c);
             if(topCast == cast.name){
               actorId.push(cast.personId);
             }
           });

       });
      //console.log(actorId);
      return actorId;
      }

      //if it exists just loop over it and resolve the promise with that value
      if(currentMovie && currentActors ){
        //console.log('exist');
        //currentActors = [];
        //currentMovie= [];
        model.getActors(movieId).then(function (result) {
          deferred.resolve(findActorId());
        })

      } else {
        //console.log(currentMovieId);

        //console.log('else');
        //if it doesnt make a call to the server then loop over it and return the promise
        model.setCurrentMovie(movieId).then(function (result) {
          model.getActors(movieId).then(function (result) {
            deferred.resolve(findActorId());
          })
        })
      }


      return deferred.promise;
    };

    model.getActorsPics = function(){

    };

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