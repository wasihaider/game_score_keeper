# Generated by Django 4.1.3 on 2022-11-30 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='avatar',
            field=models.CharField(default='1', max_length=250),
            preserve_default=False,
        ),
    ]