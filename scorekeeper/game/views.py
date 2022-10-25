import logging

from utils import calculate_points
from .models import Game, Player, Match, MatchRow, PlayerMatch
from .serializers import (GameSerializer, PlayerSerializer, GamePlayerSerializer, GameMatchSerializer,
                          MatchRowSerializer, MatchPlayerSerializer)
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from django.db.models import Sum

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


class MatchResultsView(APIView):
    def post(self, request, format=None):
        match_id = self.kwargs["match_id"]
        match = get_object_or_404(Match, id=match_id)
        match_serializer = GameMatchSerializer(match)

        players_scores = MatchRow.objects.values("scores__player").\
            annotate(player_score=Sum("scores__score")).\
            order_by("-player_score")

        position = 1
        results = []
        for score in players_scores:
            results.append({
                'player': score['scores__player'],
                'score': score['player_score'],
                'position': position,
                'points': calculate_points(score['player_score'],
                                           position, len(players_scores), players_scores[0]['player_score'])
            })
            position += 1

        serializer = MatchPlayerSerializer(results, many=True)
        serializer.save()
