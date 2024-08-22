from collections import defaultdict
import matplotlib

import matplotlib.pyplot as plot_graph
import csv
from io import StringIO
import os
from openai import OpenAI
from datetime import datetime

from flask import Blueprint, Response

matplotlib.use('Agg')

sentiment_routes = Blueprint('sentiment', __name__)

client = OpenAI(
  
    api_key=os.environ.get("OPENAI_API_KEY"),
)

def analyze_sentiment(transcription):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": "As an AI with expertise in language and emotion analysis, your task is to analyze the sentiment of the following text. Please consider the overall tone of the discussion, the emotion conveyed by the language used, and the context in which words and phrases are used. Indicate whether the sentiment is generally positive, negative, or neutral. Return ONLY one of the following words: Positive, Neutral, or Negative."
            },
            {
                "role": "user",
                "content": transcription
            }
        ]
    )
    return response.choices[0].message.content.strip()

def get_data_object():
    # csv_file = 'hacker_news_software_engineering_jobs.csv'
    csv_file = 'test.csv'
    data_objects = []
    with open(csv_file, mode='r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data_objects.append({
                "professor": row["professor"],
                "subject": row["subject"],
                "stars": row["stars"],
                "review": row["review"],
                "date": row["date"]
            })
    print(data_objects)
    return data_objects



def track_trends(reviews):
    sentiment_trend=defaultdict(lambda: defaultdict(lambda: {"Positive": 0, "Neutral": 0, "Negative": 0}))
    
    for review in reviews:
        sentiment=analyze_sentiment(review["review"])
        date=review["date"]
        professor=review["professor"]
        sentiment_trend[professor][date][sentiment] += 1
    return sentiment_trend



def create_trend_graph(trends, professor_name):
    if professor_name not in trends:
        print(f"No data available for professor: {professor_name}")
        return
    
    professor_trends = trends[professor_name]
    
    dates = sorted(professor_trends.keys())
    
    positive = [professor_trends[date]["Positive"] for date in dates]
    neutral = [professor_trends[date]["Neutral"] for date in dates]
    negative = [professor_trends[date]["Negative"] for date in dates]
    
    plot_graph.figure(figsize=(12,6))
    plot_graph.plot(dates, positive, label="Positive", color="green")
    # plot_graph.plot(dates, neutral, label="Neutral", color="gray")
    # plot_graph.plot(dates, negative, label="Negative", color="red")
    plot_graph.xlabel("Date")
    plot_graph.ylabel("Sentiment")
    plot_graph.title("Sentiment Trend Over Time")
    # plot_graph.legend()
    plot_graph.xticks(rotation=45)
    plot_graph.tight_layout()
    # timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    professor_name = professor_name.strip()
    file_path = os.path.join('public', f'{professor_name}_sentiment_graph.png')
   
    plot_graph.savefig(file_path)
    plot_graph.close()


# create_trend_graph(trend_over_time)
@sentiment_routes.route('/sentiment-trend/<string:professor_name>',methods=['GET'])
def sentiment_trend_route(professor_name):
    reviews = get_data_object()
    trend_over_time = track_trends(reviews)
    img = create_trend_graph(trend_over_time, professor_name)
    return Response(img, mimetype='image/png')

if __name__ == "__main__":
    sentiment_trend_route()