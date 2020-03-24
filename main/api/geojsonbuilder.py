import json
from main.extensions import mongo

def buildgeojson(live, date):
    entries = list(mongo.db.locations.find())
    print(entries)
    return entries if entries else 400
    