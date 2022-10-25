from django.urls import path
from .views import (GameListView, GameDetailView, GamePlayersListView, GamePlayerDetailView, GameMatchListView,
                    GameMatchDetailView)

urlpatterns = [
    path("", GameListView.as_view(), name="game-list"),
    path("<int:pk>/", GameDetailView.as_view(), name="game-detail"),
    path("<int:game_id>/players/", GamePlayersListView.as_view(), name="game-player-list"),
    path("<int:game_id>/player/<int:pk>/", GamePlayerDetailView.as_view(), name="game-player-detail"),
    path("<int:game_id>/matches/", GameMatchListView.as_view(), name="game-match-list"),
    path("<int:game_id>/match/<int:pk>", GameMatchDetailView.as_view(), name="game-match-detail")
]
