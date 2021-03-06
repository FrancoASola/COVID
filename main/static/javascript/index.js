
// Style for Vector Layer
var styleCache = {};
var date = ''
const red = 'rgba(244, 52, 52, 0.8)'
const green = 'rgba(14, 138, 47, 0.8)'
var styleFunction = function(feature) {
  var scores = feature.get('score')
  var score = parseInt(scores.substr(0)) + parseInt(scores.substr(4))
  var radius = 10 + score;
  var style = styleCache[radius];
  if (!style) {
    style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
          color: red
        }),
      })
    });
    styleCache[radius] 
  }
  return style;
};

// Vector Source and Layer
var vectorSource = new ol.source.Vector({
})

var vector = new ol.layer.Vector({
  source : vectorSource,
  style: styleFunction
});

//Query Locations 
var params = {
  cache: false,
  type: "GET",
  success: function(data){
      // If response is valid
      var geojsonFormat = new ol.format.GeoJSON({ featureProjection: 'EPSG:3857', extractStyles: false });
      // reads and converts GeoJSon to Feature Object
      var features = geojsonFormat.readFeatures(data);
      vectorSource.clear()
      vectorSource.addFeatures(features);
      map.render()
  },
};

function getCurrentLocations(){
  if (date) {
    params.url = `api/finished/soccer/${date}`;
    params.complete = '';
  } else {
    params.url = '/api/all';
    params.complete = function() {
      // Schedule the next request when the current one's complete
      setTimeout(getCurrentLocations, 30000);
    };
  }
  $.ajax(params);
}

//Create Map
var customRes = [156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875, 4891.969809375, 2445.9849046875, 1222.99245234375, 611.496226171875, 305.7481130859375, 152.87405654296876, 76.43702827148438, 38.21851413574219, 19.109257067871095, 9.554628533935547, 4.777314266967774, 2.388657133483887, 1.1943285667419434, 0.5971642833709717,0.41999977320012255, 0.2799998488000817,0.13999992440004086, 0.08399995464002451, 0.05599996976001634, 0.02799998488000817] 
var raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

var map = new ol.Map({
  interactions : ol.interaction.defaults({doubleClickZoom :false}),
  layers: [raster, vector],
  target: 'map',
  view: new ol.View({
    resulotions: customRes,
    center: [1600000, 1700000],
    resolution: 50000
  })
});

map.render()

//Info Tooltip
var info = $('#info');
info.tooltip({
  animation: false,
});

var displayFeatureInfo = function(pixel) {
  var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
    return feature;
  });
  if (feature) {
    info.css({
      left: pixel[0] + 'px',
      top: (pixel[1] + $('#navbar').height()) + 'px',
    });
    info.tooltip('hide')
        .attr('data-original-title', feature.get('info'))
        .tooltip('show');
  } else {
    info.tooltip('hide');
  }
};

map.on('pointermove', function(evt) {
  if (evt.dragging) {
    info.tooltip('hide');
    return;
  }
  displayFeatureInfo(map.getEventPixel(evt.originalEvent));
});

map.on('click', function(evt) {
  displayFeatureInfo(evt.pixel);
});

//Open Form for specific location
var coordinates
map.on('dblclick', function(evt){
    coordinates = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    $('#formbox').css({
      top: $('#navbar').height(),
    }),
    document.getElementById("formbox").style.display = "block";
});

//Submit Form
$('#submitButton').on('click', function(){
  $.ajax({
    type: 'POST',
    url: `api/new_location`,
    data: {'coordinates': coordinates, 
    'date': $('#datepick_visit').val(), 
    'diagnosis': $('#datepick_diagnosis').val(), 
    'location': $("#location").val()}
  });
});

//Open Form for specific location
$('#closeForm').on('click', function () {
  document.getElementById("formbox").style.display = "none";
});

//Calendars
//check specific dates
$('#picker').datetimepicker({
  timepicker: false,
  datepicker: true,
  format: 'yy-m-d', // formatDate
  closeOnDateSelect: true,
  theme: 'dark',
  yearStart:'2017',
  allowBlank: true,
  validateOnBlur: false,
  forceParse: false
});

//location visit
$('#datepick_visit').datetimepicker({
  timepicker: true,
  datepicker: true,
  closeOnDateSelect: true,
  theme: 'dark',
  yearStart:'2019',
  allowBlank: true,
  validateOnBlur: false,
  forceParse: false
});

//covid diagnosis (need to be able to leave blank)
$('#datepick_diagnosis').datetimepicker({
  timepicker: true,
  datepicker: true,
  closeOnDateSelect: true,
  theme: 'dark',
  yearStart:'2019',
  allowBlank: true,
  validateOnBlur: false,
  forceParse: false
});

//On Submit Date (Need to speed up this process on server side)
$('#datesubmit').on('click', function () {
  var d = $('#picker').datetimepicker('getValue');
  var year = (d.getFullYear()).toString();
  var mm = (d.getMonth() + 1).toString();
  if (mm.length < 2){
    mm = '0'+mm
  }
  var dd = (d.getDate()).toString();
  if (dd.length < 2){
    dd = '0'+dd
  }
  date = `${year}-${mm}-${dd}`
  vectorSource.clear()
  window.history.pushState({'title' : date}, 'Finished Games', date);
  getCurrentGoals()
});


