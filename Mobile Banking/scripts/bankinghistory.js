(function(global) {  
    var BankingHistoryViewModel,
        app = global.app = global.app || {};
    
    BankingHistoryViewModel = kendo.data.ObservableObject.extend({
        bankingHistoryInfoDataSource: new kendo.data.DataSource(),
        selectedFrAccount: null,
        bankingHistoryDataSource:  new kendo.data.DataSource({
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
                        
                        console.log("map: selected=" + app.bankingAccountsService.viewModel.get("selectedAccount"));
                        console.log("map: selected=" + data.FrAccount);
                        console.log("map: data=" + kendo.stringify(data));
                        return kendo.stringify({"Trxn":	  "hst", 
                               "Access":	 "Process",
                               "FrAccount":  data.FrAccount, //that.get("bankingHistoryInfoDataSource").at(0).FrAccount, //app.bankingAccountsService.viewModel.get("selectedAccount")[0].get("FrAccount").trim(),
                               "Pos":		"0",
                               "CustID":     app.loginService.viewModel.get("CustID").trim(), 
                               "SessionID":  app.loginService.viewModel.get("SessionID").trim(), 
                               "Sequence":   app.loginService.viewModel.get("Sequence").trim()}) 
                    }
                },    
                schema: {
                    total: "total",
                    model: {
                        id: "order",
                        fields: {
                            CustID: { type: "string", defaultValue: " " },
                            SessionID: { type: "string", defaultValue: " " },
							Sequence: { type: "string", defaultValue: " " },
                            ErrorCode: { type: "string", defaultValue: " " },
							ExtraData: { type: "string", defaultValue: " " },
                            total: { type: "integer", defaultValue: 3},
                            order: { type: "string", defaultValue: " " },
                            effective: { type: "string", defaultValue: " " },
                            description: { type: "string", defaultValue: " - " },
                            interest: { type: "string", defaultValue: " " },
                            principal: { type: "string", defaultValue: " " },
                            amount: { type: "string", defaultValue: "0" },
                            balance: { type: "string", defaultValue: " " }
        					
                        }
                	}
            	},
                serverPaging: true,
                serverSorting: true,
                pageSize: 10,
                group: { field: "effective", dir: "desc" },
                fetch: function(e){
               	 var data = this.data();
                	console.log("history length = " + data.length);  
           	 
                    if (data.length > 0 ) {
                        var errorCode = parseInt(data[0].get("ErrorCode"));
                        
        				if (errorCode > 0 ) {
                            // we have an error to process
                        	// Set these fields for the sake of the template
                            data[0].set("order", " " );
                            data[0].set("effective", " " );
                            data[0].set("description", " " );                        
                            
                        }
                    }
                    else {
                        // need to track this
                    }
                }
                
            }),
            
        beforeshow: function (e) {
            console.log("beforeshow has run");
            var accountArray = app.bankingAccountsService.viewModel.get("selectedAccount"),
            	infoSrc = app.bankingHistoryService.viewModel.get("bankingHistoryInfoDataSource"),
            	accountItem = infoSrc.at(0);
            this.selectedFrAccount = app.bankingAccountsService.viewModel.selectedAccount[0].FrAccount;
            console.log("beforeshow -" + this.selectedFrAccount);
            
            if ( accountItem ) {
                infoSrc.remove(accountItem);
            }
            
            if (accountArray) {
            	infoSrc.add(accountArray[0]);
            }            


            //console.log("beforeshow -", app.bankingAccountsService.viewModel.selectedAccount[0].FrAccount);
            // var dataSrc = app.bankingHistoryService.viewModel.get("bankingHistoryDataSource");
            var dataSrc = app.bankingHistoryService.viewModel.bankingHistoryDataSource;

            dataSrc.read({"FrAccount": app.bankingAccountsService.viewModel.selectedAccount[0].FrAccount});
            
            var returnError = dataSrc.data()[0].ErrorCode;
            if ( returnError === null ) returnError = 0;
            
            if (returnError > 0) {
                console.log(returnError);
                if(returnError === "1100" || returnError === "1101") {
                    dataSrc.data()[0].description = "No transactions on file.";
                    dataSrc.data()[0].amount = " ";
                    dataSrc.data()[0].group = " ";
                    dataSrc.data()[0].effective = " " ;
                    dataSrc.add({ description: "0", amount: "0", effective: " " });
                    if (dataSrc.data().length > 1) 
                    {
                    	dataSrc.remove(dataSrc.data()[1]);
                    }
                }
                
                app.errorService.viewModel.setError(returnError);
               
                $("#modalview-error").data("kendoMobileModalView").open();
                if(returnError === "3107" || returnError === "3108" || returnError === "3110") 
                {
                    app.loginService.viewModel.onLogout();
                }
            }
        }        
    });     
    
    app.bankingHistoryService = {
        viewModel: new BankingHistoryViewModel()
    };
})(window);