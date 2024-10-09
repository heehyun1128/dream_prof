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

        processed_data = []

        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_file = os.path.join(root_dir, "reviews.json")
        data=json.load(open(json_file))
        print(data)


        for review in data["reviews"]:
            res=openai.embeddings.create( 
                                         input=review['review'],
                                         model="text-embedding-3-small"
                )
            embedding=res.data[0].embedding
            processed_data.append({
                "values":embedding,
                "id":review["professor"],
                "metadata": {
                    "review": review["review"],
                    "subject": review["subject"],
                    "stars": review["stars"]},
                    })

        print(processed_data[0])
        
        pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        index = pc.Index("rate-my-professor")
        
        index.upsert(
            vectors=processed_data,
            namespace="ns2"
        )
       
     
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(chunk_and_embed_document())

@chunk_and_embed_routes.route('/orig-data-embedding', methods=['GET'])
def trigger_chunking():
    asyncio.run(chunk_and_embed_document())
    return jsonify({"message": "Chunking and embedding started"}), 200

