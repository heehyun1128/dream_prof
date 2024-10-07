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
    try:
        csv_file = 'professor-ratings.csv'
        processed_data = []
        with open(csv_file,mode='r',newline="",encoding="UTF-8") as file:
            reader=csv.DictReader(file)
            prof_rating=""
            for row in reader:
                
                name=row['Name']
                department=row['Department']
                school=row['School']
                rating=row['Rating']
                numRatings=row['NumRatings']
                difficulty=row['Difficulty']
                wouldTakeAgain=row['WouldTakeAgain']
                
                prof_rating= f"""Professor name is {name}, in department {department}, school of {school},
                professor rating is {rating}, total number of ratings received: {numRatings}, the professor's class difficulty is {difficulty},
                and the rating of 'student would take again the course' is {wouldTakeAgain}
                
                """
                
                res = openai.embeddings.create(
                    input=prof_rating,
                    model="text-embedding-3-small"
                )
                embedding = res.data[0].embedding
                
                processed_data.append({
                    "values": embedding,
                    "id": f"{name}_{department}_{school}_{rating}",
                    "metadata": {
                        "name": name,
                        "department": department,
                        "school": school,
                        "rating": rating,
                        "numRatings": numRatings,
                        "difficulty": difficulty,
                        "wouldTakeAgain": wouldTakeAgain
                    },
                })
                print(processed_data)
                pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
                index = pc.Index("rate-my-professor")
                index.upsert(vectors=processed_data,namespace="ns1")
            
            
        # data=json.load(open("reviews.json"))
        # print(data)
        
        
        # for review in data["reviews"]:
        #     res=openai.embeddings.create( 
        #                                  input=review['review'],
        #                                  model="text-embedding-3-small"
        #         )
        #     embedding=res.data[0].embedding
        #     processed_data.append({
        #         "values":embedding,
        #         "id":review["professor"],
        #         "metadata": {
        #             "review": review["review"],
        #             "subject": review["subject"],
        #             "stars": review["stars"]},
        #             })

        # print(processed_data[0])
        
        # pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        # index = pc.Index("rate-my-professor")
        
        # index.upsert(
        #     vectors=processed_data,
        #     namespace="ns2"
        # )
       
     
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(chunk_and_embed_document())

@chunk_and_embed_routes.route('/auto-embedding', methods=['GET'])
def trigger_chunking():
    asyncio.run(chunk_and_embed_document())
    return jsonify({"message": "Chunking and embedding started"}), 200

