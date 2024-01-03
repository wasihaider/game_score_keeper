import random

import factory
import faker
from . import models

fake = faker.Faker()


class GameFactory(factory.django.DjangoModelFactory):
	class Meta:
		model = models.Game
	
	name = 'Badshah Wazir'
	color = '1234567'
	
class PlayerFactory(factory.django.DjangoModelFactory):
	class Meta:
		model = models.Player
	
	name = factory.Faker('first_name')
	color = fake.color()
	avatar = 1
	game = factory.SubFactory(GameFactory)
	
	
def random_match_scores(num_players, turns):
	score_choices = [i for i in range(0, (num_players+1)*100, 100)]
	scores = []
	ids = [i for i in range(1, num_players+1)]
	
	for i in range(turns):
		turn_score = {}
		for player_id, score in zip(ids, random.sample(score_choices, num_players)):
			turn_score[player_id] = score
		scores.append(turn_score)
	
	result = []
	for player_id in ids:
		player_score = 0
		for score in scores:
			player_score += score[player_id]
		result.append({
			"player": player_id,
			"score": player_score
		})
		
	
	return result