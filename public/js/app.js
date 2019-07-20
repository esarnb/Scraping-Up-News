$(function() {
  $("body").append("JQuery Initialized")

  $(document).on("click", "#jqueryBtn", function(event) {
    // event.preventDefault();
    $(this).hide("slow")
  })

});

