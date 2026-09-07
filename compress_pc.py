import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

videos = ["public/hero.mp4", "public/gulabi.mp4", "public/aarzoo.mp4", "public/inte.mp4", "public/intezaar.mp4"]
for v in videos:
    if not os.path.exists(v):
        continue
    print(f"Compressing {v} for PC to 720p...")
    subprocess.run([
        ffmpeg_exe, "-i", v,
        "-vf", "scale=-2:720", 
        "-c:v", "libx264", "-crf", "24", "-preset", "faster", "-pix_fmt", "yuv420p",
        "-c:a", "copy", "-y", f"{v}.tmp.mp4"
    ])
    os.replace(f"{v}.tmp.mp4", v)
    print(f"Successfully compressed {v}")
