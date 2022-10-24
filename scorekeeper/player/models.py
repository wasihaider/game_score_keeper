from django.db import models
from django.contrib.auth.models import User


class Player(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, null=False)
    fullname = models.CharField(max_length=250, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


class PlayerStat(models.Model):
    id = models.AutoField(primary_key=True)
    rank = models.IntegerField(null=False)
    total_score = models.IntegerField(null=False)
    score_average = models.FloatField(null=False)
    points = models.FloatField(null=False)
    total_match = models.IntegerField(null=False)
    win = models.IntegerField(null=False)
    lose = models.IntegerField(null=False)

    # related fields
    game = None  # TODO: Add game type here
