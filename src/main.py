from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from services.youtube_services import YoutubeService

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    minViews: Optional[int] = 0
    maxViews: Optional[int] = 1000000

class VideoResponse(BaseModel):
    id: str
    title: str
    description: str
    views: int
    thumbnail: str

youtube_service = YoutubeService()

@app.post("/api/search", response_model=List[VideoResponse])
async def search_videos(request: SearchRequest):
    try:
        videos = await youtube_service.search_videos(
            request.query,
            request.minViews,
            request.maxViews
        )
        return videos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
