var margin = { top: 20, right: 100, bottom: 100, left: 100 };
var width = 1500 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
var color = d3.scaleThreshold().
domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8)).
range(d3.schemeBlues[9]);
var g = d3.select("#display").append("svg").
attr("width", width + margin.left + margin.right).
attr("height", height + margin.top + margin.bottom).
append("g").
attr("transform", "translate(" + margin.left + "," + margin.top + ")");
legendScale = d3.scaleBand().
domain(["3%", "12%", "21%", "30%", "39%", "48%", "57%", "66%", "100%"]).
range([0, 400]);
var legend = d3.select("#legend").append("svg").
attr("width", 400).
attr("height", 100).
append("g");
var rect = legend.selectAll("rect").
data(d3.schemeBlues[9]).
enter().
append("rect").
attr("width", 400 / 9).
attr("height", 50).
attr("x", function (d, i) {return i * 400 / 9;}).
attr("y", 0).
attr("fill", function (d) {return d;});
var xAxis = d3.axisBottom(legendScale).
tickValues(["3%", "12%", "21%", "30%", "39%", "48%", "57%", "66%"]);
legend.append("g").call(xAxis).attr("transform", "translate(22.22,50)");

var tooltip = d3.select("body").append("div").
attr("class", "tooltip").
attr("id", "tooltip").
style("opacity", 0);


var path = d3.geoPath();
var unemployment = d3.map();


d3.json('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json').then(function (us) {
  d3.json('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json').then(function (education) {
    g.append("g").
    attr("class", "counties").
    selectAll("path").
    data(topojson.feature(us, us.objects.counties).features).
    enter().append("path").
    attr("class", "county").
    attr("data-fips", function (d) {
      return d.id;
    }).
    attr("data-education", function (d) {
      var result = education.filter(function (obj) {
        return obj.fips == d.id;
      });
      if (result[0]) {
        return result[0].bachelorsOrHigher;
      }
      return 0;
    }).
    attr("fill", function (d) {
      var result = education.filter(function (obj) {
        return obj.fips == d.id;
      });
      if (result[0]) {
        return color(result[0].bachelorsOrHigher);
      }
      return color(0);
    }).
    attr("d", path).
    on("mouseover", function (d) {
      tooltip.style("opacity", .9);
      tooltip.html(function () {
        var result = education.filter(function (obj) {
          return obj.fips == d.id;
        });
        return result[0]['area_name'] + ', ' + result[0]['state'] + ': ' + result[0].bachelorsOrHigher + '%';
      }).
      attr("data-education", function () {
        var result = education.filter(function (obj) {
          return obj.fips == d.id;
        });
        if (result[0]) {
          return result[0].bachelorsOrHigher;
        }
      }).
      style("left", d3.event.pageX + 10 + "px").
      style("top", d3.event.pageY - 28 + "px");}).
    on("mouseout", function (d) {
      tooltip.style("opacity", 0);
    });

  }).catch(function (err) {return console.log(err);});
}).catch(function (err) {return console.log(err);});