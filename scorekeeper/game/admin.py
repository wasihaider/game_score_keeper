from django.contrib import admin
from .models import Result, Match, Game, Player

# Register your models here.
models = [Result, Match, Game, Player]
for model in models:
    admin.site.register(model)
