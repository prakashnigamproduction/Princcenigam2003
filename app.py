from flask import Flask, request, jsonify
from pytube import YouTube
import os

app = Flask(__name__)

@app.route('/download', methods=['GET'])
def download_video():
    url = request.args.get('url')  # Get YouTube URL from query parameter
    if not url:
        return jsonify({"error": "URL parameter is required"}), 400

    try:
        # Create YouTube object
        yt = YouTube(url)
        stream = yt.streams.get_highest_resolution()  # Get highest resolution stream
        download_path = os.path.join(os.getcwd(), 'downloads')  # Set download directory
        os.makedirs(download_path, exist_ok=True)
        stream.download(download_path)

        return jsonify({"message": "Download successful", "file": os.path.join(download_path, stream.default_filename)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
