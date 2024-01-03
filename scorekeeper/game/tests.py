from django.test import TestCase
from rest_framework.generics import get_object_or_404

from .fixtures import PlayerFactory, random_match_scores
from .utils import calculate_points
from . import models


# Create your tests here.

class MatchTests(TestCase):
	def setUp(self):
		self.num_test_players = 10
		self.players = [PlayerFactory() for _ in range(self.num_test_players)]
	
	def test_rating(self):
		scores = random_match_scores(self.num_test_players, 20)
		results = sorted(scores, key=lambda x: x['score'], reverse=True)
		
		position = 1
		for idx, result in enumerate(results):
			if idx != 0 and results[idx - 1]['score'] != result['score']:
				position += 1
			result['position'] = position
			result['points'] = calculate_points(result['score'], position, len(results), results[0]['score'])
			player = get_object_or_404(models.Player, id=result['player'])
			
			print(f"{result['player']} ({player.name}): {result['points']} - {result['score']}")