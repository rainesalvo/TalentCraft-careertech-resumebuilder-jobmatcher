from django.db import models
from django.contrib.auth.models import User


class TrainingModule(models.Model):
    LEVEL_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    skills_covered = models.JSONField(default=list, blank=True)
    prerequisites = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='unlocks')

    def __str__(self):
        return self.title


class TrainingAssignment(models.Model):
    module = models.ForeignKey(TrainingModule, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    repo_template = models.URLField(blank=True)
    estimated_hours = models.PositiveIntegerField(default=2)

    def __str__(self):
        return f"{self.module.title} - {self.title}"


class LearnerProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='training_progress')
    module = models.ForeignKey(TrainingModule, on_delete=models.CASCADE, related_name='progress_records')
    status = models.CharField(max_length=20, choices=(
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ), default='not_started')
    completed_at = models.DateTimeField(blank=True, null=True)
    badge_awarded = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'module')

    def __str__(self):
        return f"{self.user.username} - {self.module.title} - {self.status}"


class LearnerAssignmentProgress(models.Model):
    STATUS_CHOICES = (
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignment_progress')
    assignment = models.ForeignKey(TrainingAssignment, on_delete=models.CASCADE, related_name='progress_records')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'assignment')

    def __str__(self):
        return f"{self.user.username} - {self.assignment.title} - {self.status}"


