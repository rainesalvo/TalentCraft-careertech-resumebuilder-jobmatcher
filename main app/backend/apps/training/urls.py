from django.urls import path
from .views import SuggestedModulesView, ModulesListView, ModuleDetailView, ProgressView, AssignmentProgressView


urlpatterns = [
    path('suggest/', SuggestedModulesView.as_view(), name='training-suggest'),
    path('modules/', ModulesListView.as_view(), name='training-modules'),
    path('modules/<slug:slug>/', ModuleDetailView.as_view(), name='training-module-detail'),
    path('progress/', ProgressView.as_view(), name='training-progress'),
    path('modules/<slug:slug>/assignments/progress/', AssignmentProgressView.as_view(), name='training-assignment-progress-list'),
    path('assignments/progress/', AssignmentProgressView.as_view(), name='training-assignment-progress'),
]


