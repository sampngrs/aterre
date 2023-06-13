
def get_current_time():
	return{'time': time.time()}
from datetime import datetime
import json
import math
from flask import Flask, redirect
import requests
import pandas as pd
import urllib.parse
import pgeocode
import json
import pandas as pd
import os
import reverse_geocoder as rg
import geopandas as gpd


app = Flask(__name__)

@app.route('/time')
def get_current_time():
	now = datetime.now()
	time = now.strftime("%H:%M:%S")
	return {
		'time': time,
		'location': "London, United Kingdom"
	}

@app.route('/time/<postcode>')
def get_current_location(postcode):

	return getLatLong(postcode)

def getLatLong(postcode):
	url = 'https://nominatim.openstreetmap.org/search/' + urllib.parse.quote(postcode) +'?format=json'
	# nomi = pgeocode.Nominatim('GB')
	# data = nomi.query_postal_code(postcode)
	# print(data)
	# if (51.258477 <= data.latitude <= 51.721924) & (-0.546570 <= data.longitude <= 0.285645):
	# 		return redirect('/surrounding/{}/{}'.format(data.latitude, data.longitude))
	# else:
	# 		return {'response': 'The location is not in London!'}, 504

	response = requests.get(url)
	if response.status_code == 200: 
		# -0.546570,51.258477,0.285645,51.721924
		latitude = float(response.json()[0]["lat"])
		longitude = float(response.json()[0]["lon"])
		if (51.258477 <= latitude <= 51.721924) & (-0.546570 <= longitude <= 0.285645):
			return redirect('/surrounding/{}/{}'.format(response.json()[0]["lat"], response.json()[0]["lon"]))
		else:
			return {'response': 'The location is not in London!'}, 504
	else:
		return {'response': 'error'}, 504


@app.route('/surrounding/<lat>/<lon>')
def get_transport(lat, lon):
	overpass_url = "http://overpass-api.de/api/interpreter"
	overpass_query = """
	[out:json][timeout:100];
	(
	  nwr["amenity"~"bar|biergarten|cafe|fast_food|food_court|ice_cream|pub|restaurant"]["name"]{0};
	  nwr["amenity"~"school|university|library|bank|hospital"]["name"]{0};
	  nwr["shop"~"bakery|department_store|general|kiosk|mall|supermarket|wholesale|chemist"]["name"]{0};
	  nwr["leisure"]['name']{0};				
	  nw["shop"~"convenience|supermarket"]["name"]{0};
	  node["public_transport"="station"]{1};
	  relation["public_transport"="station"]{1};
	);
	out center;
	>;
	""".format("(around: 1000, {0}, {1} )".format(lat,lon), "(around: 1000, {0}, {1} )".format(lat,lon))

	response = requests.get(overpass_url, params={'data': overpass_query})
	data = response.json() 
	data['search'] = {
	'time': '',
	'location':{
	"lat": lat, 
	"lon": lon 
	}}
	type(data)
    
	results = rg.search((lat, lon)) # default mode = 2
	
	for x, i in enumerate(data['elements']):
		if ('public_transport' in i['tags']):
			if i['tags']['name'] in [os.path.splitext(x)[0] for x in os.listdir('static/Data/Sets/Transport')]: 
				bbb = pd.read_excel(f"static/Data/Sets/Transport/{i['tags']['name']}.xlsx",index_col=0)
				data['elements'][x]['crowding'] = [{'time': x[0:4], 'value': round(y.iloc[0]), 'mean': round(y.iloc[1])} for x, y in bbb.items() if y.iloc[1] != 'Mean']
		if(i['type'] == 'node'):
			data['elements'][x]['bearing'] = calc_bearing(float(lat), float(lon), data['elements'][x]['lat'], data['elements'][x]['lon'] )            

	return data

	

	# else:
		# return {'response': 'error'}, 504

# if __name__ == '__main__':
#     app.run(host='127.0.0.01', port=5000)

@app.route('/access/<code>')
def get_proximity(code):
	
	filename = os.path.join(app.static_folder, 'Data', 'stops_new.json')

		
	with open(filename) as test_file:
		data = json.load(test_file)

	timingList = []
        
	for x in code.split(','):
		
		if x not in data:
			continue
			
		timings = bfs(data, x)
		df = pd.DataFrame.from_dict(timings[1], orient='index', columns = ['time'])
		ass = pd.DataFrame.from_dict(data, orient='index')
		ass = ass.drop(('adj'), axis = 1)

		df = pd.concat([ass, df], axis = 1, join = "inner")
		timings = pd.DataFrame(df.groupby(['time'])['time'].count())
		timings.rename(columns={"time": x}, inplace=True)
		timingList.append(timings)
		
	frame = pd.concat(timingList, axis=1).fillna(0).sort_index()
	print(frame)

	form_dic = frame.rename(columns = {x[1]:x[0] for x in [i for i in enumerate(frame.columns)]}).to_dict('index')

	result =  [
	{
	'id': 'transport', 
	'type':'area',
	'title': 'Travel Time', 
	'data': {'legend': {x[0]:x[1] for x in [i for i in enumerate(frame.columns)]}, 
	'axes': [{'x': x, 'data': y} for x, y in form_dic.items()]}
	}
	]

	# return {'response': 'error'}, 504

	return result


@app.route('/crime/<lat>/<lon>')
def get_crime(lat,lon):


	# shapes = gpd.read_file('static/data/London-wards-2018_ESRI/London_Ward.shp'
	shapes = gpd.read_file('static/Voting Wards/london_voting_wards.shp')
	point = gpd.GeoSeries.from_xy([lon], [lat], crs="EPSG:4326")
	area = shapes[shapes.geometry.contains(point.iloc[0])].iloc[0].replace('.', '')
	filename = '{}.csv'.format(area['Ward'].replace('.', ''))
	# return pd.read_csv('static/crime/{}'.format(filename)).to_json(orient='records')
	
	# Integrate looping through file system to find data rather than it being hardcoded. 
	
	return [
		{
	'id': 'jobs', 
	'type':'line',
	'title': 'Employment by Sector', 
	'area': area['Borough'].replace('.', ''),
	'data': parse_data(sort_data(pd.read_csv("static/Data/Sets/Jobs/Borough/{}.csv".format(area['Borough'])).drop('Unnamed: 0', axis = 1)).to_json(orient='columns'))}
	,
	{
	'id': 'crime', 
	'type':'line',
	'title': 'Crime by Type', 
    'area': area['Ward'].replace('.', ''),
	'data': parse_data(sort_data(flatten(pd.read_csv('static/Data/Sets/Crime/Ward/{}.csv'.format(area['Ward'].replace('.', ''))))).to_json(orient='columns'))}
	]


def flatten(data):
	x = data.groupby(['LookUp_BoroughName','WardCode', 'WardName', 'MajorText']).sum().drop('Unnamed: 0', axis = 1).reset_index()
	return x

def bfs(Adj, s):  # Adj: adjacency list, s: starting vertex
    parent = dict.fromkeys(Adj, None)
    parent[s] = s  # O(1) root
    dist = {}
    dist[s] = 0
    levels = [[s]]  # O(1) initialize levels
    while levels[-1]:  # O(?) last level contains vertices
        frontier = []  # O(1), make new level
        for u in levels[-1]:  # O(?) loop over last full level
            for v in Adj[u]['adj']:  # O(Adj[u]) loop over neighbors
                if Adj[u]['adj'][v]['time'] is not None and (parent[v] is None or (dist[u] + Adj[u]['adj'][v]['time'] < dist[v])):  # O(1) parent not yet assigned
#                 if parent[v] is None:  # O(1) parent not yet assigned
                    parent[v] = u  # O(1) assign parent from levels[-1]
                    
                    if Adj[u]['adj'][v]['time'] is not None: 
                        dist[v] = dist[u] + Adj[u]['adj'][v]['time']
                    else: 
                        dist[v] = dist[u] + 1

                    frontier.append(v)  # O(1) amortized, add to border
        levels.append(frontier)  # add the new level to levels
    return parent, dist


def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

def parse_data(data):
    n_c = []
    n_json = {}
    
    for item, record in json.loads(data).items():
    
        if item.isnumeric():
            n_c.append({'date': item, 'data': record})

        else:
            n_json[item] = record

    n_json['axes'] = n_c
    n_json['legend'] = n_json['MajorText']
    print(n_json['legend'])
    return n_json

def sort_data(data):
    df = data
    df['sum'] = df.sum(axis = 1)
    df = df.sort_values('sum', ascending = True).reset_index(drop = True).drop('sum', axis = 1)
    return df
    
@app.get('/shutdown')
def shutdown():
    shutdown_server()
    return 'Server shutting down...'




def calc_bearing(lat1, long1, lat2, long2):
  # Convert latitude and longitude to radians
  lat1 = math.radians(lat1)
  long1 = math.radians(long1)
  lat2 = math.radians(lat2)
  long2 = math.radians(long2)
  
  # Calculate the bearing
  bearing = math.atan2(
      math.sin(long2 - long1) * math.cos(lat2),
      math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(long2 - long1)
  )
  
  # Convert the bearing to degrees
  bearing = math.degrees(bearing)
  
  # Make sure the bearing is positive
  bearing = (bearing + 360) % 360
  
  return bearing