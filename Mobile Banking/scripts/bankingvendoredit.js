(function(global) {  
    var BankingVendorEditViewModel,
        app = global.app = global.app || {};
    
    BankingVendorEditViewModel = kendo.data.ObservableObject.extend({
        bankingVendorsList: [],
        bankingVendorsDS: new kendo.data.DataSource({
            transport: {
                /*read: function(options) {
                    var myData = kendo.stringify({"Trxn":	  "vdr", 
                           "Access":	  "ToAc",
                           "CustID":     app.loginService.viewModel.get("CustID").trim(), 
                           "SessionID":  app.loginService.viewModel.get("SessionID").trim(), 
                           "Sequence":   app.loginService.viewModel.get("Sequence").trim()}) ;
                    $.ajax({
                        type: "POST",
                        crossDomain:true,
                        url: app.getURL() + "/IbnkWcf/service1.svc/JSONService",
                        data:  myData,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        async: false,
                        success: function (result) {
                            console.log("ajax success: result=" + kendo.stringify(result));
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(errorThrown);
                            console.log(jqXHR);
                            
                            app.bankingVendorEditService.viewModel.set("bankingVendorsList",bankingVendorsList = JSON.parse(jqXHR.responseText));
                            //bankingVendorsList = JSON.parse(jqXHR.responseText);
                        }
                    });
                } */
                read: {
                    type: "POST",
                    //contentType: "application/json",
                    crossDomain:true,
                    url: function(options) { return app.getURL() + "/IbnkWcf/service1.svc/JSONService"; },
                    dataType: "json",
                    async: false
                } , 
                parameterMap: function (data, operation) {
                
                    console.log("map: selected=" + data.FrAccount);
                    console.log("map: data=" + kendo.stringify(data));
                    
                    return kendo.stringify({"Trxn":	  "vdr", 
                           "Access":	  "ToAc",
                           "CustID":     app.loginService.viewModel.get("CustID").trim(), 
                           "SessionID":  app.loginService.viewModel.get("SessionID").trim(), 
                           "Sequence":   app.loginService.viewModel.get("Sequence").trim()}) 
                } 

            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { type: "string" },
                        name: { type: "string" }
                    }
                }
            },
            change: function (e) {
                //console.log(JSON.stringify(this.view()));
                app.bankingVendorEditService.viewModel.set("bankingVendorsList", this.view());
                console.log(JSON.stringify(app.bankingVendorEditService.viewModel.bankingVendorsList));
            }
        }),
        
        bankingVendorEditDataSource: new kendo.data.DataSource({
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
                        
                        console.log("map: selected=" + data.vendor);
                        console.log("map: data=" + kendo.stringify(data));
                        
                        
                        if (data.delete === "yes") {
                            return kendo.stringify({"Trxn":	  "vdr", 
                                   "Button":      "OK",
                                   "Access":	  "Delete",
                                   "FrAccount":    data.name,
                                   "ToAccount":	data.origno,
                                   //"ExtraData":    data.number + " " + data.nickname,
                                   "CustID":     app.loginService.viewModel.get("CustID").trim(), 
                                   "SessionID":  app.loginService.viewModel.get("SessionID").trim(), 
                                   "Sequence":   app.loginService.viewModel.get("Sequence").trim()}) 
                        }
                        else if (data.origno > "") {
                            return kendo.stringify({"Trxn":	  "vdr", 
                                   "Button":      "OK",
                                   "Access":	  "Edit",
                                   "FrAccount":    data.name,
                                   "ToAccount":	data.origno,
                                   "ExtraData":    data.number + " " + data.nickname,
                                   "CustID":     app.loginService.viewModel.get("CustID").trim(), 
                                   "SessionID":  app.loginService.viewModel.get("SessionID").trim(), 
                                   "Sequence":   app.loginService.viewModel.get("Sequence").trim()}) 
                        }
                        else{
                            return kendo.stringify({"Trxn":	  "vdr", 
                                   "Button":      "OK",
                                   "Access":	  "Add",
                                   "FrAccount":    data.name,
                                   "ToAccount":	data.number,
                                   "ExtraData":    data.nickname,
                                   "CustID":     app.loginService.viewModel.get("CustID").trim(), 
                                   "SessionID":  app.loginService.viewModel.get("SessionID").trim(), 
                                   "Sequence":   app.loginService.viewModel.get("Sequence").trim()})                             
                        }
                    },
                    update: {
                        type: "POST",
                        //contentType: "application/json",
                        crossDomain:true,
                        url: function(options) { return app.getURL() + "/IbnkWcf/service1.svc/JSONService"; },
                        dataType: "json",
                        async: false
                    }
                },     
                schema: {
                    model: {
                        id: "name",
                        fields: {
                            name: { type: "string" },
                            vendor: { type: "string" },
                            number: { type: "string" },
                            origno: { type: "string" },
                            nickname: { type: "string" },
                            showdelete: {type: "boolean"}
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
        })        
    });  
    
    app.bankingVendorEditService = {
        viewModel: new BankingVendorEditViewModel(),       

        beforeShow: function (e) {
            var model = app.bankingVendorsService.viewModel.bankingVendorSelected;
            var myDS = app.bankingVendorEditService.viewModel.bankingVendorEditDataSource;
            var setShowDelete = false;
            
            console.log("vendor - beforeShow");
            
            while (myDS.data().length > 0) 
            {
            	myDS.remove(myDS.data()[0]);
            }
            if (model !== null && model.number > "") {
                setShowDelete = true;
            
                myDS.add({ name: model.name, vendor: model.vendor, number: model.number, origno: model.number, nickname: model.nickname, showdelete: setShowDelete });                         
            }
            else {
                myDS.add({ name: "", vendor: "", number: "", origno: "", nickname: "", showdelete: setShowDelete });                         
            }
		    app.bankingVendorEditService.viewModel.bankingVendorsDS.read();
            app.bankingVendorsService.viewModel.bankingVendorSelected = {};
        },
        
        init: function (e) {
            //var view = e.view;
            console.log("vendor - init");
            
        },
        show:  function (e) {
            var model = app.bankingVendorEditService.viewModel;
            
            console.log("vendor - show");
            kendo.bind(e.view.element, model, kendo.mobile.ui);
        },
        save: function (e) {
            var myDS = app.bankingVendorEditService.viewModel.bankingVendorEditDataSource;

                
            submitData = {
                "name": app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].name,
                "origno": app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].origno,
                "number": app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].number,
                "nickname": app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].nickname
            }
            
            app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.read( submitData );
        
            var returnError = app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].ErrorCode;
            if ( returnError === null ) returnError = 0;
            
            if (returnError > 0) {
                console.log(returnError);
                app.errorService.viewModel.setError(returnError);
                
                // restore original data
                app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].name = submitData.name;
                app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].origno  = submitData.origno;
                app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].number = submitData.number;
                app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].nickname = submitData.nickname;

                myDS.add({ name: "", origno: "", number: "", nickname: "" });
                while (myDS.data().length > 1) 
                {
                	myDS.remove(myDS.data()[1]);
                }
               
                if(returnError === "3107" || returnError === "3108" || returnError === "3110") 
                {
                    app.loginService.viewModel.onLogout();
                }
                else 
                {
                	$("#modalview-error").data("kendoMobileModalView").open();
                }
            }
            else 
            {
            	app.application.navigate('#tabstrip-vendor');
            	
            }
            console.log("save - end");
        },
        delete: function (e) {
            var myDS = app.bankingVendorEditService.viewModel.bankingVendorEditDataSource;

                
            submitData = {
                "name": app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].name,
                "origno": app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].origno,
                "number": app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].number,
                "nickname": app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].nickname,
                "delete": "yes"
            }
            
            app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.read( submitData );
        
            var returnError = app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].ErrorCode;
            if ( returnError === null ) returnError = 0;
            
            if (returnError > 0) {
                console.log(returnError);
                app.errorService.viewModel.setError(returnError);
                
                // restore original data
                app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].name = submitData.name;
                app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].origno  = submitData.origno;
                app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].number = submitData.number;
                app.bankingVendorEditService.viewModel.bankingVendorEditDataSource.data()[0].nickname = submitData.nickname;

                myDS.add({ name: "", origno: "", number: "", nickname: "" });
                if (myDS.data().length > 1) 
                {
                	myDS.remove(myDS.data()[1]);
                }
               
                if(returnError === "3107" || returnError === "3108" || returnError === "3110") 
                {
                    app.loginService.viewModel.onLogout();
                }
                else 
                {
                	$("#modalview-error").data("kendoMobileModalView").open();
                }
            }
            else 
            {
                
                console.log("vendor - delete is complete");
            	app.application.navigate('#tabstrip-vendor');
            	
            }
            console.log("save - end");
        },
    };
})(window);