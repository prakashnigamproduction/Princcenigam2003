from flask import Flask, request, send_file, render_template_string
from pytube import YouTube
import os

app = Flask(__name__)

# Home route with form to input YouTube video URL
@app.route('/')
def index():
    return render_template_string('''
        <h1>Download YouTube Video</h1>
        <form action="/download" method="POST">
            <input type="text" name="url" placeholder="Enter YouTube URL" required>
            <button type="submit">Download</button>
        </form>
    ''')

# Route to download the YouTube video
@app.route('/download', methods=['POST'])
def download():
    url = request.form['url']
    
    try:
        # Get YouTube video object
        yt = YouTube(url)
        
        # Get the highest resolution stream
        stream = yt.streams.get_highest_resolution()
        
        # Download the video in current directory
        download_path = os.path.join(os.getcwd(), yt.title + '.mp4')
        stream.download(output_path=os.getcwd(), filename=yt.title + '.mp4')
        
        # Return the downloaded video file for the user to download
        return send_file(download_path, as_attachment=True)
    
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    app.run(debug=True)
