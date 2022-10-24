from .models import Game, Player, Match, MatchRow, PlayerMatchResult
from rest_framework import serializers


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        read_only_fields = ("id", "created_on", "modified_on")


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        read_only_fields = ("id", "created_on", "modified_on")


class MatchRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchRow
        read_only_fields = ("id", "created_on", "modified_on")


class MatchStartSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        model = Match.objects.create(status="P", **validated_data)
        return model

    class Meta:
        model = Match
        fields = ("id", "game", "players")
        read_only_fields = ("id",)


class MatchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ("id", "created_on")


class MatchDetailSerializer(serializers.ModelSerializer):
    rows = MatchRowSerializer(many=True, read_only=True)

    class Meta:
        model = Match
        fields = "__all__"
        depth = 1


class PlayerMatchResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerMatchResult
        fields = "__all__"
        read_only_fields = ("id", 'created_on', 'modified_on')
