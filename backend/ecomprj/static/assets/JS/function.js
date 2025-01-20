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
    $(document).on("click", "#add-to-cart-btn, .add-to-cart-btn", function(e) {
        e.preventDefault();
        
        let this_val = $(this);
        let index = this_val.attr("data-index");
        let isDetailPage = this_val.attr("id") === "add-to-cart-btn";
        
        let quantity, product_title, product_id, product_price, product_pid, product_image;
        
        if (isDetailPage) {
            // Product detail page - use IDs
            quantity = $("#product-quantity").val() || 1;
            product_title = $("#product-title").val();
            product_id = $("#product-id").val();
            product_price = $("#product-price").val();
            product_pid = $("#product-pid").val();
            product_image = $("#product-image").val();
        } else {
            // Index page - use data attributes
            quantity = 1;
            product_id = this_val.attr("data-id");
            product_title = this_val.attr("data-title");
            product_price = this_val.attr("data-price");
            product_pid = this_val.attr("data-pid");
            product_image = this_val.attr("data-image");
        }
        
        let csrftoken = $("input[name=csrfmiddlewaretoken]").val();

        console.log("Button clicked!");
        console.log("Index:", index);
        console.log("Quantity:", quantity);
        console.log("Title:", product_title);
        console.log("Price:", product_price);
        console.log("ID:", product_id);
        console.log("CSRF Token:", csrftoken);
        console.log("PID:", product_pid);
        console.log("Image:", product_image);

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
                'pid': product_pid,
                'image': product_image,
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
                this_val.prop('disabled', false);
            }
        });
    });

    // Update the delete product handler to use event delegation
    $(document).on("click", ".delete-product", function (e) {
        e.preventDefault();
        let product_id = $(this).attr("data-product");
        let this_val = $(this);

        console.log("Delete button clicked!");
        console.log("Product ID to delete:", product_id);

        let csrftoken = $("[name=csrfmiddlewaretoken]").val();
        console.log("CSRF Token:", csrftoken);
        
        $.ajax({
            url: '/update-cart/',
            method: "POST",
            data: {
                "id": product_id,
                'csrfmiddlewaretoken': csrftoken,
            },
            beforeSend: function() {
                console.log("Sending delete request...");
            },
            success: function (response) {
                console.log("Delete response received:", response);
                if (response.data) {
                    $("#cart-list").html(response.data);
                    $(".cart-items-count").text(response.totalcartitems);
                }
            },
            error: function(xhr, errmsg, err) {
                console.log("Error deleting item:");
                console.log("Status:", xhr.status);
                console.log("Error:", err);
                console.log("Response:", xhr.responseText);
            }
        });
    });

    // Handle quantity changes in cart
    $(document).on('change', '.quantity', function() {
        let quantity = $(this).val();
        let productRow = $(this).closest('tr');
        let productId = productRow.find('.delete-product').data('product');
        let csrftoken = $("input[name=csrfmiddlewaretoken]").val();

        if (quantity < 1) {
            quantity = 1;
            $(this).val(1);
        }

        $.ajax({
            url: '/update-cart-quantity/',
            method: 'POST',
            data: {
                'id': productId,
                'quantity': quantity,
                'csrfmiddlewaretoken': csrftoken
            },
            success: function(response) {
                if (response.success) {
                    // Update the subtotal display
                    productRow.find('.table__subtotal').text('$' + response.subtotal.toFixed(2));
                }
            },
            error: function(xhr, errmsg, err) {
                console.log('Error updating cart quantity:', errmsg);
            }
        });
    });

});