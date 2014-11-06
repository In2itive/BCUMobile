(function(global) {  
    var BankingVendorsViewModel,
        app = global.app = global.app || {};
    
    BankingVendorsViewModel = kendo.data.ObservableObject.extend({
        bankingVendorSelected: {},
        bankingVendorsDataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        type: "POST",
                        //contentType: "application/json",
                        crossDomain:true,
                        url: function(options) { return app.getURL() + "/IbnkWcf/service1.svc/JSONService"; },
                        dataType: "json",
                        async: false
                    } , 
                    parameterMap: function (data, operation) {
                        //return kendo.stringify(data);
                        
                        console.log("map: selected=" + data.FrAccount);
                        console.log("map: data=" + kendo.stringify(data));
                                        
    					/*if (!(data.name === undefined || data.name === null))
                        {
                        	return kendo.stringify({"Trxn":	  "vdr", 
                               "Access":	 "Edit",
                               "EditRow":  data.EditRow,
                               "CustID":     app.loginService.viewModel.get("CustID").trim(), 
                               "SessionID":  app.loginService.viewModel.get("SessionID").trim(), 
                               "Sequence":   app.loginService.viewModel.get("Sequence").trim()}) 
                    	}*/
                        
                        return kendo.stringify({"Trxn":	  "vdr", 
                               "Access":	  "FrAc",
                               "FrAccount":    "first",
                               "Pos":		"0",
                               "CustID":     app.loginService.viewModel.get("CustID").trim(), 
                               "SessionID":  app.loginService.viewModel.get("SessionID").trim(), 
                               "Sequence":   app.loginService.viewModel.get("Sequence").trim()}) 
                    },
                    update: {
                        url: "data/billAccounts.json",
                        dataType: "jsonp"
                    },
                    destroy: {
                        url: "data/billAccounts.json",
                        dataType: "jsonp"
                    }
                },     
                schema: {
                    model: {
                        id: "name",
                        fields: {
                            name: { type: "string" },
                            vendor: { type: "string" },
                            number: { type: "string" },
                            nickname: { type: "string" }
                        }
                    }
                },
                fetch: function(e) {
                
                	//var that = this;
                    var data = this.data();
                    console.log("accounts length = " + data.length);  
               	 
                    if (data.length > 0 ) {
                        var errorCode = parseInt(data[0].get("ErrorCode"));
                        
        				if (errorCode > 0 ) {
                            // we have an error to process
                        	// Set these fields for the sake of the template
                            
                        }
                    }
                    else {
                        // need to track this
                    }
                },            
                error: function(e) {
                    console.log(e.errors); // displays "Invalid query"
                    message = "Connection failure. Please try again later.";
                    app.errorService.viewModel.setError(0101, "General Error", message);

                    $("#modalview-error").data("kendoMobileModalView").open();            
                    return false;                    
                }
        }),
     
    });  
    
    app.bankingVendorsService = {
        viewModel: new BankingVendorsViewModel(),
        
        listViewInit: function (initEvt) {
            console.log("listViewInit run");
            app.bankingVendorsService.viewModel.bankingVendorsDataSource.read();
            
            app.bankingVendorsService.viewModel.bankingVendorSelected = null;
            
            var returnError = app.bankingVendorsService.viewModel.bankingVendorsDataSource.data()[0].ErrorCode;
            if ( returnError === null ) returnError = 0;
            
            if (returnError > 0) {
                console.log(returnError);
                app.errorService.viewModel.setError(returnError);
               
                $("#modalview-error").data("kendoMobileModalView").open();
                if(returnError === "3107" || returnError === "3108" || returnError === "3110") 
                {
                    app.loginService.viewModel.onLogout();
                }
            } 
            
            initEvt.view.element.find("#list-edit-listview").kendoMobileListView({
                dataSource: app.bankingVendorsService.viewModel.bankingVendorsDataSource,
                style: "inset",
                template: $("#itemTemplate").html()
                
            })
            .kendoTouch({
                filter: ">li",
                enableSwipe: true,
                touchstart: app.bankingVendorsService.touchstart,
                tap: app.bankingVendorsService.navigate,
                swipe: app.bankingVendorsService.swipe
            });            
        },
        
        navigate: function (e) {
            var itemUID = $(e.touch.currentTarget).data("uid");
            app.bankingVendorsService.viewModel.bankingVendorSelected = app.bankingVendorsService.viewModel.bankingVendorsDataSource.getByUid(itemUID);
            //kendo.mobile.application.navigate("#vendor-detailview?uid=" + itemUID);
            kendo.mobile.application.navigate("#vendor-detailview");
        },

        swipe: function (e) {
            var button = kendo.fx($(e.touch.currentTarget).find("[data-role=button]"));
            button.expand().duration(200).play();
        },
        
        touchstart: function (e) {
            var target = $(e.touch.initialTouch),
                listview = $("#list-edit-listview").data("kendoMobileListView"),
                model,
                button = $(e.touch.target).find("[data-role=button]:visible");

            if (target.closest("[data-role=button]")[0]) {
                model = app.bankingVendorsService.viewModel.bankingVendorsDataSource.getByUid($(e.touch.target).attr("data-uid"));
                app.bankingVendorsService.viewModel.bankingVendorsDataSource.remove(model);

                //prevent `swipe`
                this.events.cancel();
                e.event.stopPropagation();
            } else if (button[0]) {
                button.hide();

                //prevent `swipe`
                this.events.cancel();
            } else {
                listview.items().find("[data-role=button]:visible").hide();
            }
        }
    
    };
})(window);