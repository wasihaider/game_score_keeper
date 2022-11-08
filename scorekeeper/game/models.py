from django.db import models
import logging

logger = logging.getLogger(__name__)


class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Game(BaseModel):
    name = models.CharField(max_length=100, null=False)
    color = models.CharField(max_length=7, null=False)
    avatar = models.CharField(max_length=3, null=False)

    def save(self, *args, **kwargs):
        self.avatar = ''
        for s in self.name.split()[:3]:
            self.avatar += s[0].upper()
        logger.debug(self.avatar)
        super(Game, self).save(*args, **kwargs)


class Player(BaseModel):
    name = models.CharField(max_length=250, null=False)
    total_scores = models.IntegerField(default=0)
    scores_average = models.FloatField(default=0)
    points = models.FloatField(default=0)
    points_average = models.FloatField(default=0)
    total_matches = models.PositiveIntegerField(default=0)
    win = models.PositiveIntegerField(default=0)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=False)
    color = models.CharField(max_length=7, null=False)

    def rank(self):
        count = Player.objects.filter(points_average__lt=self.points_average).count()
        return count + 1

    class Meta:
        unique_together = ["game", "name"]


class Match(BaseModel):
    STATUS_CHOICE = (
        ("C", "Created"),
        ("P", "In Play"),
        ("E", "Ended")
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=False)
    status = models.CharField(max_length=2, choices=STATUS_CHOICE, default="C")


class MatchRow(BaseModel):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, null=False)


class MatchRowIndividualScore(BaseModel):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=False)
    score = models.IntegerField()
    row = models.ForeignKey(MatchRow, related_name="scores", on_delete=models.CASCADE, null=False)


class PlayerMatch(BaseModel):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=False)
    score = models.IntegerField()
    points = models.FloatField()
    position = models.PositiveIntegerField()
    match = models.ForeignKey(Match, on_delete=models.CASCADE, null=False)
