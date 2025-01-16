// --------------------ADDING REVIEWS--------------------------
$("#commentForm").submit(function (event) {
    event.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
        data: $(this).serialize(),
        method: $(this).attr('method'),
        url: $(this).attr('action'),
        
        dataType: 'json',

        success: function (response) {
            console.log("comment added");
            
        }})});