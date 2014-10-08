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
                }
        }),
     
    });  
    
    app.bankingVendorsService = {
        viewModel: new BankingVendorsViewModel(),
        
        listViewInit: function (initEvt) {
            console.log("listViewInit run");
            app.bankingVendorsService.viewModel.bankingVendorsDataSource.read();
            //app.bankingVendorsService.viewModel.bankingVendorsDS.read();
            
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
            kendo.mobile.application.navigate("#vendor-detailview?uid=" + itemUID);
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