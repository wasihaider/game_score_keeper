def calculate_points(score, position, total_players, highest_score):
    points = (total_players - position + 1) / total_players
    points += (score / highest_score) * 1
    return points
