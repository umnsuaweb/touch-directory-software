# Touch Directory

This is a Python/Flask port of the [Student Unions and Activities (SUA)](http://sua.umn.edu) Touch Directory application, found in [Coffman Memorial Union](http://sua.umn.edu/about/coffman/) and [St. Paul Student Center](http://sua.umn.edu/about/st-paul-student-center/).

![Preview Screenshot](https://github.umn.edu/SUA/touch-directory/raw/master/static/preview.png)

## Installation on Mac OS X

This project requires [pip](http://www.pip-installer.org/en/latest/), [virtualenv](http://www.virtualenv.org/en/latest/), [Homebrew](http://brew.sh), and [npm](https://www.npmjs.org/). If you do not have these, follow these steps:

1. `sudo easy_install pip`
2. `pip install virtualenv`
3. Use the install script from [brew.sh](http://brew.sh) for Homebrew
4. `brew install npm`

To install the application, create a new virtual environment and install the application dependencies via pip:

1. `git clone git@github.umn.edu:building-directory-project/touch-directory-software.git`
2. `virtualenv tdir`
3. `source tdir/bin/activate`
4. `cd touch-directory-software`
5. `pip install -r requirements.txt`
6. `npm install -g grunt-cli`
7. `npm install` (To install Grunt dependencies for the project.)
7. `python application.py`

Finally, open a Webkit-based browser and enter http://localhost:5000.

## Developing

[Grunt](http://gruntjs.com/getting-started) concatenates, uglifies, and minifies JavaScript. It also takes SASS and outputs compressed CSS. [Follow these instructions to install the node requirements for the project](http://gruntjs.com/getting-started#working-with-an-existing-grunt-project).

Minified JavaScript and SASS are configured in the the Gruntfile.js file. If you need to make JavaScript changes, it's a good idea to link to the unminified version. Once that's ready, you can use Grunt to create a minified version.

In order to generate new minified files simply run `grunt` from within the project directory.

## Exporting as a Desktop App

We export the HTML, CSS and JavaScript to a static site and run it as a standalone desktop application. This allows the site to run in fullscreen mode without menus.

To create a standalone desktop application, first install [TideSDK and TideSDK Developer](http://www.tidesdk.org/). Then pass an extra parameter to application.py:

`python application.py -f`

This will output the site into directories defined for each touch directory as static HTML, CSS & JavaScript.

Open the tiapp.xml file in the directory you chose for the application. Change the values so they match these:

	<?xml version='1.0' encoding='UTF-8'?>
	<ti:app xmlns:ti='http://ti.appcelerator.org'>
	<!-- These values are edited/maintained by TideSDK Developer -->
	<id>umn.sua.touch.directory.north</id>
	<name>Coffman Memorial Union North</name>
	<version>1.0</version>
	<publisher>thoma127</publisher>
	<url>http://sua.umn.edu</url>
	<icon>default_app_logo.png</icon>
	<copyright>2014 by thoma127</copyright>
	<!-- Window Definition - these values can be edited -->
	<window>
	<id>initial</id>
	<title>Coffman Memorial Union North</title>
	<url>app://index.html</url>
	<width>1360</width>
	<max-width>1360</max-width>
	<min-width>1360</min-width>
	<height>768</height>
	<max-height>768</max-height>
	<min-height>768</min-height>
	<fullscreen>false</fullscreen>
	<resizable>false</resizable>
	<chrome scrollbars="true">false</chrome>
	<maximizable>true</maximizable>
	<minimizable>false</minimizable>
	<closeable>true</closeable>
	</window>

### Things to Note

* `<fullscreen>` must be set to "false" as it is above. Otherwise TideSDK will overwrite the declaration for full screen that we make below.
* `<width>`, `<max-width>`, `<min-width>`, `<height>`, `<max-height>` & `<min-height>` values should match your hardware.

Click on the "Test & Package" tab in TideSDK Developer. 

To launch a test version, click on the "Launch App" button.

To package the app for deployment, click on the "Package with Runtime" button.

Watch the TideSDK console for the path to the new .app file. Right click on the app file and choose "Show Package Contents." (Or navigate into the Contents directory in the command line.) In the "Contents" directory is a file called `Info.plist`. Open that with a text editor and add these two lines above `NSMainNibFile`:

	<key>LSUIPresentationMode</key>
	<integer>3</integer>

Once you save the changes to Info.plist, the application will open up in fullscreen mode and hide the menu and dock. You will have to add these two lines every time you package a new app.

Note: Each time you rebuild the app, these two values will be overwritten. If you've committed a version of this file in the past, it's safe to check your old version back out again. For example:

	git checkout master tideSDK/Coffman\ Memorial\ Union\ South/packages/osx/bundle/Coffman\ Memorial\ Union\ South.app/Contents/Info.plist
	
The command above checks out an Info.plist file from the master branch, effectively restoring our earlier version.

If you want to save the .app in a repository, you'll need to create a disk image and save it there. Here is an example command for OS X:

	hdiutil create -size 118m -fs HFS+ -volname Coffman-North packaged-apps/cmu-north.dmg

* `-size` - The size of the disk image you'll need in megabytes
* `-volname` - The name you want to give your volume once it's mounted
* `packaged-apps/cmu-north.dmg` - The path where you'd like the disk image saved. Change this value accordingly.

Once you've created the disk image, mount it and copy the .app files there. You should be able to unmount it and the app will be saved in the new disk image. Commit that disk image and you can now safely push your app to github. **Note**: Github will warn you about large file sizes.

## Compatibility

As a standalone web app, this was not developed with broad browser compatibility in mind. Only Webkit-based browsers render the content accurately, including Chrome, Safari, Opera.

## Fonts

A notable omission from this repository is the fonts. Some of the fonts in use on our actual directories are licensed from a third party, and per that agreement, we cannot include them with the repository.

## Software

The core web application is built with [Flask](http://flask.pocoo.org/) and [SQLite](https://sqlite.org/).

We bundle the application's components into an app using the [TideSDK](http://www.tidesdk.org/). This process removes the URL bar, settings, and other user-friendly settings and allows the application to run fullscreen within a specified viewport.

The isometric diagrams were created using [Sketchup](http://www.sketchup.com/products/sketchup-pro), based on actual building blueprints of Coffman Union and St. Paul Student Center. These files are included in the static/sketchup/ directory.

Advertisements appear after five minutes of inactivity and are configured using standard OS X screensaver settings.

The viewport resolution is fixed at 1350x768.

Also included in our setup:

* [EvoCam](http://www.evological.com/evocam.html) (needed for motion sensor setup)

## Our Hardware

* [Mac Mini](https://www.apple.com/mac-mini/) (through Apple via UMart)
* [32" ELO 3220L Touch Screen](http://www.elotouch.com/Products/LCDs/3220L/default.asp) (through GovConnection via UMart)
* [Microsoft LifeCam](http://www.microsoft.com/hardware/en-us/p/lifecam-hd-3000/T3H-00011) (through GovConnection via UMart - needed for motion sensing)

We retrofitted the old static building directory mounts to fit the 32" ELOs standard VESA mounting holes. A few tamper proof screws and a lockable wooden box later, we had our "enclosure."

You may want to use one of these ADA compliant mounts from [Chief](http://www.chiefmfg.com/Products/MTA3241).

## Bugs

1. OS X Mavericks may [cause problems with one of the installation requirements](http://stackoverflow.com/questions/22313407/clang-error-unknown-argument-mno-fused-madd-python-package-installation-fa/22322645#22322645). If this occurs, try running the following commands and re-run step #5 above.

	`export CFLAGS=-Qunused-arguments`

	`export CPPFLAGS=-Qunused-arguments`

2. The [jinja2-htmlcompress](https://github.com/mitsuhiko/jinja2-htmlcompress) Jinja extension compresses HTML output. There is a [bug in the current version](https://github.com/mitsuhiko/jinja2-htmlcompress/issues/8) that eliminates white space next to inline Jinja output. For example:

	<!-- the space between "diagram" and {{ diagram.floor_slug }} will get lost resulting in broken styles -->
	<div class="diagram {{ diagram.floor_slug }}-diagram" style="width: {{ diagram.width }}px; height: {{ diagram.height }}px;">

	One simple workaround is to insert `{{" "}}` where you need to force a space:
	
	<div class="diagram{{ " " }}{{ diagram.floor_slug }}-diagram" style="width: {{ diagram.width }}px; height: {{ diagram.height }}px;">
	
	If you'd like to see uncompressed HTML output for debugging purposes, comment out this line in `application.py`:

	`app.jinja_env.add_extension('extensions.jinja2htmlcompress.HTMLCompress')`

3. Google Analytics tracking is not working from within an exported desktop application.
