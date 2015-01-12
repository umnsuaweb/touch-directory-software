from PIL import Image


class Diagram:

    def __init__(self, building_slug, floor_slug, markers, width, height):
        self.markers = markers
        self.floor_slug = floor_slug
        self.width = width  # Desired scaled width.
        self.height = height  # Desired scaled height.

        if building_slug == 'cmu':
            self.original_path = 'static/images/cmu-north-floors-original/'
            self.scaled_path = 'static/images/cmu-north-floors/'
        elif building_slug == 'spsc':
            self.original_path = 'static/images/spsc-south-floors-original/'
            self.scaled_path = 'static/images/spsc-south-floors/'

        # Original image dimensions are used for reference when scaling.
        original_path = self.original_path + floor_slug + '-top.png'
        original_image = Image.open(original_path)
        self.original_dimensions = original_image.size

        # Scaled images are used for output to the user.
        scaled_path = self.scaled_path + floor_slug + '-top.png'
        scaled_image = Image.open(scaled_path)
        self.scaled_dimensions = scaled_image.size

    def _scale_coordinates(self, x, y):
        """Scale x,y coordinates from original image down to desired
           dimensions output on the screen

        """

        scale = 1.0 * self.height / self.original_dimensions[1]
        scaled_x = int(round(x*scale))
        scaled_y = int(round(y*scale))

        if self.width == 0:
            self.width = int(round(self.original_dimensions[0]*scale))

        return scaled_x, scaled_y

    def _get_diagram_category(self, categories):
        """Prevent generic category tags from being assigned to markers"""

        items = categories.split(',')
        for item in items:
            if item not in ('restroom', 'atm'):
                return item

    def add_origin(self, origin):
        left, top = self._scale_coordinates(origin['x'], origin['y'])
        self.origin = {
            'left': left,
            'top': top,
            'z': 3,
        }

    def setup_home(self):
        """Prepare a diagram for the touch directory homepage"""

        self.diagram_slug = 'home-floor-map'

        # Each of the markers offsets are defined for the original size.
        # Scale these offsets for the new dimensions
        for m in self.markers:
            if m.type == 'space':
                m.category = 'space'
            else:
                m.category = self._get_diagram_category(m.categories)

            m.left, m.top = self._scale_coordinates(m.x, m.y)

    def setup_location(self, destination, building_slug):
        """Prepare a diagram for the location detail page"""

        self.diagram_slug = 'location-details-floor-map'

        # Each of the markers offsets are defined for the original size.
        # Scale these offsets for the new dimensions
        for m in self.markers:
            m.category = self._get_diagram_category(m.categories)

            m.left, m.top = self._scale_coordinates(m.x, m.y)

        dest_x, dest_y = self._scale_coordinates(
            destination.x,
            destination.y,
        )
        self.destination = {}
        self.destination['left'] = dest_x
        self.destination['top'] = dest_y
        self.destination['z'] = destination.z

        photo_path = 'static/images/%s-photos/%s-%s.jpg' % (
            building_slug,
            destination.slug,
            destination.room,
        )
        try:
            Image.open(photo_path)
            self.destination['photo'] = '/' + photo_path
        except:
            self.destination['photo'] = None

    def setup_floor(self):
        """Prepare a diagram for the by-floor page"""

        self.diagram_slug = 'by-floor-floor-map'

        # Each of the markers offsets are defined for the original size.
        # Scale these offsets for the new dimensions
        for m in self.markers:
            m.category = self._get_diagram_category(m.categories)

            m.left, m.top = self._scale_coordinates(m.x, m.y)

    def setup_quick_find(self):
        """Prepare a diagram for the Quick Find page"""

        self.diagram_slug = self.floor_slug

        # Each of the markers offsets are defined for the original size.
        # Scale these offsets for the new dimensions
        for m in self.markers:
            m.category = self._get_diagram_category(m.categories)

            m.left, m.top = self._scale_coordinates(m.x, m.y)
