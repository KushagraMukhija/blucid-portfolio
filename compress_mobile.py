import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

videos = ["hero.mp4", "gulabi.mp4", "aarzoo.mp4", "inte.mp4", "intezaar.mp4"]
for v in videos:
    input_path = f"public/{v}"
    output_path = f"public/{v.replace('.mp4', '-mobile.mp4')}"
    if not os.path.exists(input_path):
        continue
    print(f"Compressing {input_path} for mobile...")
    subprocess.run([
        ffmpeg_exe, "-i", input_path,
        "-vf", "scale=-2:480", 
        "-c:v", "libx264", "-crf", "35", "-preset", "faster", "-pix_fmt", "yuv420p",
        "-c:a", "copy", "-y", output_path
    ])
    print(f"Successfully compressed {output_path}")
