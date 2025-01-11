from django.db import models
from shortuuid.django_fields import ShortUUIDField
from django.utils.html import mark_safe
from userauths.models import User


STATUS_CHOICE = (
    ("processing", "Processing"),
    ("shipped", "Shipped"),
    ("delivered", "Delivered"),
)

STATUS = (
    ("draft", "Draft"),
    ("disabled", "Disabled"),
    ("in_review", "In Review"),
    ("rejected", "Rejected"),
    ("published", "Published"),
    
)

RATING = (
    (1, "★☆☆☆☆"),
    (2, "★★☆☆☆"),
    (3, "★★★☆☆"),
    (4, "★★★★☆"),
    (5, "★★★★★"),
    
)



def user_directory_path(instance, filename):
    return 'user_{0}/{1}'.format(instance.user.id, filename)

class Category(models.Model):
    cid = ShortUUIDField(unique = True, length=10, max_length=20, prefix = 'cat', alphabet = 'abcdefghijklmnop1234567890')
    title = models.CharField(max_length = 100)
    image = models.ImageField(upload_to = "category")

    class Meta:
        verbose_name_plural = "Categories"

    
    def category_image(self):
        return mark_safe('<img src ="%s" width ="50" height = "50" />' %(self.image.url))
    
    def __str__(self):
        return self.title
    
class Tags(models.Model):
    tid = ShortUUIDField(unique=True, length=10, max_length=20, prefix="tag", alphabet="abcdefghijklmnop1234567890")
    name = models.CharField(max_length=100, unique=True, default="Default Tag")

    class Meta:
        verbose_name_plural = "Tags"

    def __str__(self):
        return self.name


class Vendor(models.Model):
    vid = ShortUUIDField(unique = True, length = 10, max_length=20, prefix = 'cat', alphabet = 'abcdefghijklmnop1234567890')
    title = models.CharField(max_length = 100)
    image = models.ImageField(upload_to = user_directory_path)
    description = models.TextField(null = True, blank = True)

    address = models.CharField(max_length = 100, default = '123')
    address = models.CharField(max_length = 100, default = '+123')
    chat_resp_time = models.CharField(max_length = 100, default = '0')
    shipping_on_time = models.CharField(max_length = 100, default = '0')
    authentic_rating = models.CharField(max_length = 100, default = '0')
    days_return = models.CharField(max_length = 100, default = '0')
    warranty_period = models.CharField(max_length = 100, default = '0')

    user = models.ForeignKey(User, on_delete= models.CASCADE) #when user is deleted, shop is deleted as well

    class Meta:
        verbose_name_plural = "Vendors"

    
    def vendor_image(self):
        return mark_safe('<img src ="%s" width ="50" height = "50" />' %(self.image.url))
    
    def __str__(self):
        return self.title

class Product(models.Model):
    pid = ShortUUIDField(unique = True, length = 10, max_length=20, alphabet = 'abcdefghijklmnop1234567890')

    user = models.ForeignKey(User, on_delete= models.SET_NULL, null = True, related_name="user")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')

    title = models.CharField(max_length = 100)
    image = models.ImageField(upload_to = "category")
    description = models.TextField(null = True, blank = True, default="MODEL")

    price = models.DecimalField(max_digits= 30000000000, decimal_places=2)
    old_price = models.DecimalField(max_digits= 30000000000, decimal_places=2)

    specifications = models.TextField(null = True, blank = True)
    tags = models.ForeignKey(Tags, on_delete=models.SET_NULL, null=True, related_name="products", default=1)

    product_status = models.CharField(choices=STATUS, max_length=10, default="in_review")

    status = models.BooleanField(default=True)
    in_stock = models.BooleanField(default= True)
    featured = models.BooleanField(default= False)

    sku = ShortUUIDField(unique = True, length = 4, max_length=10, prefix = "sku",alphabet = '1234567890')

    date = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(null=True, blank=True)



    class Meta:
        verbose_name_plural = "Products"

    
    def product_image(self):
        return mark_safe('<img src ="%s" width ="50" height = "50" />' %(self.image.url))
    
    def __str__(self):
        return self.title
    
    def get_precentage(self):
        new_price = (self.price / self.old_price) * 100
        return new_price
    
class ProductImages(models.Model):
    images = models.ImageField(upload_to="products-images")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add= True)

    class Meta:
        verbose_name_plural = "Product Images"

#------------------------------------------------Cart, Order, OrderItems and address-----------------------------------------------#



class CartOrder(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE)
    price = models.DecimalField(max_digits= 30000000000, decimal_places=2)
    paid_status = models.BooleanField (default=False)
    order_date = models.DateTimeField(auto_now_add= True)
    product_status = models.CharField(choices=STATUS_CHOICE, max_length=30, default="proccessing")

    class Meta:
        verbose_name_plural = "Cart Order"


class CartOrderItems(models.Model):
    order = models.ForeignKey(CartOrder, on_delete= models.CASCADE)
    invoice_no = models.CharField(max_length=200)
    product_status = models.CharField(max_length=200)
    item = models.CharField(max_length=200)
    image = models.CharField(max_length=200)
    quantety = models.IntegerField(default= 0)
    price = models.DecimalField(max_digits= 30000000000, decimal_places=2)
    total = models.DecimalField(max_digits= 30000000000, decimal_places=2)


    class Meta:
        verbose_name_plural = "Cart Order Items"

    
    def order_image(self):
        return mark_safe('<img src ="/media/%s" width ="50" height = "50" />' %(self.image))
    



#---------------------------------------------------Product Review, whishlists, Adress--------------------------------------------------#

class ProductReview(models.Model):
     user = models.ForeignKey(User, on_delete= models.SET_NULL, null = True)
     product = models.ForeignKey(Product, on_delete= models.SET_NULL, null= True)
     review = models.TextField()
     rating = models.IntegerField(choices=RATING, default=None)
     date = models.DateTimeField(auto_now_add= True)


     class Meta:
        verbose_name_plural = "Product Review"

    
     def __str__(self):
        return self.product.title
     
     def get_rating(self):
         return self.rating
     

class wishlist(models.Model):
     user = models.ForeignKey(User, on_delete= models.SET_NULL, null = True)
     product = models.ForeignKey(Product, on_delete= models.SET_NULL, null= True)
     date = models.DateTimeField(auto_now_add= True)


     class Meta:
        verbose_name_plural = "whishlist"

    
     def __str__(self):
        return self.product.title
     
     def get_rating(self):
         return self.rating
     

class Address(models.Model):
    user = models.ForeignKey(User, on_delete= models.SET_NULL, null = True)
    address = models.CharField(max_length=100, null=True)
    status = models.BooleanField(default=False)
     
     
    class Meta:
        verbose_name_plural = "address"



    



    



