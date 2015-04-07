angular.module('MovieApp.models.notes', [

])
  .service('NotesModel', function ($http, $q) {
    var model = this,
      URL_Notes = {
        FETCH: 'http://data.tmsapi.com/v1.1/theatres/10991/showings?startDate=2015-04-06&imageSize=Lg&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t'
      },
      notes,
      currentNote;


    //before we send data to ctrl - we extract it here
    function extract(result) {
      return result.data
    }

    function cacheNotes(result) {
      //console.log(result);
      notes = extract(result);
      return notes;
    }

    model.getNotes = function(){
      return (notes) ? $q.when(notes) : $http.get(URL_Notes.FETCH).then(cacheNotes);
    };

    //2nd function that takes in the current ID from URL and runs the fetch to get the note from the json file that matches the ID in the url
    model.setCurrentNote = function(noteId){
      //console.log(noteId);
      //passing noteID success
      return model.getNoteById(noteId).then(function (note) {
        //console.log(note);
        currentNote = note;
      })
    };

    model.getCurrentNoteTitle = function () {
      return currentNote ? currentNote.title : ''
    };


    //3rd run the promise for notes
    model.getNoteById = function (noteId) {
      //create a deferred object
      var deferred = $q.defer();

      function findId() {
        //finds a match if one exists when we call getCategoryByName
        return _.find(notes, function (c) {
          //console.log(c.id == noteId); - true
          return c.id == noteId;
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


    model.updateNote = function (note) {
      //this simulates backend memory function
      //we are editing this object in memory.

      var index = _.findIndex(notes, function (n) {
        //return the object index number that matches
        return n.id == note.id;
      });

      //now get the current bookmark with index and replace with new object
      notes[index] = note;
    };

    model.deleteBookmark = function(note){

      //this may simulate backend api function
      //find a match for the note and the notes array
      var filterId =_.filter(notes,function (n) {

        return n.id === note.id;
      });

      //if true get index, then splice the array
      if(filterId){
        var index = _.indexOf(notes, note);
        //splice works off of the position index in-case you're working from 0 indexed array
        notes.splice(index, 1);
      }
    };

    //Create New note - step 1
    model.createNote = function (note) {
      //console.log('note ' + note);

      //adding plus one because the array length replaces the last note, not add to it
      note.id = notes.length + 1;
      console.log(note.id);
      notes.push(note);
      //console.log('notes '+notes.length);
      //console.log(notes);
    };

});