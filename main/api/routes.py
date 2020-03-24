from flask import Blueprint, request, jsonify, session
from .geojsonbuilder import buildgeojson
from . import classes
from flask import session

mod = Blueprint('api', __name__)

@mod.route('/all')
def allLocations():
    '''Returns all Locations'''
    return buildgeojson(True, '')

@mod.route('/new_location/<coordinates>', methods = ['POST'])
def postLocation(coordinates):
    '''Posts New Location'''
    print('posting location')
    print(type(coordinates[0]))
    location = classes.Location(coordinates = coordinates, date = 'Test', time= 'time', diagnosis_date = 'NOW', location = 'Supermarket')
    location.postLocation()
    return '200'
