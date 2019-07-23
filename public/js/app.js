$(function() {
  $(document).on("click", "#jqueryBtn", function(event) {
    
    $(this).hide("slow");

    $.get("/api/scrape", function(data) {
      console.log(data.data);
      if (data.status) window.location.href = "/articles"
    })
    
  })

  $(document).on("click", ".modal-close", function(event) {
    $("#insertNotes").empty();
    $("#newNote").empty();

    $("#addNotesModal").hide();
    $("#allNotesModal").hide();
    $(".modal-overlay").hide();
  })

  $(document).on("click", ".allNotes", function(event) {
    var id = $(this).attr("data-article-id");
    console.log(id);
    
    $.get("/articles/" + id, function(data) {
      console.log(data);
      if (!data.notes.length) {
        $("#insertNotes").append(
          `<p>No notes to display. Consider adding a note!<p>`
        )
      }
      for (eachNote in data.notes) {
        $("#insertNotes").append(
          `<h4>${eachNote.title}<h4>
          <p>${eachNote.body}<p>`
        )
      }
      $("#allNotesModal").show();
      $(".modal-overlay").show();
  
    }) 
  })

  
  $(document).on("click", ".addNotes", function(event) {
    var id = $(this).attr("data-article-id");
    var title = $(this).attr("data-article-title");
    console.log(id);
    
    $("#addNotesModal").show();
    $(".modal-overlay").show();

    console.log("1");
      
    $(document).on("click", "#newNoteSubmit", function(event) {
      var body = $("#newNote").val().trim();
      console.log("2", title, body);
      if (title && body) {
        console.log("3", title, body);

        $.post("/articles/" + id, {
          title: title,
          body: body
        }, function(data) {
          console.log("4");

          console.log("FINAL DATA", data);
          $(".modal-close").click();
        }) 
        
      }
    })

  })


  
  $(document).on("click", ".saveNotes", function(event) {
    var id = $(this).attr("data-id");
    console.log(id);
    
  })

});

