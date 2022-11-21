from django_filters import rest_framework as filters
from .models import Result, Match


class GameStatsFilterSet(filters.FilterSet):
    start_date = filters.DateFilter(field_name='created_on', lookup_expr='gte')
    end_date = filters.DateFilter(field_name='created_on', lookup_expr='lte')

    class Meta:
        model = Result
        fields = ("start_date", "end_date")


class MatchFilterSet(filters.FilterSet):
    start_date = filters.DateFilter(field_name='created_on', lookup_expr='date__gte')
    end_date = filters.DateFilter(field_name='created_on', lookup_expr='date__lte')

    class Meta:
        model = Match
        fields = ['start_date', 'end_date']

