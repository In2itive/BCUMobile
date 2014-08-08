(function(global) {  
    var BankingStatementViewModel,
        app = global.app = global.app || {};
    
    BankingStatementViewModel = kendo.observable({    
        fromAccounts: [],
  
        statementInfo: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "data/statementInfo.json",
                    dataType: "json"
                }
            },
            schema: {
                model: {
                    fields: {
                        custid: { type: "string" },
                        sessionid: { type: "string" },
                        fromacct: { type: "string" },
                        year: { type: "string" }, 
                        month: { type: "string" },
                        ref: { type: "string" },
                        info: { type: "string" },
                        error: { type: "string" }
                  }
                }
            }
        }),
        fromAccountsDS: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "data/fromAccounts.json",
                    dataType: "json"
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
                //console.log(JSON.stringify(app.bankingStatementService.viewModel));
                app.bankingStatementService.viewModel.set("fromAccounts", this.view());
            }
        })

    });
    
    app.bankingStatementService = {
        
        //viewModel: new BankingStatementViewModel(),
        viewModel: BankingStatementViewModel,
        
        init: function (initEvt) {         
            console.log("init statement-");
            //var validator = initEvt.view.element.kendoValidator().data("kendoValidator");  
            //console.log(JSON.stringify(app.bankingStatementService.viewModel));
            //data.fromAccountsDS.read();
            //data.toAccountsDS.read();
            //data.statementInfo.read();
            
            //app.bankingStatementService.viewModel.fromAccountDS.read();
            //app.locationService.viewModel.onNavigateHome.apply(app.locationService.viewModel, []);
            
            //this.viewModel.init;
            app.bankingStatementService.viewModel.fromAccountsDS.read();
            app.bankingStatementService.viewModel.statementInfo.read();
            //console.log(JSON.stringify(app.bankingStatementService.viewModel.statementInfo));
            
            var x = 1;
        },
        beforeShow: function (beforeShowEvt) {
            console.log("before statement");
            //app.bankingStatementService.formdisp($("#statementSchedule"));
            //validator = $("#listview-statement-banking").view.element.kendoValidator().data("kendoValidator");                
        },
        show: function (showEvt) {},
       
        validate: function () {
            if(validator.validate()) {
                alert("success");
            } else {
                //scroll back to top
                app.view().scroller.reset();
            }
        },

        clear: function () {
            //clear values of the inputs
            $("#statement-listview").find("input:not([type=checkbox])").val("");
            $("#statement-listview").find("input[type=checkbox]").attr('checked', false);
            //hide validation messages
            $(".validation-summary .k-invalid-msg").hide();
            //scroll back to top
            app.view().scroller.reset();        
        },
        
        setStatementDD: function() {
            var myselect=document.getElementById("StatementMonths"); //this refers to "selectmenu"	
            var mypos = myselect.selectedIndex; 
            while (myselect.length > 0) {
                myselect.remove(myselect.length-1) //removes last option within SELECT
            }

            myselect.options[0]=new Option("Jan", "1", true, false)
            myselect.options[1]=new Option("Feb", "2", true, false)
            myselect.options[2]=new Option("Mar", "3", true, false)
            myselect.options[3]=new Option("Apr", "4", true, false)
            myselect.options[4]=new Option("May", "5", true, false)
            myselect.options[5]=new Option("Jun", "6", true, false)
            myselect.options[6]=new Option("Jul", "7", true, false)
            myselect.options[7]=new Option("Aug", "8", true, false)
            myselect.options[8]=new Option("Sep", "9", true, false)
            myselect.options[9]=new Option("Oct", "10", true, false)
            myselect.options[10]=new Option("Nov", "11", true, false)
            myselect.options[11]=new Option("Dec", "12", true, false)
            
            if (mypos < myselect.length) { myselect.selectedIndex = mypos; }
        }
        
    };
})(window);