from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from core.models import Product, Category, Vendor, CartOrder, CartOrderItems, ProductImages, ProductReview, wishlist, Address, Tags
from taggit.models import Tag
from core.forms import ProductReviewForm
from django.db.models import Avg

# Create your views here.
def index(request):
    #products = Product.objects.all()
    products = Product.objects.filter(featured=True, product_status="published")

    context = {
        'products': products
    }
    return render(request, 'core/index.html', context)


def product_list_view(request):
    products = Product.objects.filter(product_status="published", in_stock=True)

    context = {
        'products': products
    }
    return render(request, 'core/shop.html', context)


def category_product_list_view(request, cid):
    category = Category.objects.get(cid=cid)
    products = Product.objects.filter(category=category, product_status="published", in_stock=True)

    context = {
        "category": category,
        "products": products,
    }

    return render(request, 'core/category-product-list.html', context)

def vendor_list_view(request):
    vendors = Vendor.objects.all()

    context = {
        'vendors': vendors,
    }
    return render(request, 'core/vendor-list.html', context)


def product_detail_view(request, pid):
    #product = Product.objects.get(pid=pid)
    product = get_object_or_404(Product, pid=pid)

    #Getting reviews
    reviews = ProductReview.objects.filter(product=product).order_by("-date")

    #Product Review Form
    review_form = ProductReviewForm()

    p_image = product.p_image.all()

    context = {
        "product": product,
        "p_image": p_image,
        'reviews': reviews,
        'review_form': review_form,
    }

    return render(request, 'core/product-detail.html', context)


def tag_list(request, tag_slug=None):
    products = Product.objects.filter(product_status="published", in_stock=True).order_by("-id")
    tag = None
    if tag_slug:
        try:
            tag = Tags.objects.get(name=tag_slug)
            products = products.filter(tags__in=[tag])
        except Tags.DoesNotExist:
            tag = None
            products = []

    context = {
        "products": products,
        "tag": tag,
    }

    return render(request, 'core/tag.html', context)

def ajex_add_review(request, pid):
    product= Product.objects.get(pid=pid)
    user = request.user

    review = ProductReview.objects.create(
        user=user,
        product=product,
        review=request.POST.get('review'),
        rating=request.POST.get('rating'),
    )

    context = {
        'user':user.username,
        'review':request.POST['review'],
        'rating':request.POST['rating'],
    }

    avarage_review = ProductReview.objects.filter(product=product).aggregate(rating=Avg('rating'))

    return JsonResponse({
        'bool': True,
        'context': context,
        'avarage_review': avarage_review,
    })
