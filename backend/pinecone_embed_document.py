import os
import asyncio
import csv
import json
from dotenv import load_dotenv
import openai
from pinecone import Pinecone
from flask import Blueprint, jsonify

load_dotenv()

chunk_and_embed_routes = Blueprint('chunk_and_embed', __name__)
# chunking
async def chunk_and_embed_document():
    """
    Although the initial idea was to scrape professor ratings from user-provided links,
    such as the Rate My Professor website
    HOWEVER, Rate My Professor website prohibits the scraping of any content from the website.
    Therefore, I scraped a scrapable site and the data is embed below
    """
    try:
       
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        csv_file = os.path.join(root_dir, 'hacker_news_software_engineering_jobs.csv')
        print('path',csv_file)
        if not os.path.exists(csv_file):
            raise FileNotFoundError(f"The CSV file '{csv_file}' does not exist.")
        
        processed_data = []
        with open(csv_file,mode='r',newline="",encoding="UTF-8") as file:
            reader=csv.DictReader(file)
            prof_rating=""
            for row in reader:
                
                title=row['Title']
                url=row['URL']
                time=row['Time']
                
                res = openai.embeddings.create(
                    input=prof_rating,
                    model="text-embedding-3-small"
                )
                embedding = res.data[0].embedding
                
                processed_data.append({
                    "values": embedding,
                    "id": f"{url}",
                    "metadata": {
                        "title": title,
                        "url": url,
                        "time": time,
                    },
                })
                print(processed_data)
                pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
                index = pc.Index("rate-my-professor")
                index.upsert(vectors=processed_data,namespace="ns1")
                
        """ BELOW is the code to scrape the Rate My Professor Website """
        
        """
            NOTE: 
            This project will not use the following code to scrape the Rate My Professor Website
            because it is NOT allowed
        """
        # csv_file = 'professor-ratings.csv'
        # processed_data = []
        # with open(csv_file,mode='r',newline="",encoding="UTF-8") as file:
        #     reader=csv.DictReader(file)
        #     prof_rating=""
        #     for row in reader:
                
        #         name=row['Name']
        #         department=row['Department']
        #         school=row['School']
        #         rating=row['Rating']
        #         numRatings=row['NumRatings']
        #         difficulty=row['Difficulty']
        #         wouldTakeAgain=row['WouldTakeAgain']
                
        #         prof_rating= f"""Professor name is {name}, in department {department}, school of {school},
        #         professor rating is {rating}, total number of ratings received: {numRatings}, the professor's class difficulty is {difficulty},
        #         and the rating of 'student would take again the course' is {wouldTakeAgain}
                
        #         """
                
        #         res = openai.embeddings.create(
        #             input=prof_rating,
        #             model="text-embedding-3-small"
        #         )
        #         embedding = res.data[0].embedding
                
        #         processed_data.append({
        #             "values": embedding,
        #             "id": f"{name}_{department}_{school}_{rating}",
        #             "metadata": {
        #                 "name": name,
        #                 "department": department,
        #                 "school": school,
        #                 "rating": rating,
        #                 "numRatings": numRatings,
        #                 "difficulty": difficulty,
        #                 "wouldTakeAgain": wouldTakeAgain
        #             },
        #         })
        #         print(processed_data)
        #         pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        #         index = pc.Index("rate-my-professor")
        #         index.upsert(vectors=processed_data,namespace="ns1")
        
       
     
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(chunk_and_embed_document())

@chunk_and_embed_routes.route('/auto-embedding', methods=['GET'])
def trigger_chunking():
    asyncio.run(chunk_and_embed_document())
    return jsonify({"message": "Chunking and embedding started"}), 200

