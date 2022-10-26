import logging

from .utils import calculate_points
from .models import Game, Player, Match, MatchRow, PlayerMatch
from .serializers import (GameSerializer, PlayerSerializer, GamePlayerSerializer, GameMatchSerializer,
                          MatchRowSerializer, MatchPlayerSerializer, GameStatSerializer)
from .filters import GameStatsFilterSet
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from django.db.models import Sum, Avg
from django_filters import rest_framework as drf_filters
from rest_framework import filters

logger = logging.getLogger(__name__)


class GameListView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GameDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GamePlayersListView(generics.ListCreateAPIView):
    serializer_class = GamePlayerSerializer
    queryset = Player.objects.all()

    def get_queryset(self, *args, **kwargs):
        game_id = self.kwargs["game_id"]
        return self.queryset.filter(game__id=game_id)

    def create(self, request, *args, **kwargs):
        request.data["game"] = kwargs["game_id"]
        return super(GamePlayersListView, self).create(request, args, kwargs)


class GamePlayerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all()


class GameMatchListView(generics.ListAPIView):
    serializer_class = GameMatchSerializer
    queryset = Match.objects.all()

    def get_queryset(self):
        return self.queryset.filter(game__id=self.kwargs["game_id"])


class GameMatchCreateView(generics.CreateAPIView):
    serializer_class = GameMatchSerializer
    queryset = Match.objects.all()

    def get_queryset(self):
        return self.queryset.filter(game__id=self.kwargs["game_id"])

    def create(self, request, *args, **kwargs):
        request.data["game"] = kwargs["game_id"]
        return super(GameMatchCreateView, self).create(request, args, kwargs)


class GameMatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GameMatchSerializer
    queryset = Match.objects.all()


class MatchRowListView(generics.ListCreateAPIView):
    serializer_class = MatchRowSerializer
    queryset = MatchRow.objects.all()

    def get_queryset(self):
        return self.queryset.filter(match__id=self.kwargs["match_id"])

    def create(self, request, *args, **kwargs):
        request.data["match"] = kwargs["match_id"]
        return super(MatchRowListView, self).create(request, args, kwargs)


class MatchRowDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MatchRowSerializer
    queryset = MatchRow.objects.all()

    def get_queryset(self):
        return self.queryset.filter(match__id=self.kwargs["match_id"])


class MatchEndView(APIView):
    def post(self, request, match_id, format=None):

        players_scores = MatchRow.objects. \
            filter(match__id=match_id). \
            values("scores__player"). \
            annotate(player_score=Sum("scores__score")). \
            order_by("-player_score")

        position = 1
        results = []
        for score in players_scores:
            result = {
                'player': score['scores__player'],
                'score': score['player_score'],
                'position': position,
                'points': calculate_points(score['player_score'],
                                           position, len(players_scores), players_scores[0]['player_score']),
                'match': match_id
            }
            position += 1
            serializer = MatchPlayerSerializer(data=result)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        # Update player records
        for result in results:
            player = Player.objects.get(id=result['player'])
            data = {
                "total_matches": player.total_matches + 1,
                "total_scores": player.total_scores + result['score'],
                "points": player.points + result['points'],
                "win": player.win + 1 if result['position'] == 1 else player.win
            }
            serializer = PlayerSerializer(player, data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        # End match
        match = get_object_or_404(Match, id=match_id)
        data = {"status": "E"}
        match_serializer = GameMatchSerializer(match, data=data, partial=True)
        match_serializer.is_valid(raise_exception=True)
        match_serializer.save()

        # get match results
        match_result = PlayerMatch.objects.filter(match__id=match_id)
        result_serializer = MatchPlayerSerializer(match_result, many=True)
        return Response({"match": match_serializer.data, "result": result_serializer.data}, status=status.HTTP_200_OK)


class MatchResultView(APIView):
    def get(self, request, match_id, format=None):
        match = Match.objects.get(id=match_id)
        match_serializer = GameMatchSerializer(match)
        results = PlayerMatch.objects.filter(match=match)
        results_serializer = MatchPlayerSerializer(results, many=True)
        return Response({"match": match_serializer.data, "result": results_serializer.data}, status=status.HTTP_200_OK)


class GameStatsView(generics.ListAPIView):
    serializer_class = GameStatSerializer
    queryset = PlayerMatch.objects.all()
    filter_backends = [drf_filters.DjangoFilterBackend, filters.OrderingFilter]
    filter_class = GameStatsFilterSet
    ordering_fields = "__all__"

    def get_queryset(self):
        return self.queryset.filter(match__game__id=self.kwargs["game_id"])\
            .annotate(scores_total=Sum('score'), points_total=Sum('points'),
                      scores_average=Avg('score'), points_average=Avg('points'))


