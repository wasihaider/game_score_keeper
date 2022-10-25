import logging

from .models import Game, Player, Match, MatchRow, PlayerMatch
from .serializers import (GameSerializer, PlayerSerializer, GamePlayerSerializer, GameMatchSerializer)
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

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

    def get_queryset(self, *args, **kwargs):
        game_id = self.kwargs['game_id']
        return self.queryset.filter(game__id=game_id)


class GameMatchListView(generics.ListCreateAPIView):
    serializer_class = GameMatchSerializer
    queryset = Match.objects.all()

    def get_queryset(self):
        return self.queryset.filter(game__id=self.kwargs["game_id"])

    def create(self, request, *args, **kwargs):
        request.data["game"] = kwargs["game_id"]
        return super(GameMatchListView, self).create(request, args, kwargs)


class GameMatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GameMatchSerializer
    queryset = Match.objects.all()

    def get_queryset(self):
        return self.queryset.filter(game__id=self.kwargs["game_id"])
