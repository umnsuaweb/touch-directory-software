import sys
import getopt
import importlib
from datetime import datetime

from flask import Flask, render_template, abort
from flask.ext.sqlalchemy import SQLAlchemy
from flask_frozen import Freezer
from slugify import slugify

import models
from diagram import Diagram


app = Flask(__name__)
app.jinja_env.add_extension('extensions.jinja2htmlcompress.HTMLCompress')

db = SQLAlchemy(app)

# Get command line input.
try:
    opts, args = getopt.getopt(sys.argv[1:], "d:f")
except getopt.GetoptError as err:
    print(err)
    sys.exit(2)

# Load application-wide settings.
app.config.from_object('settings')

# Load directory-specific configuration. cmu_north is the default.
config = None
package = 'config.%s' % app.config['DEFAULT_DIRECTORY']
for o, a in opts:
    if o == "-d":
        package = 'config.%s' % a
try:
    config = importlib.import_module(package, '*')
except ImportError:
    print 'Configuration for directory "%s" not found.' % a
    sys.exit(2)
params = {k: v for k, v in config.__dict__.items() if not k.startswith('__')}
app.config.update(**params)

# Load Frozen Flask settings (optional)
for o, a in opts:
    if o == '-f':
        app.config['FREEZING'] = True
        destination_string = 'tideSDK/%s %s/Resources' % (app.config['BUILDING_NAME'], app.config['DIRECTORY_LOCATION'])
        app.config['FREEZER_DESTINATION'] = destination_string
        app.config['DEBUG'] = False
freezer = Freezer(app)


@app.template_filter('deslugify')
def deslugify(slug):
    """Turn a slug into human speak"""
    return slug.replace('-', ' ').title()


@app.template_filter('tidesrc')
def tidesrc(path):
    """Prepend 'app:/ onto paths to make them work in the TideSDK app when we
    run python application.py -f.

    This way paths like '/static/js/script.js' turn into
    'app://static/js/script.js'
    """
    if app.config['FREEZING']:
        return 'app:/%s' % path

    return path

@app.template_filter('tidehref')
def tidehref(path):
    """Wrap href paths with 'app:/' and 'index.html' so all links point to
    static files to make them work in the TideSDK app when we run python
    application.py -f.

    This way paths like '/view-location/123/' turn into
    'app://view-location/123/index.html'
    """
    if app.config['FREEZING']:
        return 'app:/%sindex.html' % path

    return path

@app.template_filter('tide_after_href')
def tide_after_href(path):
    """Wrap href paths with 'app:/' and 'index.html' so all links point to
    static files to make them work in the TideSDK app when we run python
    application.py -f.

    This way paths like '/view-location/123/' turn into
    'app://view-location/123/index.html'
    """
    if app.config['FREEZING']:
        return '%sindex.html' % path

    return path


@app.route('/')
def home():
    """Directory default page"""

    markers = models.Locations.query \
        .filter_by(building_slug=app.config['BUILDING_SLUG']) \
        .filter_by(floor_slug=app.config['DEFAULT_FLOOR']) \
        .all()

    spaces = models.Locations.query \
        .filter_by(building_slug=app.config['BUILDING_SLUG']) \
        .filter_by(type='space') \
        .filter(~models.Locations.title.contains('Conference Room')) \
        .filter(~models.Locations.title.contains('Lounge')) \
        .filter(models.Locations.title != '') \
        .all()

    # Remove articles for easier alphabetical scanning for humans.
    for s in spaces:
        if s.title.startswith('The'):
            s.title = s.title.replace('The ', '')

    # Building-specific tweaks
    if app.config['BUILDING_SLUG'] == 'cmu':
        width = 640
        height = 401
        spaces.append({
            'title': 'Conference Rooms',
            'room': '301-305, 319, 323-326',
            'url': '/by-floor/third-floor/',
        })
    elif app.config['BUILDING_SLUG'] == 'spsc':
        width = 800
        height = 502
        spaces.append({
            'title': 'Conference Rooms',
            'room': '108-110, 202',
            'url': '/by-category/conference-108-202',
        })

    home_diagram = Diagram(
        building_slug=app.config['BUILDING_SLUG'],
        floor_slug=app.config['DEFAULT_FLOOR'],
        markers=markers,
        width=width,
        height=height,
    )
    home_diagram.setup_home()
    home_diagram.add_origin(app.config['ORIGIN'])

    return render_template(
        'home.html',
        current_floor=app.config['DEFAULT_FLOOR'],
        title=app.config['BUILDING_NAME'] + ' Building Directory',
        spaces=spaces,
        diagram=home_diagram,
        floor_selector=True,
        nav=False,
        time=datetime.now(),
    )


@app.route('/view-location/<location_id>/')
def location(location_id):
    """Location detail page"""

    result = models.Locations.query.get(location_id)
    if not result:
        abort(404)

    markers = models.Locations.query \
        .filter_by(building_slug=app.config['BUILDING_SLUG']) \
        .filter_by(type='object') \
        .filter_by(floor_slug=result.floor_slug) \
        .filter(models.Locations.categories.contains('connection')) \
        .all()

    # Location diagrams use height=515 and proportional width.
    location_diagram = Diagram(
        building_slug=app.config['BUILDING_SLUG'],
        floor_slug=result.floor_slug,
        markers=markers,
        width=0,
        height=515,
    )
    location_diagram.setup_location(result, app.config['BUILDING_SLUG'])
    if result.floor_slug == app.config['DEFAULT_FLOOR']:
        location_diagram.add_origin(app.config['ORIGIN'])

    return render_template(
        'location.html',
        title='Location Details',
        destination=result,
        destination_floor=result.floor_slug,
        diagram=location_diagram,
        nav=True,
        floor_selector=True,
        time=datetime.now(),
    )


@freezer.register_generator
def location():
    """URL Generator for location detail pages"""

    print "Building links for spaces."

    spaces = models.Locations.query \
        .filter_by(building_slug=app.config['BUILDING_SLUG']) \
        .filter_by(type='space') \
        .filter(models.Locations.title != '') \
        .all()

    for s in spaces:
        yield {'location_id': s.id}


@app.route('/by-floor/<floor_slug>/')
def floor(floor_slug):
    """Floor detail page"""

    column_count = 1
    rows_per_column = 20
    columnar_spaces = []

    results = models.Locations.query \
        .filter_by(floor_slug=floor_slug) \
        .all()

    if not results:
        abort(404)

    markers = models.Locations.query \
        .filter_by(building_slug=app.config['BUILDING_SLUG']) \
        .filter_by(type='object') \
        .filter_by(floor_slug=floor_slug) \
        .all()

    spaces = models.Locations.query \
        .filter_by(building_slug=app.config['BUILDING_SLUG']) \
        .filter_by(type='space') \
        .filter_by(floor_slug=floor_slug) \
        .order_by(models.Locations.title) \
        .all()

    if len(spaces) > rows_per_column:
        column_count = int(len(spaces)/rows_per_column) + 1
        x = 0
        current_column = 0

        # Create a separate list for each column
        for i in range(0, column_count):
            columnar_spaces.append([])

        for space in spaces:
            columnar_spaces[current_column].append(space)
            x = x + 1

            # if the index of the current space is divisible by
            # rows_per_column, move to the next column
            if x % rows_per_column == 0:
                current_column = current_column + 1
    else:
        columnar_spaces.append(spaces)

    # Floor diagrams use height=565 and proportional width.
    floor_diagram = Diagram(
        building_slug=app.config['BUILDING_SLUG'],
        floor_slug=floor_slug,
        markers=markers+spaces,
        width=0,
        height=565,
    )
    floor_diagram.setup_floor()
    if floor_slug == app.config['DEFAULT_FLOOR']:
        floor_diagram.add_origin(app.config['ORIGIN'])

    return render_template(
        'by-floor.html',
        title=deslugify(floor_slug),
        destination_floor=floor_slug,
        diagram=floor_diagram,
        columnar_spaces=columnar_spaces,
        column_count=column_count,
        nav=True,
        floor_selector=True,
        time=datetime.now(),
        floor_slug=floor_slug,
    )


@freezer.register_generator
def floor():
    """URL Generator for floor detail pages"""

    print "Building links for floors."

    for floor_name in app.config['FLOORS']:
        yield {'floor_slug': slugify(floor_name)}


@app.route('/quick-find/<quick_find_slug>/')
def quick_find(quick_find_slug):
    """Quick find page"""

    # Always exclude non-public areas of Coffman (4th, 5th floors)
    results = models.Locations.query \
        .filter_by(building_slug=app.config['BUILDING_SLUG']) \
        .filter(models.Locations.categories.contains(quick_find_slug)) \
        .filter(models.Locations.floor_slug != 'fourth-floor') \
        .filter(models.Locations.floor_slug != 'fifth-floor') \
        .all()

    if not results:
        abort(404)

    # Hack results to filter out generic category matches (ex "restroom")
    for r in results:
        categories = r.categories.split(',')
        if 'restroom' in categories:
            categories.remove('restroom')
            r.categories = ','.join(categories)

    # Determine distinct floors in the results
    floor_slugs = []
    for f in app.config['FLOORS']:
        for r in results:
            if slugify(f) == r.floor_slug and slugify(f) not in floor_slugs:
                floor_slugs.append(r.floor_slug)

    # Order them as they are in the building
    floor_slugs = floor_slugs[::-1]

    # Build a list of diagrams to scroll over
    diagrams = []
    for floor_slug in floor_slugs:
        markers = [r for r in results if r.floor_slug == floor_slug]

        # Quick Find diagrams use height=565 and proportional width.
        quick_find_diagram = Diagram(
            building_slug=app.config['BUILDING_SLUG'],
            floor_slug=floor_slug,
            markers=markers,
            width=0,
            height=565,
        )
        quick_find_diagram.setup_quick_find()

        diagrams.append(quick_find_diagram)

    # Build category matches by floor
    floor_finders = []
    for floor_slug in floor_slugs:
        if floor_slug not in floor_finders:
            floor_finders.append(floor_slug)

    # Determine the number of results in each floor
    floor_counts = {}
    for r in results:
        if r.floor_slug not in floor_counts.keys():
            floor_counts[r.floor_slug] = 0
        floor_counts[r.floor_slug] += 1

    # Build legend with distinct categories
    legend_categories = []
    legend_exceptions = ['atm', 'restroom']
    for r in results:
        category = r.categories.split(',')[0]
        if category not in legend_categories and category not in legend_exceptions:
            legend_categories.append(category)

    return render_template(
        'quick-find.html',
        title=deslugify(app.config['DEFAULT_FLOOR']),
        category=quick_find_slug,
        diagrams=diagrams,
        floor_finders=floor_finders,
        floor_counts=floor_counts,
        legend_categories=legend_categories,
        nav=True,
        is_quick_find_page=True,
        time=datetime.now(),
    )


@freezer.register_generator
def quick_find():
    """URL Generator for quick find pages"""

    print "Building links for quick find pages."

    for qf in [
            'restroom',
            'vending',
            'atm',
            'kiosk',
            'tunnels-and-parking',
            'phone',
            ]:
        yield {'quick_find_slug': qf}


@app.route('/find-event/')
def events():
    """Event listing page"""

    emsrooms = models.EMSRooms().query.all()

    return render_template(
        'events.html',
        title='Today\'s Events',
        ems_rooms=emsrooms,
        nav=True,
        time=datetime.now(),
    )


@app.route('/campus-map/')
def map():
    """Campus map page"""

    latitude, longitude = app.config['COORDINATES']
    zoom = 19

    return render_template(
        'map.html',
        title='Campus Map',
        latitude=latitude,
        longitude=longitude,
        zoom=zoom,
        nav=True,
        time=datetime.now(),
    )


if __name__ == '__main__':
    if app.config['FREEZING']:
        freezer.freeze()
    else:
        app.run()
