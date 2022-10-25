from .models import Game, Player, Match, MatchRow, PlayerMatchResult
from rest_framework import serializers


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"
        read_only_fields = ("id", "created_on", "modified_on")


class GamePlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ("id", "username", "full_name", "created_on", "modified_on", "game")
        read_only_fields = ("id", "created_on", "modified_on")


class PlayerSerializer(serializers.ModelSerializer):
    rank = serializers.IntegerField()

    class Meta:
        model = Player
        fields = "__all__"
        read_only_fields = ("id", "created_on", "modified_on")


class GameMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ("id", "created_on", "modified_on", "game", "status")
        read_only_fields = ("id", "created_on", "modified_on")
