from moviepy import VideoFileClip
import os

def compress_video(input_path, output_path):
    print(f"Compressing {input_path}...")
    try:
        clip = VideoFileClip(input_path)
        # Using a target bitrate or resize if needed.
        clip_resized = clip.resized(height=720) 
        clip_resized.write_videofile(
            output_path,
            codec="libx264",
            audio_codec="aac",
            bitrate="2000k"
        )
        clip.close()
        clip_resized.close()
        
        # Replace original with compressed
        os.replace(output_path, input_path)
        print(f"Successfully compressed {input_path}")
    except Exception as e:
        print(f"Error compressing {input_path}: {e}")

if __name__ == "__main__":
    compress_video("public/inte.mp4", "public/inte_compressed.mp4")
    compress_video("public/intezaar.mp4", "public/intezaar_compressed.mp4")
