$(function() {
  $(document).on("click", "#jqueryBtn", function(event) {
    
    $(this).hide("slow");

    $.get("/api/scrape", function(data) {
      console.log(data.data);
      if (data.status) window.location.href = "/articles"
    })
    
  })

  $(document).on("click", ".allNotes", function(event) {

  })

  
  $(document).on("click", ".addNotes", function(event) {
    
  })
});

