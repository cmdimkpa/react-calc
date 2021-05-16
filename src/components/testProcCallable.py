# this demo callable will receive a video chunk and calculate the charmap of the chunk
# the output will be saved to the masterNode using the key pattern: "MULTIPROC_OUTPUT_targetPrefix_jobId"

import sys
import requests as http
import json
import os
from random import random
from time import sleep
import datetime
import numpy as np 
from numpy import array
from numpy import uint8
import cv2
from tqdm import tqdm
import io

masterNodeBaseURL = "http://bus.parallelscore.io:8818/multiproc/api/v1/"
baseHeaders = { "Content-Type" : "application/json" }

def masterNode(command, key, dataObject={}):
    url = "%smasterNode/%s/%s" % (masterNodeBaseURL, command, key)
    payload = {
        "dataObject" : dataObject
    }
    resp = http.put(url, json.dumps(payload), headers=baseHeaders)
    return resp.json()

def deserialize(binary):
    memfile = io.BytesIO()
    memfile.write(binary.encode('latin-1'))
    memfile.seek(0)
    return np.load(memfile)

# data input
dataFile = sys.argv[1]
with open(dataFile, "rb") as handle:
    targetPrefix, jobId, chunk = handle.read().decode('latin-1')

try:
    chunk = deserialize(chunk); os.remove(dataFile)
except Exception as e:
    with open(dataFile, "w") as handle:
        handle.write(str(e))#str(e)



# save charmap to masterNode
key = "MULTIPROC_OUTPUT_%s_%s" % (targetPrefix, jobId)
masterNode("set", key, chunk)

# exit
sys.exit()
