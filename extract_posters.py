import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

videos = ["hero.mp4", "gulabi.mp4", "inte.mp4", "intezaar.mp4", "aarzoo.mp4"]
for v in videos:
    input_path = f"public/{v}"
    output_path = f"public/{v.split('.')[0]}-poster.jpg"
    print(f"Extracting poster for {input_path}...")
    subprocess.run([
        ffmpeg_exe, "-ss", "00:00:00.000", "-i", input_path,
        "-vframes", "1", "-q:v", "2", "-y", output_path
    ])
    print(f"Successfully created {output_path}")
