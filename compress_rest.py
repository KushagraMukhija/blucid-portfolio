import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

videos = ["public/hero.mp4", "public/gulabi.mp4", "public/aarzoo.mp4"]
for v in videos:
    print(f"Compressing {v}...")
    subprocess.run([
        ffmpeg_exe, "-i", v,
        "-c:v", "libx264", "-crf", "32", "-preset", "faster", "-pix_fmt", "yuv420p",
        "-c:a", "copy", "-y", f"{v}.tmp.mp4"
    ])
    os.replace(f"{v}.tmp.mp4", v)
    print(f"Successfully compressed {v}")
