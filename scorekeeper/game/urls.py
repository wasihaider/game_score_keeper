from django.urls import path
from .views import (GameListView, GameDetailView, GamePlayersView, PlayerDetailView, PlayerListView)

urlpatterns = [
    path("", GameListView.as_view(), name="game-list"),
    path("<int:pk>/", GameDetailView.as_view(), name="game-detail"),
    path("<int:pk>/players/", GamePlayersView.as_view(), name="game-players"),
    path("players/", PlayerListView.as_view(), name="player-list"),
    path("players/")
]