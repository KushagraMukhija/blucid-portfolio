import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

videos = ["public/inte.mp4", "public/intezaar.mp4"]
for v in videos:
    print(f"Fixing {v}...")
    # Re-encode to fix pixel format (yuv420p) which is required for browsers (Safari/iOS)
    subprocess.run([
        ffmpeg_exe, "-i", v,
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "copy", "-y", f"{v}.tmp.mp4"
    ])
    os.replace(f"{v}.tmp.mp4", v)
    print(f"Successfully fixed {v}")
