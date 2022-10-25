from django.db import models
from django.contrib.auth.models import User


class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Game(BaseModel):
    name = models.CharField(max_length=100, null=False)


class Player(BaseModel):
    username = models.CharField(max_length=50, null=False)
    full_name = models.CharField(max_length=250, default="")
    total_scores = models.IntegerField(default=0)
    scores_average = models.FloatField(default=0)
    points = models.FloatField(default=0)
    total_matches = models.PositiveIntegerField(default=0)
    win = models.PositiveIntegerField(default=0)
    lose = models.PositiveIntegerField(default=0)
    drawn = models.PositiveIntegerField(default=0)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=False)

    def rank(self):
        count = Player.objects.filter(points__lt=self.points).count()
        return count + 1

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
