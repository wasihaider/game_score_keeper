from django.db import models


class Game(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=250)





class Match(models.Model):
    id = models.AutoField(primary_key=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=False)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
