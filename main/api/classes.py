import pymongo
import requests
import json
from main.extensions import mongo
from datetime import datetime

class Location:

    def __init__(self, coordinates, date, time, diagnosis_date, location):
        self.coordinates = coordinates
        self.date = date
        self.time = time
        self.diagnosis_date = diagnosis_date
        self.location = location
        self.access_db = mongo.db.locations
        now = datetime.now()
        self.timestamp = datetime.timestamp(now)
        self.id = str(date) + str(self.timestamp)
        

    def postLocation(self):
        ins = {'coordinates': self.coordinates, 'date': self.date, 'time':self.time, 'diagnosis_date': self.diagnosis_date, 'location': self.location}
        self.access_db.update_one({'_id': self.id}, {'$push': ins}, upsert = True)

