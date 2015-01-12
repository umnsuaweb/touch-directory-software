from application import db


class EMSRooms(db.Model):
    __tablename__ = 'EMSRooms'

    id = db.Column(db.Integer, primary_key=True)
    room = db.Column(db.String(100))
    location_id = db.Column(db.Integer, db.ForeignKey('Locations.id'))
    location = db.relationship('Locations', backref=db.backref('EMSRooms', uselist=False))

    def __repr__(self):
        return self


class Locations(db.Model):
    __tablename__ = 'Locations'

    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime)
    last_modified = db.Column(db.DateTime)
    title = db.Column(db.String(255))
    slug = db.Column(db.String(255), unique=True)
    description_short = db.Column(db.String(255))
    description_long = db.Column(db.Text)
    room = db.Column(db.String(255))
    type = db.Column(db.String(255))
    x = db.Column(db.Integer)
    y = db.Column(db.Integer)
    z = db.Column(db.Integer)
    building_slug = db.Column(db.String(255))
    floor_slug = db.Column(db.String(255))
    categories = db.Column(db.String(255)) # These are ordered to represent rank

    def __repr__(self):
        return self.slug
