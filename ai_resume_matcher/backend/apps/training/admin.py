from django.contrib import admin
from .models import TrainingModule, TrainingAssignment, LearnerProgress


@admin.register(TrainingModule)
class TrainingModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'level')
    search_fields = ('title',)
    prepopulated_fields = {"slug": ("title",)}


@admin.register(TrainingAssignment)
class TrainingAssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'estimated_hours')
    search_fields = ('title', 'module__title')


@admin.register(LearnerProgress)
class LearnerProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'module', 'status', 'badge_awarded', 'completed_at')
    list_filter = ('status', 'badge_awarded')


