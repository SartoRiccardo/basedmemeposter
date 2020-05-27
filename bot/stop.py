import os
import time

open("STOP", "w").close()

while os.path.exists("./STOP"):
    time.sleep(1)

print("Mastermemed stopped.")
