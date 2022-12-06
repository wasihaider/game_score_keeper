import math

from .models import Game, Player, Match, Result
from rest_framework import serializers


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"
        read_only_fields = ("id", "created_on", "modified_on", "avatar")


class GamePlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ("id", "name", "created_on", "modified_on", "game", "color", "avatar")
        read_only_fields = ("id", "created_on", "modified_on")


class PlayerSerializer(serializers.ModelSerializer):
    rank = serializers.IntegerField()
    rating = serializers.SerializerMethodField('get_rating', read_only=True)

    def get_rating(self, instance):
        return math.ceil(instance.points_average * 500)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            instance.__setattr__(key, value)
        instance.scores_average = instance.total_scores / instance.total_matches
        instance.points_average = instance.points / instance.total_matches
        instance.save()
        return instance

    class Meta:
        model = Player
        fields = "__all__"
        read_only_fields = ("id", "created_on", "modified_on", "score_average", "points_average", "rating")


class MatchResultSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="player.name", read_only=True)
    color = serializers.CharField(source="player.color", read_only=True)

    class Meta:
        model = Result
        exclude = ("match",)
        read_only_fields = ("id", "created_on", "modified_on", "name", "color")


class GameMatchSerializer(serializers.ModelSerializer):
    results = MatchResultSerializer(many=True)

    def create(self, validated_data):
        results = validated_data.pop("results")
        match = Match.objects.create(**validated_data)

        for result in results:
            Result.objects.create(match=match, **result)
        return match

    def update(self, instance, validated_data):
        if "results" in validated_data:
            results = validated_data.pop("results")
            for result in results:
                result_instance = Result.objects.get(id=result["id"])
                for key, value in result.items():
                    result_instance.__setattr__(key, value)
                result_instance.save()
        for key, value in validated_data.items():
            instance.__setattr__(key, value)
        instance.save()

    def validate_results(self, value):
        if not value:
            raise serializers.ValidationError("Scores can not be empty.")
        return value

    class Meta:
        model = Match
        fields = "__all__"
        read_only_fields = ("id", "created_on", "modified_on")


class GameStatSerializer(serializers.ModelSerializer):
    position = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)
    color = serializers.CharField(read_only=True)
    avatar = serializers.CharField(read_only=True)
    points_total = serializers.FloatField(read_only=True)
    scores_average = serializers.FloatField(read_only=True)
    rating = serializers.FloatField(read_only=True)
    matches_total = serializers.IntegerField(read_only=True)
    win = serializers.IntegerField(read_only=True)

    class Meta:
        model = Result
        fields = (
            "name", "color", "avatar", "points_total", "scores_average", "rating", "position", "matches_total", "win"
        )


class ResultSerializerScore(serializers.ModelSerializer):
    name = serializers.CharField(source="player.name", read_only=True)
    color = serializers.CharField(source="player.color", read_only=True)
    avatar = serializers.CharField(source="player.avatar", read_only=True)
    date = serializers.DateTimeField(source="created_on", read_only=True)

    class Meta:
        model = Result
        fields = ("id", "date", "name", "color", "avatar", "score")


class ResultTotalScoreAverageSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    color = serializers.CharField(read_only=True)
    avatar = serializers.CharField(read_only=True)
    score_average = serializers.CharField(read_only=True)

    class Meta:
        model = Result
        fields = ("name", "color", "avatar", "score_average")
