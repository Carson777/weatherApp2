var baseURL = "https://api.darksky.net/forecast/ad12c7069e70252ac9f51aa7f1c17649"
var header = document.querySelector(".header")
//model



var DataModel = Backbone.Model.extend({
	url: function(){
		var finalURL = baseURL + '/' + this._lat + ',' + this._long + "?callback=?"
		return finalURL
	}
	
	
})



//view

var buildHeader = function(lat,long) {
	console.log("Building header")
	return "<div class='header'><a href =#now/" + lat + "/" + long + ">Now</a><a href =#hourly/" + lat + '/' + long + ">Hourly</a><a href =#daily/" + lat + '/' + long + ">Daily</a></div>"
}

var ViewCurrent = Backbone.View.extend({
	el: document.querySelector(".container"),
	_render: function(){
		this.el.innerHTML = buildHeader(this._lat,this._long) + "<div class='weather-container'><h3 class = 'currentTemp'>" + " Current Temperature: " + Math.floor(this.collection.attributes.currently.apparentTemperature) + "</h3></div>"
	},
	initialize: function(){
		console.log(this)
		console.log("making a new view")
		var boundRender = this._render.bind(this)
		this.collection.on("sync", boundRender) 
		
	}

})
var ViewHourly = Backbone.View.extend({
	el: document.querySelector(".container"),
	_render: function(){
		var placeholder = buildHeader(this._lat,this._long)
		console.log(this.collection.attributes)
		placeholder += '<div class="weather-container">'
		for(var i = 0; i < 24; i++){
			placeholder += "<div class = 'hourlyTemp'><p class = 'hourlyTime'>" + [i] + " Hours from now</p><p class = 'hourlyApparantTemp'>temp: " + Math.floor(this.collection.attributes.hourly.data[i].apparentTemperature) + "</p><p class = 'hourlyDataSummary'>" + this.collection.attributes.hourly.data[i].summary + "</p></div>"
		}
		placeholder += '</div>'	
		this.el.innerHTML = placeholder
	},
	initialize: function(){
		console.log(this)
		console.log("making a new view")
		var boundRender = this._render.bind(this)
		this.collection.on("sync", boundRender) 
		
	}
})
var ViewDaily = Backbone.View.extend({
	el: document.querySelector(".container"),
	_render: function(){
		var placeholder = buildHeader(this._lat,this._long)
		console.log(this.collection.attributes)
		placeholder += '<div class="weather-container">'
		for(var i = 0; i < 7; i++){
			placeholder += "<div class = 'dailyTemp'><p class = 'dailyTime'>" + [i] + " Days from now</p><p class = 'dailyApparantTemp'>temp: " + Math.floor(((this.collection.attributes.daily.data[i].apparentTemperatureMax + this.collection.attributes.daily.data[i].apparentTemperatureMin)/2)) + "</p><p class = 'dailyDataSummary'>" + this.collection.attributes.daily.data[i].summary +"</p></div>"
		}
		placeholder += '</div>'
		console.log("done looping")
		this.el.innerHTML = placeholder
		
	},
	initialize: function(){
		console.log(this)
		console.log("making a new view")
		var boundRender = this._render.bind(this)
		this.collection.on("sync", boundRender) 
		
	}
})
//controller
var Controller = Backbone.Router.extend({
	routes: {
			"now/:lat/:long": "handleNow",
			"hourly/:lat/:long": "handleHourly",
			"daily/:lat/:long": "handleDaily",
			"*default": "handleDefault"
	},
	handleNow: function(lat,long){
		console.log('handling now')
		var dataModel = new DataModel
		console.log('data model before fetch',dataModel)
		var viewCurrent = new ViewCurrent({
			collection: dataModel
		})

		dataModel._lat = viewCurrent._lat = lat
		dataModel._long = viewCurrent._long = long

		dataModel.fetch().then(function() {
			console.log('data model after fetch', dataModel)
		})
	},
	handleHourly: function(lat,long){
		console.log('handling Hourly')
		var dataModel = new DataModel
		console.log('data model before fetch',dataModel)
		var viewHourly = new ViewHourly({
			collection: dataModel
		})
		dataModel._lat = viewHourly._lat = lat
		dataModel._long = viewHourly._long = long


		dataModel.fetch().then(function() {
			console.log('data model after fetch', dataModel)
		})
	},
	handleDaily: function(lat,long){
		console.log('handling Daily')
		var dataModel = new DataModel
		console.log('data model before fetch',dataModel)
		var viewDaily = new ViewDaily({
			collection: dataModel
		})

		dataModel._lat = viewDaily._lat = lat
		dataModel._long = viewDaily._long = long

		dataModel.fetch().then(function() {
			console.log('data model after fetch', dataModel)
		})
	},
	
	handleDefault: function(){
		console.log('handling default')
		var coordsHandler = function(responseObject){
			var lat = responseObject.coords.latitude
			var long = responseObject.coords.longitude
			location.hash = "now/" + lat + '/' + long
		}
		navigator.geolocation.getCurrentPosition(coordsHandler)

	},

	initialize: function(){
		Backbone.history.start()
	}
})

var controller = new Controller()
//navigator.geolocation.getCurrentPosition(getCoords)