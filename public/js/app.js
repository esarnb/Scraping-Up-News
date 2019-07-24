$(function() {
  $(".progress").hide();

  var insertNotes = $("#insertNotes");
  var addNotesModal = $("#addNotesModal");
  var allNotesModal = $("#allNotesModal");
  var modalOverlay = $(".modal-overlay");

  //Scrape all articles then redirect to the articles list
  $(document).on("click", "#jqueryBtn", function(event) {
    $(this).hide("slow");
    $(".progress").show();

    $.get("/api/scrape", function(data) {
      $(".progress").hide();
      if (data.status) window.location.href = "/articles"
    })
    
  })

  //Close all modals and modal overlays
  $(document).on("click", ".modal-close", function(event) {
    insertNotes.empty();
    $("#newNote").empty();

    addNotesModal.hide();
    allNotesModal.hide();
    modalOverlay.hide();
  })

  
  $(document).on("click", ".allNotes", function(event) {
    var id = $(this).attr("data-article-id");

    //Get all notes from the database
    $.get(`/articles/${id}/notes`, function(data) {
      
      allNotesModal.show();
      modalOverlay.show();

      //If there are no notes, display default prompt. Else display them all with delete buttons.
      if (!data.notes || !data.notes.length) {
        insertNotes.append(`<p>No notes to display. Consider adding a note!<p>`)
      }
      else {
        console.log(data.notes);
        for (var i = 0; i < data.notes.length; i++) {
          //Dynamically generate notes with buttons, including unique ids
          insertNotes.append(`<p>${data.notes[i].body} <a type="button" class="removeNotes waves-effect waves-green btn-mini" data-article-id="${id}" data-note-id="${data.notes[i]._id}">{x}</a> <p>`)
        }
      }
    })
  })

  //Remove a specific note from the site/database
  $(document).on("click", ".removeNotes", function(event) {

    //Create variables so the button reference is saved after success function.
    var articleID =  $(this).attr("data-article-id");
    var noteID =  $(this).attr("data-note-id")
    var btn = $(this); 

    $.ajax({
      url: `/articles/${articleID}/notes/${noteID}`,
      type: 'DELETE',
      success: function(result) {
        console.log("DELETE NOTE: ", result);
          btn.parent().hide() //Hide it visually, deleted from server.
      }
    })
  })
  
  
  //syncing attributes from .addNotes to 
  //#newNoteSubmit without nesting onClicks
  var id, title; 
  
  //Open model to add a note, setting article ids up.
  $(document).on("click", ".addNotes", function(event) {
    id = $(this).attr("data-article-id");
    title = $(this).attr("data-article-title");
    addNotesModal.show();
    modalOverlay.show();
  })

  //Send a post request to create a new note.
  $("#newNoteSubmit").click(function(event) {
    var body = $("#newNote").val().trim();
    if (title && body) {
      $.post(`/articles/${id}/notes/new`, {
        title: title,
        body: body
      }, function(data) {
        $(".modal-close").click();
      }) 
    }
  })

  //Change article state between save and unsave
  $(document).on("click", ".saveNotes", function(event) {
    var id = $(this).attr("data-article-id");
    // var state = $(this).attr("data-save");
    console.log(id);
    
    $.ajax({
      url: `/articles/${id}`,
      type: 'PUT',
      success: function(result) {
        console.log(result);
        window.location.reload()
      }
    })
  })

  $(document).on("click", ".saveNotes", function(event) {
    window.location.reload()
  })

});

