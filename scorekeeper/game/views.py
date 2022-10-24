from .models import Game, Player, Match, MatchRow, PlayerMatchResult
from .serializers import (GameSerializer, MatchRowSerializer, PlayerMatchResultSerializer, MatchListSerializer,
                          MatchStartSerializer, PlayerSerializer, MatchDetailSerializer)
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response


class GameListView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GameDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GamePlayersView(APIView):
    serializer_class = GameSerializer

    def get_queryset(self, *args, **kwargs):
        return Game.objects.all()

    def get_object(self, id):
        return get_object_or_404(self.get_queryset(), id=id)

    def get(self, request, pk=None, format=None, **kwargs):
        game = self.get_object(pk)
        serializer = GameSerializer(game)
        players = Player.objects.filter(game=game)
        players_serializer = PlayerSerializer(players, many=True)

        data = serializer.data
        data['players'] = players_serializer.data

        return Response(data)


class PlayerCreateView(generics.ListCreateAPIView):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all()


class PlayerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
