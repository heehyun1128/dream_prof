from flask import Flask, request, jsonify

from flask_cors import CORS
from pinecone_embed_document import chunk_and_embed_routes
from trend_tracking import sentiment_routes

app = Flask(__name__)


app.register_blueprint(sentiment_routes,url_prefix='/api')
app.register_blueprint(chunk_and_embed_routes,url_prefix='/api')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
    

