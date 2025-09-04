from rest_framework import serializers
from .models import TrainingModule, TrainingAssignment, LearnerProgress, LearnerAssignmentProgress


class TrainingAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingAssignment
        fields = ['id', 'title', 'description', 'repo_template', 'estimated_hours']


class TrainingModuleSerializer(serializers.ModelSerializer):
    assignments = TrainingAssignmentSerializer(many=True, read_only=True)

    class Meta:
        model = TrainingModule
        fields = ['id', 'title', 'slug', 'description', 'level', 'skills_covered', 'assignments']


class LearnerProgressSerializer(serializers.ModelSerializer):
    module = TrainingModuleSerializer(read_only=True)
    module_id = serializers.PrimaryKeyRelatedField(queryset=TrainingModule.objects.all(), source='module', write_only=True)

    class Meta:
        model = LearnerProgress
        fields = ['id', 'module', 'module_id', 'status', 'completed_at', 'badge_awarded']


class LearnerAssignmentProgressSerializer(serializers.ModelSerializer):
    assignment_id = serializers.PrimaryKeyRelatedField(queryset=TrainingAssignment.objects.all(), source='assignment', write_only=True)
    assignment = TrainingAssignmentSerializer(read_only=True)

    class Meta:
        model = LearnerAssignmentProgress
        fields = ['id', 'assignment', 'assignment_id', 'status', 'completed_at']


