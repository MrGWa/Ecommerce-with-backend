from django.urls import path
from core.views import index, product_list_view, category_product_list_view,customer_dashboard, vendor_list_view, product_detail_view, tag_list, ajax_add_review, search_view, cart_view, add_to_cart, delete_item_from_cart, update_cart_quantity, checkout_view

app_name = 'core'

urlpatterns = [
    path("", index, name="index"),
    path("shop/", product_list_view, name="shop"),
    path("product/<pid>/", product_detail_view, name="product-detail"),
    path("shop/<cid>", category_product_list_view, name="category-product-list"),

    #Vendor
    path("vendors/", vendor_list_view, name="vendor-list"),

    #Tags
    path("tag/<slug:tag_slug>/", tag_list, name="tag"),

    #Add Review
    path("ajax-add-review/<int:pid>/", ajax_add_review, name="ajax-add-review"),

    #Search
    path("search/", search_view, name="search"),

    #cart
    path("add-to-cart/", add_to_cart, name="add-to-cart"),
    #cart page
    path("cart/", cart_view, name="cart"),
    #delete item from cart
    path("update-cart/", delete_item_from_cart, name="update-cart"),
    #update cart quantity
    path('update-cart-quantity/', update_cart_quantity, name='update-cart-quantity'),

    #checkout Page
    path('checkout/', checkout_view, name='checkout'),

    #Dashboard
    path('dashboard/', customer_dashboard, name='dashboard'),



]
