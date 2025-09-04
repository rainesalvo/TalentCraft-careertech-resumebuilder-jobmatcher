from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q

import re
from .models import TrainingModule, TrainingAssignment, LearnerProgress, LearnerAssignmentProgress
from .serializers import TrainingModuleSerializer, TrainingAssignmentSerializer, LearnerProgressSerializer, LearnerAssignmentProgressSerializer
from users.models import Profile
from match.matching import extract_skills_from_text


class SuggestedModulesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        job_description = request.data.get('job_description', '')
        try:
            profile = Profile.objects.get(user=request.user, is_current=True)
        except Profile.DoesNotExist:
            return Response({"error": "Current profile not found."}, status=404)

        jd_skills = extract_skills_from_text(job_description.lower())

        profile_skills = []
        if profile.skills and profile.skills != 'Skills not found':
            profile_skills = [s.strip().lower() for s in re.split(r'[,•\n]+', profile.skills)]

        missing = [s for s in jd_skills if s not in profile_skills]

        all_modules = list(TrainingModule.objects.all())
        if missing:
            filtered = []
            missing_set = set(missing)
            for m in all_modules:
                covered = set((m.skills_covered or []))
                if covered.intersection(missing_set):
                    filtered.append(m)
            if not filtered:
                filtered = [m for m in all_modules if m.level in ['beginner', 'intermediate']]
            modules = filtered
        else:
            modules = [m for m in all_modules if m.level in ['beginner', 'intermediate']]

        serializer = TrainingModuleSerializer(modules, many=True)
        return Response({
            'missing_skills': missing,
            'suggested_modules': serializer.data
        })


class ModulesListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        level = request.query_params.get('level')
        qs = TrainingModule.objects.all()
        if level:
            qs = qs.filter(level=level)
        serializer = TrainingModuleSerializer(qs, many=True)
        return Response(serializer.data)


class ModuleDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        try:
            module = TrainingModule.objects.get(slug=slug)
        except TrainingModule.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)
        serializer = TrainingModuleSerializer(module)
        return Response(serializer.data)


class ProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = LearnerProgress.objects.filter(user=request.user).select_related('module')
        serializer = LearnerProgressSerializer(records, many=True)
        completed_modules = [r.module for r in records if r.status == 'completed']
        completed_skills = set()
        for m in completed_modules:
            for s in (m.skills_covered or []):
                completed_skills.add(s)
        return Response({
            'progress': serializer.data,
            'completed_skills': sorted(list(completed_skills)),
        })

    def post(self, request):
        serializer = LearnerProgressSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        module = serializer.validated_data['module']

        record, _ = LearnerProgress.objects.get_or_create(user=request.user, module=module)
        record.status = serializer.validated_data.get('status', record.status)
        if record.status == 'completed':
            record.completed_at = timezone.now()
            record.badge_awarded = True
            # Update resume profile skills with module skills_covered
            try:
                profile = Profile.objects.get(user=request.user, is_current=True)
                existing = profile.skills if profile.skills and profile.skills != 'Skills not found' else ''
                existing_set = set([s.strip().lower() for s in re.split(r'[,•\n]+', existing) if s.strip()])
                updated_set = existing_set.union(set([s.lower() for s in (module.skills_covered or [])]))
                profile.skills = ', '.join(sorted(updated_set)) if updated_set else existing
                profile.save()
            except Profile.DoesNotExist:
                pass
        record.save()
        return Response(LearnerProgressSerializer(record).data, status=201)


class AssignmentProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        try:
            module = TrainingModule.objects.get(slug=slug)
        except TrainingModule.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)
        assignments = module.assignments.all()
        progress_map = {p.assignment_id: p for p in LearnerAssignmentProgress.objects.filter(user=request.user, assignment__in=assignments)}
        data = []
        for a in assignments:
            p = progress_map.get(a.id)
            data.append({
                'assignment': TrainingAssignmentSerializer(a).data,
                'status': p.status if p else 'not_started',
                'completed_at': p.completed_at if p else None,
            })
        return Response(data)

    def post(self, request):
        serializer = LearnerAssignmentProgressSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        assignment = serializer.validated_data['assignment']
        status_value = serializer.validated_data.get('status', 'not_started')

        record, _ = LearnerAssignmentProgress.objects.get_or_create(user=request.user, assignment=assignment)
        record.status = status_value
        if status_value == 'completed':
            record.completed_at = timezone.now()
        record.save()
        return Response(LearnerAssignmentProgressSerializer(record).data, status=201)


