from django.urls import path
from .views import (GameListView, GameDetailView, GamePlayersListView, GamePlayerDetailView, GameMatchListView,
                    GameMatchDetailView, GameMatchCreateView, MatchRowDetailView, MatchRowListView)

urlpatterns = [
    path("", GameListView.as_view(), name="game-list"),
    path("<int:pk>/", GameDetailView.as_view(), name="game-detail"),
    path("<int:game_id>/players/", GamePlayersListView.as_view(), name="game-player-list"),
    path("player/<int:pk>/", GamePlayerDetailView.as_view(), name="game-player-detail"),
    path("<int:game_id>/matches/", GameMatchListView.as_view(), name="game-match-list"),
    path("<int:game_id>/matches/new/", GameMatchCreateView.as_view(), name="game-match-new"),
    path("match/<int:pk>", GameMatchDetailView.as_view(), name="game-match-detail"),
    path("match/<int:match_id>/rows", MatchRowListView.as_view(), name="match-row-list"),
    path("match/<int:match_id>/row/<int:pk>", MatchRowDetailView.as_view(), name="match-row-detail"),
]
