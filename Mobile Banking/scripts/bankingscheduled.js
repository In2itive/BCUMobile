(function(global) {  
    var BankingScheduledViewModel,
        app = global.app = global.app || {};
    
    BankingScheduledViewModel = kendo.data.ObservableObject.extend({
        selectedScheduled: null,
        bankingScheduledDataSource: new kendo.data.DataSource({
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
                        console.log("map sched: data=" + kendo.stringify(data)); 
                        return kendo.stringify({"Trxn":	  "pen",
                               "Access":	  "first",
                               "FrAccount":    "first",
                               "CustID":    app.loginService.viewModel.get("CustID").trim(), 
                               "SessionID": app.loginService.viewModel.get("SessionID").trim(), 
                               "Sequence": app.loginService.viewModel.get("Sequence").trim(),
                            "ClientIP":   app.ipAddress,
                            "ClientID":   app.deviceID, "BuildNum":   app.buildNum})
                    }
                },
                schema: {
                    model: {
                        id: "order",
                        fields: {
                            CustID: { type: "string", defaultValue: " " },
                            SessionID: { type: "string", defaultValue: " " },
							Sequence: { type: "string", defaultValue: " " },
                            ErrorCode: { type: "string", defaultValue: " " },
							ExtraData: { type: "string", defaultValue: " " },
                            group: { type: "string", defaultValue: " " },
                            fromacct: { type: "string", defaultValue: " "  },
                            toacct: { type: "string", defaultValue: " "  }, 
                            schedule: { type: "string", defaultValue: " "  },
                            amount: { type: "string", defaultValue: " "  },
                        	editrow: { type: "string", defaultValue: " " }
        					
                        }
                	}
            	},
                group: { field: "group" },
            
            	fetch: function(e) {
                    var data = this.data();
                    console.log("Scheduled length = " + data.length);  
               	 
                    if (data.length > 0 ) {
                        var errorCode = parseInt(data[0].get("ErrorCode"));
                        
        				if (errorCode > 0 ) {
                            // we have an error to process
                        	// Set these fields for the sake of the template
                            data[0].set("group", " " );
                            data[0].set("product", " " );
                            data[0].set("balance", "0.00" );
                            
                            
                        }
                    }
                    else {
                        // need to track this
                    }
           	 }
        }),
        beforeshow: function (e) {
            var that = this;
            var dataSrc = app.bankingScheduledService.viewModel.get("bankingScheduledDataSource")
            console.log("beforeshow has run");
            dataSrc.read();
            
            var returnError = dataSrc.data()[0].ErrorCode;
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
            
        },
        scheduledClick: function(e) {
            
            var itemArray = [];          

            itemArray.push( { 
	            CustID: e.dataItem.CustID, 
                SessionID: e.dataItem.SessionID,
				Sequence: e.dataItem.Sequence,
                ErrorCode: e.dataItem.ErrorCode,
				ExtraData: e.dataItem.ExtraData,
                group: e.dataItem.group,
                editrow: e.dataItem.editrow 
            });
            
            app.bankingScheduledService.viewModel.set("selectedScheduled", itemArray);
            
            if (e.dataItem.group === "Bill Payment") 
            {
                app.bankingBillPayService.editRow = e.dataItem.editrow;
                app.application.navigate("#tabstrip-billpay");
            }
            else
            {
                app.bankingTransferService.editRow = e.dataItem.editrow;
                app.application.navigate("#tabstrip-transfer");
            }
            console.log("scheduledClick has run");
            
        }
        
    });  
    
    app.bankingScheduledService = {
        viewModel: new BankingScheduledViewModel()
    };
})(window);