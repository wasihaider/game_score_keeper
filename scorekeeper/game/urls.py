from django.urls import path
from .views import (GameListView, GameDetailView, GamePlayersListView, GamePlayerDetailView, GameMatchListView,
                    GameMatchDetailView, GameStatsView, GamePlayerRUView, CreateMatchView, ResultListView)

urlpatterns = [
    path("", GameListView.as_view(), name="game-list"),
    path("<int:pk>", GameDetailView.as_view(), name="game-detail"),
    path("<int:game_id>/players", GamePlayersListView.as_view(), name="game-player-list"),
    path("player/ru/<int:pk>", GamePlayerRUView.as_view(), name="game-player-ru"),
    path("player/<int:pk>", GamePlayerDetailView.as_view(), name="game-player-detail"),
    path("<int:game_id>/matches", GameMatchListView.as_view(), name="game-match-list"),
    path("<int:game_id>/matches/new", CreateMatchView.as_view(), name="game-match-new"),
    path("match/<int:pk>", GameMatchDetailView.as_view(), name="game-match-detail"),
    path("<int:game_id>/stats", GameStatsView.as_view(), name="game-stats"),
    path("<int:game_id>/records", ResultListView.as_view(), name="record-list")
]
