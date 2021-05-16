# This client performs the actions detailed in the README
# ensure you are within the /demo folder when running this script

import requests as http
import json
import os
import sys
from random import random
from time import sleep
import datetime
import numpy as np 
import cv2
from tqdm import tqdm
import io

HERE = os.getcwd()
if "\\" in HERE:
    slash = "\\"
else:
    slash = "/"
HERE += slash

masterNodeBaseURL = "http://bus.parallelscore.io:8818/multiproc/api/v1/"
baseHeaders = { "Content-Type" : "application/json" }

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)

            
# Helper functions

def now(): return datetime.datetime.today()

def serialize(data):
    memfile = io.BytesIO()
    np.save(memfile, data)
    memfile.seek(0)
    return memfile.read().decode('latin-1')

def display(done, maxJobs):
    buffer = 2
    for i in range(buffer):
        print("")
    percent_done = done/maxJobs*100
    ticks = int(percent_done)
    tick_lines = "".join(['-' for i in range(ticks)])
    status = "stream progress: %s > %.2f percent complete" % (tick_lines, percent_done)
    print(status)

def get_uid(n=6):
    return str(random()).split(".")[1][:n]

def StreamJob(targetPrefix, jobId, job):
    url = f"{masterNodeBaseURL}StreamJob"
    payload = {
        "targetPrefix" : targetPrefix,
        "jobId" : jobId,
        "job" : job
    }
    resp = http.post(url, json.dumps(payload), headers=baseHeaders)
    return resp.json()

def WorkerAction(actionType, agentType, targetPrefix, runner, callable):
    url = f"{masterNodeBaseURL}{actionType}Worker?agentType={agentType}&targetPrefix={targetPrefix}&runner={runner}&callable={callable}"
    payload = {}
    resp = http.put(url, json.dumps(payload), headers=baseHeaders)
    return resp.json()

def masterNode(command, key, dataObject={}):
    url = f"{masterNodeBaseURL}masterNode/{command}/{key}"
    payload = {
        "dataObject" : dataObject
    }
    resp = http.put(url, json.dumps(payload), headers=baseHeaders)
    return resp.json()

## PREPROCESSING

# read video directory locally and split into chunks 

videoDir, videoId = sys.argv[1:]


class VideoSplitter:
    def __init__(self, VideoDir, videoID):
        self.split_dict = {}
        self.videoID = videoID
        self.splitVideo(VideoDir)
        return

    def splitVideo(self, videodir):
        # split video into fps_sizable_chunks
        cap = cv2.VideoCapture(videodir)
        TotalFrames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        #define the codec and create videoWriter object
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        time_milli = TotalFrames/fps

        countfps = 0
        countDivision = 0
        TotalDivision = np.ceil(TotalFrames/fps)
        # videoID + videoDivisionNumber + totalDivisionInVideo + fps + width + height
        ChunkData = []
        for frameIndex, i in enumerate(tqdm(range(TotalFrames))): # TotalFrames
            ret, frame = cap.read()
            if ret== True:
                countfps += 1
                ChunkData.append(frame)

                if countfps == fps-1:
                    #save chunk and move to next chunk
                    name = self.videoID + '_' + str(countDivision) + '_' +str(TotalDivision) +'_'+ str(fps) + '_' +str(width) + '_' + str(height)
                    countDivision += 1
                    countfps = 0
                    self.split_dict[name] = ChunkData
                    ChunkData = []
                else:
                    pass
            else:
                pass
        cap.release()
        cv2.destroyAllWindows()       
        return


## STREAMING
started = now()

vsp = VideoSplitter(videoDir, videoId)
chunkedData = vsp.split_dict

chunks = []
for key in chunkedData.keys():
    jobs = [serialize(job) for job in chunkedData[key]]#[repr(job) for job in chunkedData[key]]
    chunks.extend(jobs)
num_chunks = len(chunks)

targetPrefix = "demoVideoProcessing%s" % get_uid()
runner = "python3"
procCallable = "testProcCallable.py"
aggCallable = "doNothing.py"

print("StreamingSession started. Context: ==> targetPrefix:%s, runner:%s, procCallable:%s, aggCallable:%s" % (
    targetPrefix, runner,
    procCallable, aggCallable
))
# 1. spin up a `proc` worker for the session
WorkerAction("SpinUp", "proc", targetPrefix, runner, procCallable)
print("PROC worker spun-up successfully")

# 2. stream chunks
print("Streaming started. ChunkSize:%d, NumberofChunks:%d" % (
    0, num_chunks
))

jobId = 0
for chunk in chunks:
    jobId += 1
    job = {
        "max_jobs" : num_chunks,
        "job_number" : jobId,
        "callable_fields" : ["targetPrefix", "jobId", "chunk"],
        "targetPrefix" : targetPrefix,
        "jobId" : jobId,
        "chunk" : chunk
    }
    StreamJob(targetPrefix, jobId, job)
    display(jobId, num_chunks)

# 4. spin up an `agg` worker to aggregate the stream
print("Spinning up AGG worker...")
WorkerAction("SpinUp", "agg", targetPrefix, runner, aggCallable)

# 5. wait for output
output = None
epoch = 3
epochs = 0
key = "DEMO_CHARMAP_%s" % targetPrefix
while not output:
    output = masterNode("get", key)["data"]
    sleep(epoch)
    epochs += 1
    print("retrying after %d epochs..." % epochs)

# 7. Print Result
print("Session ended. Output below:", output)

elapsed = (now() - started).total_seconds()
print("")
print("performance: processed %d chunks in %.2f seconds (%.2f chunks/sec)" % (num_chunks, elapsed, num_chunks/elapsed))




