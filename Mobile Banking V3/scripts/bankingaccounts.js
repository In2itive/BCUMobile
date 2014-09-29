(function(global) {  
    var BankingAccountsViewModel,
        app = global.app = global.app || {};
    
    BankingAccountsViewModel = kendo.data.ObservableObject.extend({
        
        selectedAccount: null,
        bankingAccountsDataSource: new kendo.data.DataSource({
                transport: {
                    /* read: {
                        url: "data/accountData.json",
                        dataType: "json"
                    } */
                    
                    read: {
                        type: "POST",
                        //contentType: "application/json",
                        crossDomain:true,
                        url: function(options) { return app.getURL() + "/IbnkWcf/service1.svc/JSONService"; },
                        dataType: "json",
                        async: false,
                        data: {"Trxn":	  "pro", 
                               "CustID":    app.loginService.viewModel.get("CustID").trim(), 
                               "SessionID": app.loginService.viewModel.get("SessionID").trim(), 
                               "Sequence": app.loginService.viewModel.get("Sequence").trim()}
                    } , 
                    parameterMap: function (data, operation) {
                        console.log("map: data=" + kendo.stringify(data)); 
                        return kendo.stringify({"Trxn":	  "pro", 
                               "CustID":    app.loginService.viewModel.get("CustID").trim(), 
                               "SessionID": app.loginService.viewModel.get("SessionID").trim(), 
                               "Sequence": app.loginService.viewModel.get("Sequence").trim()})
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
                            order: { type: "string", defaultValue: " " },
                            group: { type: "string", defaultValue: " " },
                            product: { type: "string", defaultValue: " " },
                            FrAccount: { type: "string", defaultValue: " " },
                            loc: { type: "string", defaultValue: " " },
                            hold: { type: "string", defaultValue: " " },
                            ledger: { type: "string", defaultValue: " " },
                            balance: { type: "string", defaultValue: " " },
                            matdate: { type: "string", defaultValue: " " },
                            intrate: { type: "string", defaultValue: " " },
                            intdate: { type: "string", defaultValue: " " },
                            paydate: { type: "string", defaultValue: " " },
                            payment: { type: "string", defaultValue: " " }
        					
                        }
                	}
            	},
                group: { field: "group" },
                fetch: function(e) {
                
                	//var that = this;
                    var data = this.data();
                    console.log("accounts length = " + data.length);  
               	 
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
            var dataSrc = app.bankingAccountsService.viewModel.get("bankingAccountsDataSource")
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
        accountClick: function(e) {
            
            var accountArray = [];          

            accountArray.push( { 
	            CustID: e.dataItem.CustID, 
                SessionID: e.dataItem.SessionID,
				Sequence: e.dataItem.Sequence,
                ErrorCode: e.dataItem.ErrorCode,
				ExtraData: e.dataItem.ExtraData,
                order: e.dataItem.order,
                group: e.dataItem.group,
                product: e.dataItem.product,
                FrAccount: e.dataItem.FrAccount,
                loc: e.dataItem.loc,
                hold: e.dataItem.hold,
                ledger: e.dataItem.ledger,
                balance: e.dataItem.balance,
                matdate: e.dataItem.matdate,
                intrate: e.dataItem.intrate,
                intdate: e.dataItem.intdate,
                paydate: e.dataItem.paydate,
                payment: e.dataItem.payment    
            });
            
            app.bankingHistoryService.viewModel.selectedFrAccount = e.dataItem.FrAccount;
            app.bankingAccountsService.viewModel.set("selectedAccount", accountArray);
            console.log("accountClick has run");
            
        }
        
    });  
    
    app.bankingAccountsService = {
        viewModel: new BankingAccountsViewModel()
    };
})(window);