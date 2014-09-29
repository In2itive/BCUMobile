(function (global) {
    var map,
        LocationViewModel,
        app = global.app = global.app || {},
    	_mapElem,
    	_mapObj,
    	_private,
        _mapLat,
        _mapLng,
        _doneShow = false,
    	_isOnline = true; 
    
 	//Private methods
	_private = {
		getLocation: function(options) {
			var dfd = new $.Deferred();         
            
			//Default value for options
			if (options === undefined) {
				options = {maximumAge: 10000, timeout: 60000, enableHighAccuracy: true};
			}
         
			navigator.geolocation.getCurrentPosition(
				function(position) { 
					dfd.resolve(position);
                    //dfd.resolve({"coords":{"latitude":43.72744458647466,"longitude":-79.5245361328125,"accuracy":150,"altitude":100,"heading":null,"speed":0,"altitudeAccuracy":80},"timestamp":"2014-07-07T13:17:52.285Z"}); 

                    console.log(JSON.stringify(position));
				}, 
				function(error) {
                    //alert("I have errors with Geo.");
					//dfd.reject(error);
                    //lets default something central
                    dfd.resolve({"coords":{"latitude":43.72744458647466,"longitude":-79.5245361328125,"accuracy":150,"altitude":100,"heading":null,"speed":0,"altitudeAccuracy":80},"timestamp":"2014-07-07T13:17:52.285Z"}); 
				}, 
				options);

			return dfd.promise();
		},
		
		initMap: function(position) {
			//Delcare function variables
			var myOptions,
    			mapObj = _mapObj,
    			mapElem = _mapElem,
    			pin,
    			locations = [],
                latlng,
                count;

			_mapElem = mapElem; //Cache DOM element
            
            console.log("private initMap");
                
			// Use Google API to get the location data for the current coordinates
			latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				
			myOptions = {
				zoom: 11,
				center: latlng,
				mapTypeControl: false,
				navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};    
			mapObj = new google.maps.Map(mapElem, myOptions);
			_mapObj = mapObj; //Cache at app level
			    
			pin = [
				{
					position: latlng,
					title: "Your Location"
				}
			];

			_private.addMarkers(pin, mapObj);
            
            app.locationService.viewModel.branchList.fetch(function() {
            
                var result = app.locationService.viewModel.branchList.data();
                count = result.length,
                console.log("branch-view.js initmap branchlist", app.locationService.viewModel.branchList.data(), count);
    			pinImage = new google.maps.MarkerImage(
                                    "images/bcu-sprite.png",
                                    new google.maps.Size(49, 49),
                                    new google.maps.Point(0, 202)
                                    );
    
    			for (var i = 0; i < count; i++) {
    				locations.push({
    					title: result[i].name + " : " + result[i].address1 + ", " + result[i].address2,
    					position: new google.maps.LatLng(result[i].latitude, result[i].longitude),
                        icon: pinImage,
    					animation: google.maps.Animation.DROP
    				});
    			}
    
    			_private.addMarkers(locations, mapObj);
                
                })
            
		},
        
		addMarkers: function(locations, mapObj) {
			var marker,
			    currentMarkerIndex = 0;
            
            function createMarker(index) {
				if (index < locations.length) {
					var tmpLocation = locations[index];

					marker = new google.maps.Marker({
						position:tmpLocation.position,
						map:mapObj,
						title:tmpLocation.title,
						icon: tmpLocation.icon,
						shadow: tmpLocation.shadow,
						animation: tmpLocation.animation,
                        visible: true
					});

					oneMarkerAtTime();
				}
			}
            
			function oneMarkerAtTime() {
				google.maps.event.addListener(marker, "animation_changed", function() {
					if (marker.getAnimation() === null) {
						createMarker(currentMarkerIndex+=1);
					}
                    else{
                        createMarker(currentMarkerIndex+=2-1);
                    }
				});
			}				
            
            createMarker(0);

		}
        
        /*
		initStoreList: function(position) {
			_appData.getStarbucksLocations(position.coords.latitude, position.coords.longitude)
        			.done(function(data) {
        				//TODO: Bind data to listview
                        branchesViewModel.load(data);

        			})
        			.fail();
		}   */
    }
    
    LocationViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        _isLoading: false,
        address: "",
        branchList: null,
        branchClicked: [],
        navToBranchesList: function() {
            app.application.navigate("#tabstrip-locationList");
        },
        navToBranchesMap: function() {
        	console.log("LVM navToBranchesMap"); 
            app.application.navigate("#tabstrip-location");
        },

        showLoading: function () {
            if (this._isLoading) {
                app.application.showLoading();
            }
        },

        hideLoading: function () {
            app.application.hideLoading();
        },

        _putMarker: function (position) {
            var that = this;

            if (that._lastMarker !== null && that._lastMarker !== undefined) {
                that._lastMarker.setMap(null);
            }

            that._lastMarker = new google.maps.Marker({
                map: map,
                position: position
            });
        },
        
        moveMap: function (lat, lng) { 
            console.log("LVM moveMap lat="+lat+" lng="+lng);
            _mapElem.setCenter(new google.maps.LatLng(lat, lng));
        },
                
        init: function () {
            var that = this,
                dataSource;
            console.log("LVM init");
            kendo.data.ObservableObject.fn.init.apply(that, []);
            
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "data/branches.json",
                        dataType: "json"
                    }
                }
            });
            
            that.set("branchList", dataSource);
            console.log(JSON.stringify(dataSource.data()));

        }  
    });

    
    app.locationService = {
        initLocation: function () {
            
            var mapOptions = {
                    zoom: 11,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
    
                    mapTypeControl: false,
                    streetViewControl: false
                };
            console.log("LS initLocation");
            map = new google.maps.Map(document.getElementById("map"), mapOptions);            
            geocoder = new google.maps.Geocoder();
            //app.locationService.viewModel.onNavigateHome.apply(app.locationService.viewModel, []);
           _mapElem = document.getElementById("map");
            app.locationService.viewModel.branchList.fetch();
            console.log(JSON.stringify(app.locationService.viewModel.branchList.data()));
            google.maps.event.trigger(map, "resize");
        },

        /* show: function () {
            //show loading mask in case the location is not loaded yet 
            //and the user returns to the same tab
            app.locationService.viewModel.showLoading();
            
            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(map, "resize");
        },

        hide: function () {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            app.locationService.viewModel.hideLoading();
        }, */
        
        init: function() {
            console.log("LS init");
			_mapElem = document.getElementById("map");
            app.locationService.viewModel.branchList.fetch();
		},
        
        show: function() {
			//Don't attempt to reload map/sb data if offline
			console.log("LS show mapLat="+_mapLat+" mapLng="+_mapLng);
			if (_isOnline === false) {				
				alert("Please reconnect to the Internet to load locations.");
    
				return;
			}
            
            if (_doneShow === true) {
                if (_mapLat !== undefined &&_mapLat !== 0) {
                    _mapObj.setZoom(14);
                    _mapObj.setCenter(new google.maps.LatLng(_mapLat, _mapLng));
                    _mapLat = 0;
                }
                
                return;
            }
            _doneShow = true;
			_private.getLocation()
			.done(function(position) { 
				//_private.initStoreList(position);
				_private.initMap(position); 
			})
			.fail(function(error) { 
                alert("map is not ititalizing properly.");
				alert(error.message); /*TODO: Better handling*/ 
			});
            console.log("ONLINE", _isOnline);
			if (_isOnline === true) {
				$("#stores").show();
				$(".offline").hide();
                google.maps.event.trigger(map, "resize");
			}
			else {
				$("#stores").hide();
				$(".offline").show();
			}
		},

       clickMapit: function(e) {
 		   //Don't attempt to reload map/sb data if offline
			//console.log("clickHours", JSON.stringify(e.button.data()));
            var mapData = e.button.data();
           _mapLat = mapData.lat;
           _mapLng = mapData.lng;
            
           console.log("LS clickMapit lat and lang = ", _mapLat, ", ", _mapLng);
           app.application.navigate("#tabstrip-location");
       },
        
       clickHours: function(e) {
			//Don't attempt to reload map/sb data if offline
			//console.log("clickHours", JSON.stringify(e.button.data()));
            var listHours = e.button.data();
            var dataSet = $('#branchesList').data("kendoMobileListView").dataSource._data;
            //var clicked;      
            console.log("LS clickHours");
            for(var i=0; i < dataSet.length; i++)
            {
                var dataItem = dataSet[i];
                if(dataItem.uid === listHours.hours)
                {
                    app.locationService.viewModel.branchClicked = dataSet[i];
                    break;
                }           
            }
            $("#modal-branchhours").data("kendoMobileModalView").open();
        },

        closeHours: function() {
            $("#modal-branchhours").kendoMobileModalView("close");
        },
        
        initHours: function(e) {
            console.log("LS initHours");
        },
        
        modalHours: function(e) {
            console.log("LS modalHours");
            console.log(e.target.context.dataset.hours);
            itemUID = e.target.context.dataset.hours;
            var dataSet = $('#branchesList').data("kendoMobileListView").dataSource._data;
            
            for(var i=0; i < dataSet.length; i++)
            {
                var dataItem = dataSet[i];
                if(dataItem.uid === itemUID)
                {
                    app.locationService.viewModel.branchClicked = dataSet[i];
                    console.log(app.locationService.viewModel.branchClicked);
                    break;
                }           
            }
 
            $(".hourLabel").text("");
            $(".hourItem").text("");
            $("#hours1").hide();
            $("#hours2").hide();
            $("#hours3").hide();
            $("#hours4").hide();
            $("#hours5").hide();
            $("#hours6").hide();
            $("#hours7").hide();
             
            if (test = app.locationService.viewModel.branchClicked.hours.length > 0) {
                $("#hours1").show(); 
                $("#hours1 .hourLabel").text(app.locationService.viewModel.branchClicked.hours[0].label);
                $("#hours1 .hourItem").text(app.locationService.viewModel.branchClicked.hours[0].value);
            }
            if (test = app.locationService.viewModel.branchClicked.hours.length > 1) {
                $("#hours2").show(); 
                $("#hours2 .hourLabel").text(app.locationService.viewModel.branchClicked.hours[1].label);
                $("#hours2 .hourItem").text(app.locationService.viewModel.branchClicked.hours[1].value);
            }
            if (test = app.locationService.viewModel.branchClicked.hours.length > 2) {
                $("#hours3").show(); 
                $("#hours3 .hourLabel").text(app.locationService.viewModel.branchClicked.hours[2].label);
                $("#hours3 .hourItem").text(app.locationService.viewModel.branchClicked.hours[2].value);               
            }
            if (test = app.locationService.viewModel.branchClicked.hours.length > 3) {
                $("#hours4").show(); 
                $("#hours4 .hourLabel").text(app.locationService.viewModel.branchClicked.hours[3].label);
                $("#hours4 .hourItem").text(app.locationService.viewModel.branchClicked.hours[3].value);          
            }
            if (test = app.locationService.viewModel.branchClicked.hours.length > 4) {
                $("#hours5").show(); 
                $("#hours5 .hourLabel").text(app.locationService.viewModel.branchClicked.hours[4].label);
                $("#hours5 .hourItem").text(app.locationService.viewModel.branchClicked.hours[4].value);
            }
            if (test = app.locationService.viewModel.branchClicked.hours.length > 5) {
                $("#hours6").show();                        
                $("#hours6 .hourLabel").text(app.locationService.viewModel.branchClicked.hours[5].label);
                $("#hours6 .hourItem").text(app.locationService.viewModel.branchClicked.hours[5].value);
            }
            if (test = app.locationService.viewModel.branchClicked.hours.length > 6) {
                $("#hours7").show();                        
                $("#hours7 .hourLabel").text(app.locationService.viewModel.branchClicked.hours[6].label);
                $("#hours7 .hourItem").text(app.locationService.viewModel.branchClicked.hours[6].value);
            }          

        },
        
        viewModel: new LocationViewModel()
    };
})(window);