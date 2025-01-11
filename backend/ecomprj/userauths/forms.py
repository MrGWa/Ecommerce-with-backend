from django import forms
from django.contrib.auth.forms import UserCreationForm
from userauths.models import User


class UserRegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        labels = {
            'username': 'Username',
            'email': 'Email',
            'password1': 'Password',
            'password2': 'Confirm Password'
        }
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'password1': forms.PasswordInput(attrs={'class': 'form-control'}),
            'password2': forms.PasswordInput(attrs={'class': 'form-control'})
        }