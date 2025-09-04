from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TrainingModule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('slug', models.SlugField(unique=True)),
                ('description', models.TextField(blank=True)),
                ('level', models.CharField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')], default='beginner', max_length=20)),
                ('skills_covered', models.JSONField(blank=True, default=list)),
            ],
        ),
        migrations.CreateModel(
            name='TrainingAssignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('repo_template', models.URLField(blank=True)),
                ('estimated_hours', models.PositiveIntegerField(default=2)),
                ('module', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='training.trainingmodule')),
            ],
        ),
        migrations.CreateModel(
            name='LearnerProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('not_started', 'Not Started'), ('in_progress', 'In Progress'), ('completed', 'Completed')], default='not_started', max_length=20)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('badge_awarded', models.BooleanField(default=False)),
                ('module', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='progress_records', to='training.trainingmodule')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='training_progress', to=settings.AUTH_USER_MODEL)),
            ],
            options={'unique_together': {('user', 'module')}},
        ),
        migrations.AddField(
            model_name='trainingmodule',
            name='prerequisites',
            field=models.ManyToManyField(blank=True, related_name='unlocks', to='training.trainingmodule'),
        ),
        migrations.CreateModel(
            name='LearnerAssignmentProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('not_started', 'Not Started'), ('in_progress', 'In Progress'), ('completed', 'Completed')], default='not_started', max_length=20)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('assignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='progress_records', to='training.trainingassignment')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignment_progress', to=settings.AUTH_USER_MODEL)),
            ],
            options={'unique_together': {('user', 'assignment')}},
        ),
    ]


