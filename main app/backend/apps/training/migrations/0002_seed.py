from django.db import migrations


def seed_modules(apps, schema_editor):
    TrainingModule = apps.get_model('training', 'TrainingModule')
    TrainingAssignment = apps.get_model('training', 'TrainingAssignment')

    samples = [
        {
            'title': 'React Basics',
            'slug': 'react-basics',
            'description': 'Learn fundamentals of React including components, state, props, and hooks.',
            'level': 'beginner',
            'skills_covered': ['react', 'javascript', 'jsx', 'hooks'],
            'assignments': [
                {'title': 'Build a Todo App', 'description': 'Create a todo app with add/remove/toggle features', 'repo_template': '', 'estimated_hours': 3},
                {'title': 'Counter with Hooks', 'description': 'Use useState and useEffect to build a counter', 'repo_template': '', 'estimated_hours': 2},
            ]
        },
        {
            'title': 'SQL Fundamentals',
            'slug': 'sql-fundamentals',
            'description': 'Understand relational databases, SELECTs, JOINs, GROUP BY, and indexing basics.',
            'level': 'beginner',
            'skills_covered': ['sql', 'postgresql', 'mysql'],
            'assignments': [
                {'title': 'Design a Library Schema', 'description': 'Create tables and relationships for a library', 'repo_template': '', 'estimated_hours': 3},
                {'title': 'Write Analytical Queries', 'description': 'Practice JOINs and aggregates on a sample dataset', 'repo_template': '', 'estimated_hours': 2},
            ]
        },
        {
            'title': 'APIs with Django REST',
            'slug': 'django-rest-apis',
            'description': 'Build RESTful APIs using DRF: serializers, viewsets, and authentication.',
            'level': 'intermediate',
            'skills_covered': ['django', 'rest', 'api'],
            'assignments': [
                {'title': 'CRUD API', 'description': 'Implement CRUD endpoints for a simple resource', 'repo_template': '', 'estimated_hours': 4},
            ]
        },
        {
            'title': 'Advanced React Patterns',
            'slug': 'advanced-react',
            'description': 'Context API, performance optimization, memoization, and custom hooks.',
            'level': 'advanced',
            'skills_covered': ['react', 'performance', 'hooks'],
            'assignments': [
                {'title': 'Custom Hook Library', 'description': 'Create reusable hooks for data fetching and forms', 'repo_template': '', 'estimated_hours': 5},
            ]
        }
    ]

    for s in samples:
        module, _ = TrainingModule.objects.get_or_create(slug=s['slug'], defaults={
            'title': s['title'],
            'description': s['description'],
            'level': s['level'],
            'skills_covered': s['skills_covered'],
        })
        for a in s['assignments']:
            TrainingAssignment.objects.get_or_create(module=module, title=a['title'], defaults={
                'description': a['description'],
                'repo_template': a['repo_template'],
                'estimated_hours': a['estimated_hours'],
            })


def unseed_modules(apps, schema_editor):
    TrainingModule = apps.get_model('training', 'TrainingModule')
    TrainingAssignment = apps.get_model('training', 'TrainingAssignment')
    slugs = ['react-basics', 'sql-fundamentals', 'django-rest-apis', 'advanced-react']
    for slug in slugs:
        try:
            module = TrainingModule.objects.get(slug=slug)
            TrainingAssignment.objects.filter(module=module).delete()
            module.delete()
        except TrainingModule.DoesNotExist:
            pass


class Migration(migrations.Migration):
    dependencies = [
        ('training', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_modules, reverse_code=unseed_modules),
    ]


