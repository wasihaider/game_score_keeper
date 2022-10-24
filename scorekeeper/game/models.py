from django.db import models


class Game(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False)


class Player(models.Model):
    id = models.AutoField(primary_key=True)
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


class MatchRow(models.Model):
    id = models.AutoField(primary_key=True)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=False)
    score = models.IntegerField()


class Match(models.Model):
    STATUS_CHOICE = (
        ("P", "In Play"),
        ("E", "End")
    )
    id = models.AutoField(primary_key=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=False)
    play = models.ManyToManyField(MatchRow)
    status = models.CharField(max_length=2, choices=STATUS_CHOICE)
    players = models.ManyToManyField(Player)


class PlayerMatchResult(models.Model):
    id = models.AutoField(primary_key=False)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=False)
    score = models.IntegerField()
    points = models.FloatField()
    position = models.PositiveIntegerField()
