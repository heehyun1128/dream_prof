from flask import Flask, request, jsonify

from flask_cors import CORS
from pinecone_embed_document import chunk_and_embed_routes
from trend_tracking import sentiment_routes

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.register_blueprint(sentiment_routes,url_prefix='/api')
app.register_blueprint(chunk_and_embed_routes,url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
    

