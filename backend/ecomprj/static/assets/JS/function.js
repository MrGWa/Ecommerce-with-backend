$(document).ready(function() {
    // --------------------ADDING REVIEWS--------------------------
    $("#commentForm").submit(function (e) {
        e.preventDefault();
        $.ajax({
            data: $(this).serialize(),

            method: $(this).attr("method"),

            url: $(this).attr("action"),

            dataType: "json",

            success: function (res) {
                console.log("Comment Saved to DB...");
                if (res.bool == true) {
                    $("#review-res").html("Review added successfully.")

                    let _html =   '<div class="review__single">'
                         _html +='<div>'
                         _html +=  '<div class="review__img"><i class="fi fi-ts-circle-user"></i></div>'
                         _html +=  '<h4 class="review__title">' + res.context.user + '</h4>'
                         _html +=  '</div>'
                  
                         _html += '<div class="review__data">'
                         _html +=  '<div class="review__rating">'
                         for (var i = 1; i <= res.context.rating; i++) {
                         _html +=  '<i class="fi fi-rs-star" style="position: grid;"></i>'
                         }
                         _html +=  '</div>'
                      
                         _html +=  '<p class="review__description">'+ res.context.review + '</p>'

                          _html += '<span class="review__date">' + time + '</span>'
                          _html += '</div>'
                          _html += ' </div>'

                          $(".rewiews__container grid").prepend(_html)

                 }
             }
            })
            });

    // -------------------- ADD TO CART FUNCTIONALITY--------------------------
    $(document).on("click", "#add-to-cart-btn", function(e) {
        e.preventDefault();
        
        let this_val = $(this);
        let quantity = $("#product-quantity").val() || 1;
        let product_id = $(this).data("product-id");
        let product_title = $(this).data("product-title");
        let product_price = $(this).data("product-price");
        let csrftoken = $("input[name=csrfmiddlewaretoken]").val();

        console.log("Button clicked!");
        console.log("Quantity:", quantity);
        console.log("Title:", product_title);
        console.log("Price:", product_price);
        console.log("ID:", product_id);
        console.log("CSRF Token:", csrftoken);

        if (!product_id) {
            console.error("Product ID not found!");
            return;
        }

        if (!csrftoken) {
            console.error("CSRF token not found!");
            return;
        }

        $.ajax({
            url: '/add-to-cart/',  
            method: 'POST',
            data: {
                'id': product_id,
                'qty': quantity,
                'title': product_title,
                'price': product_price,
                'csrfmiddlewaretoken': csrftoken
            },
            headers: {
                'X-CSRFToken': csrftoken
            },
            dataType: 'json',
            beforeSend: function () {
                console.log("Adding Product to Cart...");
                this_val.prop('disabled', true);
            },
            success: function(res) {
                console.log("Server Response:", res);
                this_val.html("Item Added to Cart");
                if (res.totalcartitems) {
                    $(".cart-items-count").text(res.totalcartitems);
                }
                this_val.prop('disabled', false);
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                console.error("Status:", status);
                console.error("Response Text:", xhr.responseText);
                console.error("Status Code:", xhr.status);
                this_val.html("Error Adding to Cart");
                this_val.prop('disabled', false);
            }
        });
    });
});