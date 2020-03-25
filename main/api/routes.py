from flask import Blueprint, request, jsonify, session
from .geojsonbuilder import buildgeojson
from . import classes
from flask import session

mod = Blueprint('api', __name__)

@mod.route('/all')
def allLocations():
    '''Returns all Locations'''
    return buildgeojson(True, '')

@mod.route('/new_location', methods = ['GET', 'POST'])
def postLocation():
    '''Posts New Location'''
    print('posting location')
    #print(request.form['coordinates'])
    print(request.form['location'])
    #location = classes.Location(coordinates = coordinates, date = 'Test', time= 'time', diagnosis_date = 'NOW', location = 'Supermarket')
    #location.postLocation()
    return '200'
