from typing import List, Dict, Any
import os
from dotenv import load_dotenv
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

load_dotenv()

class YoutubeService:
    def __init__(self):
        self.api_key = os.getenv('YOUTUBE_API_KEY')
        self.youtube = build('youtube', 'v3', developerKey=self.api_key)

    async def search_videos(self, query: str, min_views: int, max_views: int) -> List[Dict[str, Any]]:
        try:
            search_response = self.youtube.search().list(
                q=query,
                part='id,snippet',
                maxResults=50,
                type='video'
            ).execute()

            video_ids = [item['id']['videoId'] for item in search_response['items']]

            videos_response = self.youtube.videos().list(
                part='statistics,snippet',
                id=','.join(video_ids)
            ).execute()

            filtered_videos = []
            for video in videos_response['items']:
                view_count = int(video['statistics']['viewCount'])

                if view_count >= min_views and view_count <= max_views:
                    filtered_videos.append({
                        'id': video['id'],
                        'title': video['snippet']['title'],
                        'description': video['snippet']['description'],
                        'views': view_count,
                        'thumbnail': video['snippet']['thumbnails']['high']['url']
                    })

            return sorted(filtered_videos, key=lambda x: x['views'], reverse=True)

        except HttpError as e:
            print(f"An HTTP error occurred: {e.resp.status} {e.content}")
            raise
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            raise
