# Generated by Django 5.1.2 on 2025-01-16 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_product_stock_count'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='stock_count',
            field=models.IntegerField(default='3', max_length=100),
        ),
    ]
