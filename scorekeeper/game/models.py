from django.db import models
from django.contrib.auth.models import User


class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        related_name="%(app_label)s_%(class)s_created_by",
        related_query_name="%(app_label)s_%(class)s_created_by",
        on_delete=models.DO_NOTHING,
    )
    modified_by = models.ForeignKey(
        User,
        related_name="%(app_label)s_%(class)s_modified_by",
        related_query_name="%(app_label)s_%(class)s_modified_by",
        on_delete=models.DO_NOTHING,
    )

    class Meta:
        abstract = True


class Game(BaseModel):
    name = models.CharField(max_length=100, null=False)


class Player(BaseModel):
    username = models.CharField(max_length=50, null=False)
    rank = models.PositiveIntegerField()
    total_scores = models.IntegerField()
    scores_average = models.FloatField()
    points = models.FloatField()
    total_matches = models.PositiveIntegerField()
    win = models.PositiveIntegerField()
    lose = models.PositiveIntegerField()
    drawn = models.PositiveIntegerField()
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=False)

    class Meta:
        unique_together = ["game", "username"]


class MatchRow(BaseModel):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=False)
    score = models.IntegerField()


class Match(BaseModel):
    STATUS_CHOICE = (
        ("P", "In Play"),
        ("E", "End")
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=False)
    play = models.ManyToManyField(MatchRow)
    status = models.CharField(max_length=2, choices=STATUS_CHOICE)
    players = models.ManyToManyField(Player)


class PlayerMatchResult(BaseModel):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=False)
    score = models.IntegerField()
    points = models.FloatField()
    position = models.PositiveIntegerField()
