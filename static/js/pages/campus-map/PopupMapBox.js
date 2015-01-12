
//////// Building Highlight and Popup   //////////////////////////////////////////////////////////////////

// set temp var to contain previous highlighted building
var Temp;

// highlight clicked building
function highlightBuilding(e) {
    var layer = e.target;
    if (Temp != null) ClearHighlight();
    Temp = e.target;
    layer.setStyle({color: "#CA5858", fillOpacity : 0.7});
    if (!L.Browser.ie && !L.Browser.opera) { layer.bringToFront(); }
}

// highlight clicked parking facility
function highlightParking(e) {
    var layer = e.target;
    if (Temp != null) ClearHighlight();
    Temp = e.target;
    layer.setStyle({color: "#C9C8C7", fillOpacity : 0.7});
    if (!L.Browser.ie && !L.Browser.opera) { layer.bringToFront(); }
}

// highlight clicked leisure area
function highlightGreenSpace(e) {
    var layer = e.target;
    if (Temp != null) ClearHighlight();
    Temp = e.target;
    layer.setStyle({color: "#2C7C22", fillOpacity : 0.7});
    if (!L.Browser.ie && !L.Browser.opera) { layer.bringToFront(); }
}

// unhighlight previous feature
function ClearHighlight() { Temp.setStyle({fillOpacity : 0}); }

// building popup
function BuildingFeatures(feature, layer) {
    layer.bindPopup(RenderPopup("Building", feature.properties));
    layer.on({ click : highlightBuilding });
}

// parking popup
function ParkingFeatures(feature, layer) {
    layer.bindPopup(RenderPopup("Parking", feature.properties));
    layer.on({ click : highlightParking });
}

// green space popup
function GreenSpaceFeatures(feature, layer) {
    layer.bindPopup(RenderPopup("GreenSpace", feature.properties));
    layer.on({ click : highlightGreenSpace });
    if (feature.properties.landuse == "farm" || feature.properties.sport == "equestrian" || feature.properties.leisure == "golf_course") {
        layer.setStyle({ clickable : false }); // these features are not clickable
    }
}

// campus connector popup
function ConnFeatures(feature, layer) {
    layer.bindPopup(RenderPopup("ConnStops", feature.properties));
}

// campus circulator popup
function CircFeatures(feature, layer) {
    layer.bindPopup(RenderPopup("CircStops", feature.properties));
}

// WABC popup
function WABCFeatures(feature, layer) {
    layer.bindPopup(RenderPopup("WABCStops", feature.properties));
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// main popup controller
function RenderPopup(StructureType, Attributes) {
    var PopupHTML;

    if (Attributes["addr:city"]) Attributes["addr:state"] = ", MN ";

    // eliminate "undefined" on popup if data missing
    if (!Attributes["name"]) Attributes["name"] = "";
    if (!Attributes["short_name"]) Attributes["short_name"] = "";
    if (!Attributes["addr:housenumber"]) Attributes["addr:housenumber"] = "";
    if (!Attributes["addr:street"]) Attributes["addr:street"] = "";
    if (!Attributes["addr:city"]) Attributes["addr:city"] = "";
    if (!Attributes["addr:city"]) Attributes["addr:state"] = "";
    if (!Attributes["addr:postcode"]) Attributes["addr:postcode"] = "";
    if (!Attributes["start_date"]) Attributes["start_date"] = "";
    if (!Attributes["umn:BuildingNumber"]) Attributes["umn:BuildingNumber"] = "";
    if (!Attributes["capacity"]) Attributes["capacity"] = "";
    if (!Attributes["capacity:disabled"]) Attributes["capacity:disabled"] = "";

    if (StructureType == "Parking") {
        // initial popup
        var ImageURL,
            GeneralLotRegExp = new RegExp("(C|S|SC)-[0-9]+");

        if (GeneralLotRegExp.test(Attributes["name"])) {
            ImageURL = "lib/img/Parking/" + Attributes["name"];
        } else if (Attributes.hasOwnProperty(Attributes["umn_NameAbbreviation"])) {
            ImageURL = "lib/img/Parking/" + (Attributes["umn:NameAbbreviation"]).toLowerCase();
        } else if ((new RegExp("Lot [0-9]+")).test(Attributes["name"])) {
            ImageURL = "lib/img/Parking/" + ((Attributes["name"]).toLowerCase()).replace(" ", "");
        } else if ((new RegExp("Lot$")).test(Attributes["name"])) {
            ImageURL = "lib/img/Parking/" + (((Attributes["name"]).toLowerCase()).replace(" ", "-")).replace("-lot", "");
        }

        PopupHTML =  "<div class='info-container'><div class='info-image-container'>";
        PopupHTML += "<img src='" + ImageURL + "-150w.jpg' width='150' onerror='this.src=\"lib/img/blank.gif\"' /></div>";
        PopupHTML += "<div class='info-text-container'>";
        PopupHTML += "<h3>"
        if (GeneralLotRegExp.test(Attributes["name"])) { PopupHTML += "Lot "; }
        PopupHTML += Attributes["name"] + "</a></h3>";
        PopupHTML += "<p>" + Attributes["addr:housenumber"] + " " + Attributes["addr:street"] + "<br>";
        PopupHTML += Attributes["addr:city"] + Attributes["addr:state"] + Attributes["addr:postcode"].substr(0,5);
        PopupHTML += "<br><br>Parking Spaces: " + Attributes["capacity"] + "<br>Disabled Spaces: " + Attributes["capacity:disabled"];
        PopupHTML += "</div><div class='clearfix'></div></div>";
    }

    if (StructureType == "GreenSpace") { PopupHTML = "<h3>" + Attributes["name"] + "</h3>"; }

    if (StructureType == "Building") {

        // initial popup
        PopupHTML =  "<div class='info-container'><div class='info-image-container'>";
        PopupHTML += "<img src=" + "http://www1.umn.edu/twincities/maps/" + Attributes["short_name"] + "/photo.jpg' width='150px' onerror='this.src=\"lib/img/blank.gif\"' /></div>";
        PopupHTML += "<div class='info-text-container'>";
        PopupHTML += "<h3>" + Attributes["name"] + "</h3>";
        PopupHTML += "<p>" + Attributes["addr:housenumber"] + " " + Attributes["addr:street"] + "<br>";
        PopupHTML += Attributes["addr:city"] + Attributes["addr:state"] + Attributes["addr:postcode"];
        PopupHTML += "</div><div class='clearfix'></div></div>";

        PopupHTML += '<div class="clearfix"></div></section><footer>';
        PopupHTML += '</ul></footer>';
    }

    if (StructureType == "ConnStops" || StructureType == "CircStops" || StructureType == "WABCStops") {
        PopupHTML = "<h3>" + Attributes.StopTitle + "</h3>";
    }

    return PopupHTML;
}
