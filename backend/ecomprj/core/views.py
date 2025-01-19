from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from core.models import Product, Category, Vendor, CartOrder, CartOrderItems, ProductImages, ProductReview, wishlist, Address, Tags
from taggit.models import Tag
from core.forms import ProductReviewForm
from django.db.models import Avg
from django.contrib import messages

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

    products = Product.objects.filter(product_status="published").order_by("-id")

    tag = None 
    if tag_slug:
        tag = get_object_or_404(Tag, slug=tag_slug)
        products = products.filter(tags__in=[tag])

    context = {
        "products": products,
        "tag": tag
    }

    return render(request, "core/tag.html", context)

def ajax_add_review(request, pid):
    product = Product.objects.get(pk=pid)
    user = request.user 

    review = ProductReview.objects.create(
        user=user,
        product=product,
        review = request.POST['review'],
        rating = request.POST['rating'],
    )

    context = {
        'user': user.username,
        'review': request.POST['review'],
        'rating': request.POST['rating'],
    }

    average_reviews = ProductReview.objects.filter(product=product).aggregate(rating=Avg("rating"))

    return JsonResponse(
       {
         'bool': True,
        'context': context,
        'average_reviews': average_reviews
       }
    )

def search_view(request):
    query = request.GET.get("q")
    products = Product.objects.filter(title__icontains=query).order_by("-date")
    context = {
        "products": products,
        "query": query,
    }
    return render(request, "core/search.html", context)

def add_to_cart(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    cart_product = {}
    cart_product[str(request.POST['id'])] = {
        'title': request.POST['title'],
        'qty': request.POST['qty'],
        'price': request.POST['price'],
    }
    
    if 'cart_data_obj' in request.session:
        if str(request.POST['id']) in request.session['cart_data_obj']:
            cart_data = request.session['cart_data_obj']
            cart_data[str(request.POST['id'])]['qty'] = int(cart_product[str(request.POST['id'])]['qty'])
            cart_data.update(cart_data)
            request.session['cart_data_obj'] = cart_data
        else:
            cart_data = request.session['cart_data_obj']
            cart_data.update(cart_product)
            request.session['cart_data_obj'] = cart_data
    else:
        request.session['cart_data_obj'] = cart_product
    
    return JsonResponse({
        "data": request.session['cart_data_obj'], 
        'totalcartitems': len(request.session['cart_data_obj'])
    })

def cart_view(request):
    cart_total_amount = 0
    if 'cart_data_obj' in request.session:
        for p_id, item in request.session['cart_data_obj'].items():
            cart_total_amount += int(item['qty']) * float(item['price'])
        return render(request, "core/cart.html", {"cart_data":request.session['cart_data_obj'], 'totalcartitems': len(request.session['cart_data_obj']), 'cart_total_amount':cart_total_amount})
    else:
        messages.warning(request, "Your cart is empty")
        return redirect("core:index")
    





