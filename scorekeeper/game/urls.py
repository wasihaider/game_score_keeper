from django.urls import path
from .views import (GameListView, GameDetailView, GamePlayersListView, GamePlayerDetailView)

urlpatterns = [
    path("", GameListView.as_view(), name="game-list"),
    path("<int:pk>/", GameDetailView.as_view(), name="game-detail"),
    path("<int:game_id>/players/", GamePlayersListView.as_view(), name="game-player-list"),
    path("<int:game_id>/players/<int:pk>/", GamePlayerDetailView.as_view(), name="game-player-detail"),
]
