from core.models import Product, Category, Vendor, CartOrder, CartOrderItems, ProductImages, ProductReview, wishlist, Address, Tags
 

def default(request):
        Categories = Category.objects.all()
        return {
            'categories': Categories,
        }
    