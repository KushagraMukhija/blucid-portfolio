from transformers import pipeline
from PIL import Image

# Initialize the depth estimation pipeline
pipe = pipeline(task="depth-estimation", model="LiheYoung/depth-anything-small-hf")

# Load the image directly from your Next.js public folder
image = Image.open("public/car-shot.jpg")

# Generate the depth map
depth = pipe(image)["depth"]

# Save the output right next to it
depth.save("public/car-depth.jpg")
print("Depth map successfully generated.")