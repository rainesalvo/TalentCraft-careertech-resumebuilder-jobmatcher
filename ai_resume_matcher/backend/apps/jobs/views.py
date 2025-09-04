from django.shortcuts import render
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import Profile
from match.matching import calculate_match_score

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_matching_jobs(request):
    headers = {
        'x-rapidapi-key': "b31f7e6ccamshb505afe9264b9d4p11d38ejsn39a5aa53d1e9",
        'x-rapidapi-host': "jsearch.p.rapidapi.com"
    }
    
   
    profile = Profile.objects.get(user=request.user, is_current=True)
    
  
    keywords = ' '.join(profile.skills.split(',')[:1])   
    
    params = {
        "query": keywords,
        "page": "1",
        "results_per_page": "20",   
         
    }
    
    all_jobs = []
    
    
    for page_num in range(1, 6):   
        params["page"] = str(page_num)
        response = requests.get("https://jsearch.p.rapidapi.com/search", headers=headers, params=params)
        
        if response.status_code == 200:
            jobs = response.json().get("data", [])
            all_jobs.extend(jobs)   
        else:
             
            return Response({"error": "Failed to fetch jobs"}, status=500)

     
    matching_jobs = []
    
   
    for job in all_jobs:
        job_description = job.get("description", "") + " " + job.get("title", "")
        score, _, _, _ = calculate_match_score(profile, job_description)

        job_data = job.copy()
        job_data["score"] = score   
        matching_jobs.append(job_data)

    
    return Response({"matches": matching_jobs})
