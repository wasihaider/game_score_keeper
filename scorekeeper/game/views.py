import logging
import math

from .utils import calculate_points
from .models import Game, Player, Match, Result
from .serializers import (GameSerializer, PlayerSerializer, GamePlayerSerializer, GameMatchSerializer,
                          GameStatSerializer, ResultSerializerScore, ResultTotalScoreAverageSerializer,
                          ResultTotalScoreSerializer, ResultMostWinSerializer, ResultMostWinPercentageSerializer)
from .filters import GameStatsFilterSet, MatchFilterSet
from .pagination import MatchListPagination, ResultListPagination
from rest_framework import generics, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from django.db.models import Sum, Avg, F, Count, Case, When, IntegerField, DecimalField, ExpressionWrapper
from django_filters import rest_framework as drf_filters
from rest_framework import filters
from rest_framework.views import APIView

logger = logging.getLogger(__name__)

RECORD_SERIALIZER_MAPPING = {
	'score': ResultSerializerScore,
	'scoreAverage': ResultTotalScoreAverageSerializer,
	'scoreTotal': ResultTotalScoreSerializer,
	'win': ResultMostWinSerializer,
	'winPercentage': ResultMostWinPercentageSerializer,
}


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
	serializer_class = GameMatchSerializer
	queryset = Match.objects.all()
	filter_backends = [drf_filters.DjangoFilterBackend, filters.OrderingFilter]
	filterset_class = MatchFilterSet
	pagination_class = MatchListPagination
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
		results = sorted(request.data, key=lambda x: x['score'], reverse=True)
		position = 1
		for idx, result in enumerate(results):
			if idx != 0 and results[idx - 1]['score'] != result['score']:
				position += 1
			result['position'] = position
			result['points'] = calculate_points(result['score'], position, len(results), results[0]['score'])
		
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
	queryset = Result.objects.all()
	serializer_class = GameStatSerializer
	filter_backends = [drf_filters.DjangoFilterBackend, filters.OrderingFilter]
	filterset_class = GameStatsFilterSet
	
	def get_queryset(self):
		return self.queryset.filter(match__game__id=self.kwargs['game_id'])
	
	def get_aggregated_queryset(self, queryset):
		return queryset.values('player') \
			.annotate(matches_total=Count('score'), points_total=Sum('points'),
		              scores_average=Avg('score'), points_average=Avg('points'),
		              name=F('player__name'), color=F('player__color'),
		              avatar=F('player__avatar'), matches=Count('score'),
		              win=Count(Case(When(position=1, then=1), output_field=IntegerField()))) \
			.annotate(rating=F('points_average') * 500) \
			.order_by('-rating')
	
	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		queryset = self.get_aggregated_queryset(queryset)
		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		
		serializer = self.get_serializer(queryset, many=True)
		data = serializer.data
		
		position = 1
		for idx, d in enumerate(data):
			if idx != 0 and data[idx - 1]['rating'] != d['rating']:
				position += 1
			d['position'] = position
			d['rating'] = math.ceil(d['rating'])
		
		return Response(data, status=status.HTTP_200_OK)


class ResultListView(generics.ListAPIView):
	serializer_class = ResultSerializerScore
	queryset = Result.objects.all()
	filter_backends = [drf_filters.DjangoFilterBackend, filters.OrderingFilter]
	pagination_class = ResultListPagination
	filterset_class = GameStatsFilterSet
	ordering_fields = "__all__"
	
	def get_queryset(self):
		return self.queryset.filter(match__game__id=self.kwargs['game_id'])
	
	def get_serializer(self, *args, **kwargs):
		filter_name = kwargs.pop("filter")
		serializer_class = RECORD_SERIALIZER_MAPPING[filter_name]
		kwargs.setdefault('context', self.get_serializer_context())
		return serializer_class(*args, **kwargs)
	
	def get_aggregated_queryset(self, queryset, filter):
		if filter == 'scoreAverage':
			return queryset.values('player') \
				.annotate(score_average=Avg('score'), name=F('player__name'), color=F('player__color'),
			              avatar=F('player__avatar'), match_played=Count('match')) \
				.order_by('-score_average')
		elif filter == 'score':
			return queryset.order_by("-score")
		elif filter == 'scoreTotal':
			return queryset.values('player') \
				.annotate(total_score=Sum('score'), name=F('player__name'), color=F('player__color'),
			              avatar=F('player__avatar'), match_played=Count('match')) \
				.order_by('-total_score')
		elif filter == 'win':
			return queryset.values('player') \
				.annotate(win=Count(Case(When(position=1, then=1), output_field=IntegerField())),
			              name=F('player__name'), color=F('player__color'),
			              avatar=F('player__avatar'), match_played=Count('match')) \
				.order_by('-win')
		elif filter == 'winPercentage':
			return queryset.values('player') \
				.annotate(win=Count(Case(When(position=1, then=1), output_field=IntegerField())),
			              name=F('player__name'), color=F('player__color'),
			              avatar=F('player__avatar'), match_played=Count('match')) \
				.annotate(win_percentage=ExpressionWrapper(
					F('win') * 100 / F('match_played'), output_field=DecimalField())) \
				.order_by('-win')
		else:
			return queryset
	
	def list(self, request, *args, **kwargs):
		requested_filter = request.query_params.get('filter')
		logger.debug(f"{requested_filter = }")
		queryset = self.filter_queryset(self.get_queryset())
		queryset = self.get_aggregated_queryset(queryset, requested_filter)
		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = self.get_serializer(page, many=True, filter=requested_filter)
			return self.get_paginated_response(serializer.data)
		
		serializer = self.get_serializer(queryset, many=True)
		
		return Response(serializer.data, status=status.HTTP_200_OK)
