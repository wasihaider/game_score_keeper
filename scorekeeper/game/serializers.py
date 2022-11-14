from .models import Game, Player, Match, MatchRow, Result, MatchRowIndividualScore
from rest_framework import serializers


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"
        read_only_fields = ("id", "created_on", "modified_on", "avatar")


class GamePlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ("id", "name", "created_on", "modified_on", "game", "color")
        read_only_fields = ("id", "created_on", "modified_on")


class PlayerSerializer(serializers.ModelSerializer):
    rank = serializers.IntegerField()

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
        read_only_fields = ("id", "created_on", "modified_on", "score_average", "points_average")


class ResultSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source="player.name", read_only=True)

    class Meta:
        model = Result
        fields = "__all__"
        read_only_fields = ("id", "created_on", "modified_on", "player_name")


class GameMatchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ("id", "created_on")


class GameMatchSerializer(serializers.ModelSerializer):
    results = ResultSerializer(many=True)

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
    player_name = serializers.CharField(source="player.name", read_only=True)
    scores_total = serializers.IntegerField(read_only=True)
    points_total = serializers.FloatField(read_only=True)
    scores_average = serializers.FloatField(read_only=True)
    points_average = serializers.FloatField(read_only=True)

    class Meta:
        model = Result
        fields = ("player_name", "scores_total", "points_total", "scores_average", "points_average")


# todo: delete this
class MatchRowIndividualScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchRowIndividualScore
        exclude = ("row",)
        read_only_fields = ("id", "created_on", "modified_on")


# TODO: delete this
class MatchRowSerializer(serializers.ModelSerializer):
    scores = MatchRowIndividualScoreSerializer(many=True)

    def create(self, validated_data):
        scores_data = validated_data.pop("scores")
        match_row = MatchRow.objects.create(**validated_data)

        for score in scores_data:
            MatchRowIndividualScore.objects.create(row=match_row, **score)
        return match_row

    def update(self, instance, validated_data):
        if "scores" in validated_data:
            scores = validated_data.pop("scores")
            for score in scores:
                score_instance = MatchRowIndividualScore.objects.get(id=score["id"])
                for key, value in score.items():
                    score_instance.__setattr__(key, value)
                score_instance.save()
        for key, value in validated_data.items():
            instance.__setattr__(key, value)
        instance.save()

    def validate_scores(self, value):
        if not value:
            raise serializers.ValidationError("Scores can not be empty.")
        return value

    class Meta:
        model = MatchRow
        fields = "__all__"
        read_only_fields = ("id", "created_on", "modified_on")
