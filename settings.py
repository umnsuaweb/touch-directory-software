# Global settings
DEBUG = True
TESTING = True
SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite'
FREEZING = False

DEFAULT_DIRECTORY = 'cmu_north'

CATEGORIES = {
    'restroom-men': 'Men\'s Restroom',
    'restroom-women': 'Women\'s Restroom',
    'tunnels-and-parking': 'Tunnels & Parking',
    'vending': 'Vending',
    'atm': 'ATMs',
    'phone-pay': 'Pay Phone',
    'phone-pay-tty': 'TTY Pay Phone',
    'phone-campus': 'Campus Phone',
    'kiosk': 'Internet Kiosks',
    'sua': 'SUA',
    'event-space': 'Event Space',
    'food-and-drink': 'Food & Drink',
    'shopping-and-services': 'Shopping & Services',
    'meeting-and-event-space': 'Meeting & Event Space',
    'lounge-and-study': 'Lounge & Study Space',
    'offices': 'Offices',
    'student-groups': 'Student Groups & Cultural Centers',
    'touch-directory': 'Touch Directory',
    'restroom': 'Restrooms',
    'phone': 'Phones',
    'atm-tcf': 'TCF ATM',
    'atm-wells-fargo': 'Wells Fargo ATM',
    'restroom-unisex': 'Unisex Restroom',
    'atm-us-bank': 'US Bank ATM',
    'connection-stairs-both': 'Stairs Going Up and Down',
    'connection-escalator-both': 'Impossible Escalator',
    'connection': 'Escalators Elevators and Stairs',
    'connection-elevator-both': 'Elevator Going Up and Down',
    'connection-escalator-down': 'Escalator Going Down',
    'connection-escalator-up': 'Escalator Going Up',
    'depts-and-offices': 'Departments & Offices',
    'conference-323-326': 'Conference Rooms 323-326',
    'conference-301-305': 'Conference Rooms 301-305',
    'conference-108-202': 'Conference Rooms 108-202',
    'atm-gopher-gold': 'Gopher Gold',
    'third-floor-conference-rooms': 'Third Floor Conference Rooms',
    'cmu-touch-directory-cube': 'Touch Directory Outside The Cube',
    'cmu-touch-directory-south': 'Touch Directory Near South Entrance',
    'vending-digiboo': 'Digiboo',
}
