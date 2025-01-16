from django.urls import path
from core.views import index, product_list_view, category_product_list_view, vendor_list_view, product_detail_view, tag_list, ajex_add_review

app_name = 'core'

urlpatterns = [
    path("", index, name="index"),
    path("shop/", product_list_view, name="shop"),
    path("product/<pid>/", product_detail_view, name="product-detail"),
    path("shop/<cid>", category_product_list_view, name="category-product-list"),

    #Vendor
    path("vendors/", vendor_list_view, name="vendor-list"),

    #Tags
    path('product/tag/<slug:tag_slug>/', tag_list, name='tag'),

    #Add Review
    path("ajex-add-review/<int:pid>/", ajex_add_review, name="ajex-add-review"),

]
