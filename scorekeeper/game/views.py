import logging

from .utils import calculate_points
from .models import Game, Player, Match, Result
from .serializers import (GameSerializer, PlayerSerializer, GamePlayerSerializer, GameMatchSerializer,
                          GameMatchListSerializer, ResultSerializer)
from .filters import GameStatsFilterSet, MatchFilterSet
from rest_framework import generics, status
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
    filter_backends = [drf_filters.DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = MatchFilterSet
    ordering_fields = "__all__"

    def get_queryset(self):
        return self.queryset.filter(game__id=self.kwargs["game_id"])


class GameMatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GameMatchSerializer
    queryset = Match.objects.all()


class CreateMatchView(generics.CreateAPIView):
    serializer_class = GameMatchSerializer
    queryset = Match.objects.all()

    def create(self, request, *args, **kwargs):
        results = request.data
        for idx, result in enumerate(results):
            result['position'] = idx + 1
            result['points'] = calculate_points(result['score'], idx + 1, len(results), results[0]['score'])

        match_serializer = self.get_serializer(data={'results': results, 'game': kwargs['game_id']})
        match_serializer.is_valid(raise_exception=True)
        self.perform_create(match_serializer)

        # Update player records
        for result in results:
            player = get_object_or_404(Player, id=result['player'])
            data = {
                "total_matches": player.total_matches + 1,
                "total_scores": player.total_scores + result['score'],
                "points": player.points + result['points'],
                "win": player.win + 1 if result['position'] == 1 else player.win
            }
            result_serializer = PlayerSerializer(player, data=data, partial=True)
            result_serializer.is_valid(raise_exception=True)
            result_serializer.save()

        headers = self.get_success_headers(match_serializer.data)
        return Response(match_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class GameStatsView(generics.ListAPIView):
    serializer_class = ResultSerializer
    queryset = Result.objects.all()
    filter_backends = [drf_filters.DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = GameStatsFilterSet
    ordering_fields = "__all__"

    def get_queryset(self):
        return self.queryset.filter(match__game__id=self.kwargs["game_id"]) \
            .annotate(scores_total=Sum('score'), points_total=Sum('points'),
                      scores_average=Avg('score'), points_average=Avg('points'))
