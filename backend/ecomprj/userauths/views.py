from django.shortcuts import render, redirect
from userauths.forms import UserRegistrationForm
from django.contrib.auth import login, authenticate, get_user_model, logout
from django.contrib import messages
from django.conf import settings
from django.contrib.auth.models import User


User = settings.AUTH_USER_MODEL
User = get_user_model()


def register_view(request):

    if request.method == 'POST':
        form = UserRegistrationForm(request.POST or None)
        if form.is_valid():
            new_user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}')
            new_user = authenticate(username=form.cleaned_data['email'], password=form.cleaned_data['password1'])
            login(request, new_user)
            return redirect('core:index')
    else:
        form = UserRegistrationForm()
    
    context = {
        'form': form
    }
    return render(request, 'userauths/sign-up.html', context)


def login_view(request):
    if request.user.is_authenticated:
        messages.info(request, 'You are already logged in')
        return redirect('core:index')
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, f'User with {email} does not exist')
            return render(request, "userauths/sign-in.html")

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f'Welcome {user.username}')
            return redirect('core:index')
        else:
            messages.error(request, 'Invalid email or password')

    context = {}
    return render(request, "userauths/sign-in.html")


def logout_view(request):
    logout(request)
    messages.success(request, 'You have been logged out')
    return redirect('core:index')
