import logging

from .utils import calculate_points
from .models import Game, Player, Match, MatchRow, Result
from .serializers import (GameSerializer, PlayerSerializer, GamePlayerSerializer, GameMatchSerializer,
                          MatchRowSerializer, GameMatchListSerializer, GameStatSerializer, ResultSerializer)
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


class GamePlayerRUView(generics.RetrieveUpdateAPIView):
    serializer_class = GamePlayerSerializer
    queryset = Player.objects.all()


class GamePlayerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all()


class GameMatchListView(generics.ListAPIView):
    serializer_class = GameMatchListSerializer
    queryset = Match.objects.all()

    def get_queryset(self):
        return self.queryset.filter(game__id=self.kwargs["game_id"])


class GameMatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GameMatchSerializer
    queryset = Match.objects.all()


class CreateMatchView(APIView):
    def post(self, request, match_id, format=None):

        results = sorted(request.data, key=lambda x: x['score'], reverse=True)
        match_results = []
        for idx, result in enumerate(results):
            match_results.append({
                'player': result['player'],
                'score': result['score'],
                'position': idx + 1,
                'points': calculate_points(result['score'], idx + 1, len(result), result[0]['score'])
            })
        match_serializer = GameMatchSerializer(data={"results": match_results})
        match_serializer.is_valid(raise_exception=True)
        match_serializer.save()

        # Update player records
        for result in results:
            player = get_object_or_404(Player, id=result['player'])
            data = {
                "total_matches": player.total_matches + 1,
                "total_scores": player.total_scores + result['score'],
                "points": player.points + result['points'],
                "win": player.win + 1 if result['position'] == 1 else player.win
            }
            serializer = PlayerSerializer(player, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return Response(match_serializer.data, status=status.HTTP_200_OK)


class GameStatsView(generics.ListAPIView):
    serializer_class = GameStatSerializer
    queryset = Result.objects.all()
    filter_backends = [drf_filters.DjangoFilterBackend, filters.OrderingFilter]
    filter_class = GameStatsFilterSet
    ordering_fields = "__all__"

    def get_queryset(self):
        return self.queryset.filter(match__game__id=self.kwargs["game_id"])\
            .annotate(scores_total=Sum('score'), points_total=Sum('points'),
                      scores_average=Avg('score'), points_average=Avg('points'))
