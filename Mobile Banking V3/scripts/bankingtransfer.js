(function(global) {  
    var BankingTransferViewModel,
        app = global.app = global.app || {};
    
    BankingTransferViewModel = kendo.observable({    
        fromAccounts: [],
        toAccounts: [],
  
        transferInfo: new kendo.data.DataSource({
            transport: {
                read: {
                    type: "POST",
                    //contentType: "application/json",
                    crossDomain:true,
                    url: function(options) { return app.getURL() + "/IbnkWcf/service1.svc/JSONService"; },
                    dataType: "json",
                    async: false                    
                }, 
                parameterMap: function (data, operation) {
                    //return kendo.stringify(data);
					console.log(data.FrAccount);
					if (data.FrAccount === undefined || data.FrAccount === null) 
                    {
                        return kendo.stringify({"Trxn":	  "trn", 
                           "Access":	 "Edit",
                           "EditRow":  data.EditRow,
                           "CustID":     app.loginService.viewModel.get("CustID").trim(), 
                           "SessionID":  app.loginService.viewModel.get("SessionID").trim(), 
                           "Sequence":   app.loginService.viewModel.get("Sequence").trim()}) 
                    }
                    
                    return kendo.stringify({"Trxn":	  "trn",
                        "Access":	 "Process",
                        "ExtraData" :	data.ExtraData,
                        "FrAccount" :	data.FrAccount,
                        "ToAccount" :	data.ToAccount,
                        "Amount" :	data.Amount,
                        "StartDate" :	data.StartDate,
                        "Schedule" :	data.Schedule,
                        "DOW" :	data.DOW,
                        "DOM" :	data.DOM,
                        "EOM" :	data.EOM,
                        "Months" :	data.Months,
                        "SDOM" :	data.SDOM,
                        "EndDate" :	data.EndDate,
                        "EditRow" :	data.EditRow,
                        "Day2" :		data.Day2,
						"Month2" :	data.Month2,
						"Year2" :	data.Year2,
                        "CustID":     app.loginService.viewModel.get("CustID").trim(), 
                        "SessionID":  app.loginService.viewModel.get("SessionID").trim(),
                        "Sequence":   app.loginService.viewModel.get("Sequence").trim()}) 
                }
            },
            schema: {
                model: {
                    fields: {
                        custid: { type: "string" },
                        sessionid: { type: "string" },
                        fromacct: { type: "string" },
                        toacct: { type: "string" }, 
                        schedule: { type: "string" },
                        amount: { type: "string" },
                        startdate: { type: "date" },
                        enddate: { type: "date" },
                        paymentdayofweek: { type: "string" },
                        paymentmonths: { type: "string" },
                        paymentdayofsemimonth: { type: "string" },
                        paymentdayofmonth: { type: "string" },
                        frombalance: { type: "string" },
                        tobalance: { type: "string" },
                        editrow: { type: "string"},
                        ref: { type: "string" },
                        info: { type: "string" },
                        error: { type: "string" }
                  }
                }
            },
            requestEnd: function(e) {
                //var response = e.response;
                var type = e.type;
                console.log(type); // displays "read"
                console.log(kendo.stringify(this)); // displays "77"
            }
        }),
        fromAccountsDS: new kendo.data.DataSource({
            transport: {
                read: {
                    type: "POST",
                    //contentType: "application/json",
                    crossDomain:true,
                    url: function(options) { return app.getURL() + "/IbnkWcf/service1.svc/JSONService"; },
                    dataType: "json",
                    async: false,                    
                }, 
                parameterMap: function (data, operation) {
                    return kendo.stringify({"Trxn":	  "trn", 
                           "Access":	 "FrAc",
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
                //console.log(JSON.stringify(app.bankingTransferService.viewModel));
                app.bankingTransferService.viewModel.set("fromAccounts", this.view());
            }
        }),       
        toAccountsDS: new kendo.data.DataSource({
            transport: {
                read: {
                    type: "POST",
                    //contentType: "application/json",
                    crossDomain:true,
                    url: function(options) { return app.getURL() + "/IbnkWcf/service1.svc/JSONService"; },
                    dataType: "json",
                    async: false,                    
                }, 
                parameterMap: function (data, operation) {
                    return kendo.stringify({"Trxn":	  "trn", 
                           "Access":	 "ToAc",
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
                app.bankingTransferService.viewModel.set("toAccounts", this.view());
            }
        })

    });
    
    app.bankingTransferService = {
        
        //viewModel: new BankingTransferViewModel(),
        viewModel: BankingTransferViewModel,
        editRow: "",
        
        init: function (initEvt) {         
            console.log("init transfer-");

        },
        beforeShow: function (beforeShowEvt) {
            console.log("before transfer");
    
            app.bankingTransferService.viewModel.fromAccountsDS.read();          
            app.bankingTransferService.viewModel.toAccountsDS.read();
            
            var myDS = app.bankingTransferService.viewModel.transferInfo;
            if (myDS.data().length > 0) 
            {
            	myDS.remove(myDS.data()[0]);
            }
            myDS.add({ schedule: "0", startdate: new Date(), enddate: new Date() });
         
            
            if (app.bankingTransferService.editRow > "")
            {	
                app.bankingTransferService.setMonths("7"); 
           	 app.bankingTransferService.viewModel.transferInfo.read({"EditRow": Number(app.bankingTransferService.editRow)});
            }
            app.bankingTransferService.editRow = "";
            
            app.bankingTransferService.formdisp($("#transferSchedule"));          
             
        },
        show: function (showEvt) {
            console.log("show transfer-");
        },
       
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
            $("#transfer-listview").find("input:not([type=checkbox])").val("");
            $("#transfer-listview").find("input[type=checkbox]").attr('checked', false);
            //hide validation messages
            $(".validation-summary .k-invalid-msg").hide();
            //scroll back to top
            app.view().scroller.reset();        
        },
        
        setMonths: function(mytype) {
            var myselect=document.getElementById("Months"); //this refers to "selectmenu"	
            var mypos = myselect.selectedIndex; 
            while (myselect.length > 0) {
                myselect.remove(myselect.length-1) //removes last option within SELECT
            }
            if (mytype === '5') {
                myselect.options[0]=new Option("Jan, Mar, May, Jul, Sep, Nov", "0", true, false)
                myselect.options[1]=new Option("Feb, Apr, Jun, Aug, Oct, Dec", "1", false, false)
            }
            if (mytype === '6') {
                myselect.options[0]=new Option("Jan, Apr, Jul, Oct", "0", true, false)
                myselect.options[1]=new Option("Feb, May, Aug, Nov", "1", false, false)
                myselect.options[2]=new Option("Mar, Jun, Sep, Dec", "2", false, false)
            }
            if (mytype === '7') {
                myselect.options[0]=new Option("Jan", "1", true, false)
                myselect.options[1]=new Option("Feb", "2", false, false)
                myselect.options[2]=new Option("Mar", "3", false, false)
                myselect.options[3]=new Option("Apr", "4", false, false)
                myselect.options[4]=new Option("May", "5", false, false)
                myselect.options[5]=new Option("Jun", "6", false, false)
                myselect.options[6]=new Option("Jul", "7", false, false)
                myselect.options[7]=new Option("Aug", "8", false, false)
                myselect.options[8]=new Option("Sep", "9", false, false)
                myselect.options[9]=new Option("Oct", "10", false, false)
                myselect.options[10]=new Option("Nov", "11", false, false)
                myselect.options[11]=new Option("Dec", "12", false, false)
                myselect.options[12]=new Option("-", "0", false, false)
            }
            if (mypos < myselect.length) { myselect.selectedIndex = mypos; }
        },
        
        formdisp: function(p_select){ //run some code when "onchange" event fires
            //var chosenoption=p_select.options[p_select.selectedIndex]; //this refers to "selectmenu"
            
            var s_select = document.getElementById("transferSchedule");
            var chosenoption=s_select.options[s_select.selectedIndex];            
            var rowdow=document.getElementById("RowDOW");
            var divdow=document.getElementById("LayerDOW");
            var divsdom=document.getElementById("LayerSDOM");
            var divdom=document.getElementById("LayerDOM");
            var divmonths=document.getElementById("LayerMonths");
            var divenddate=document.getElementById("LayerEndDate");
            var divstartdate=document.getElementById("LayerStart");
            //alert (' selected: ' + chosenoption.value); 
            if (s_select.selectedIndex < 0) { 
                chosenoption=s_select.options[0];
            }
            if (chosenoption.value === "0") {
                divdow.style.display = "none";
                divsdom.style.display = "none";
                divdom.style.display = "none";
                divmonths.style.display = "none";
                divenddate.style.display = "none";
                divstartdate.style.display = "none";
            }
            if (chosenoption.value === "1") {
                divdow.style.display = "";
                divsdom.style.display = "none";
                divdom.style.display = "none";
                divmonths.style.display = "none";
                divenddate.style.display = "";
                divstartdate.style.display = "inline";
            }
            if (chosenoption.value === "2") {
                divdow.style.display = "";
                divsdom.style.display = "none";
                divdom.style.display = "none";
                divmonths.style.display = "none";
                divenddate.style.display = "";
                divstartdate.style.display = "inline";
            }
            if (chosenoption.value === "3") {
                divdow.style.display = "none";
                divsdom.style.display = "";
                divdom.style.display = "";
                divmonths.style.display = "none";
                divenddate.style.display = "";
                divstartdate.style.display = "inline";
            }
            if (chosenoption.value === "4") {
                divdow.style.display = "none";
                divsdom.style.display = "none";
                divdom.style.display = "";
                divmonths.style.display = "none";
                divenddate.style.display = "";
                divstartdate.style.display = "inline";
            }
            if (chosenoption.value === "5") {
                divdow.style.display = "none";
                divsdom.style.display = "none";
                divdom.style.display = "";
                divmonths.style.display = "";
                divenddate.style.display = "";
                divstartdate.style.display = "inline";
                this.setMonths('5');
            }
            if (chosenoption.value === "6") {
                divdow.style.display = "none";
                divsdom.style.display = "none";
                divdom.style.display = "";
                divmonths.style.display = "";
                divenddate.style.display = "";
                divstartdate.style.display = "inline";
                this.setMonths('6');
            }
            if (chosenoption.value === "7") {
                divdow.style.display = "none";
                divsdom.style.display = "none";
                divdom.style.display = "none";
                divmonths.style.display = "";
                divenddate.style.display = "";
                divstartdate.style.display = "inline";
                this.setMonths('7');
            }
        },
        
        schedcheck_click: function(){
            var schedcheck=document.getElementById("EOM");
            var scheddom=document.getElementById("DOM");
            
            if (schedcheck.checked===true){
                scheddom.value = '31'
            }
            console.log("click");
        },

        scheddom_set: function(){
            var schedcheck=document.getElementById("EOM");
            var scheddom=document.getElementById("DOM");
            var schedsdom=document.getElementById("SDOM");
            if (scheddom.value < schedsdom.value){
                schedsdom.options[0].selected=true
            }
            if (scheddom.value === '31') {
                schedcheck.checked=true;
            }
            else {
                schedcheck.checked=false;
            }
        },

        // Set a DIV display on and off
        changeDiv: function(the_div,the_change) {
            var the_style = getStyleObject(the_div);
            if (the_style !== false)
            {
                the_style.display = the_change;
            }
        }, 
        
        closeTransferconfirm: function() {

            $("#modal-transferconfirm").kendoMobileModalView("close");
        },
       
        submitTransferconfirm: function() {
            if (app.bankingTransferService.viewModel.transferInfo.data()[0].enddate === null) 
            {
                app.bankingTransferService.viewModel.transferInfo.data()[0].enddate = new Date();
            }
            
            var startdate = app.bankingTransferService.viewModel.transferInfo.data()[0].startdate;
            var enddate = app.bankingTransferService.viewModel.transferInfo.data()[0].enddate;
            

            submitData = {
                "ExtraData" :	"",
                "FrAccount" :	app.bankingTransferService.viewModel.transferInfo.data()[0].fromacct,
                "ToAccount" :	app.bankingTransferService.viewModel.transferInfo.data()[0].toacct,
                "Amount" :	app.bankingTransferService.viewModel.transferInfo.data()[0].amount,
                "Day" :	app.bankingTransferService.viewModel.transferInfo.data()[0].startdate.getDate(),
                "Month" :	app.bankingTransferService.viewModel.transferInfo.data()[0].startdate.getMonth(),
                "Schedule" :	app.bankingTransferService.viewModel.transferInfo.data()[0].schedule,
                "DOW" :	app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofweek,
                "DOM" :	app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth,
                "Months" :	app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth,
                "SDOM" :	app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofsemimonth,
                "Day2" :	app.bankingTransferService.viewModel.transferInfo.data()[0].enddate.getDate(),
                "Month2" :	app.bankingTransferService.viewModel.transferInfo.data()[0].enddate.getMonth()+1,
                "Year2" :	 app.bankingTransferService.viewModel.transferInfo.data()[0].enddate.getFullYear(),
                "EditRow" :	app.bankingTransferService.viewModel.transferInfo.data()[0].editrow }
            
            app.bankingTransferService.viewModel.transferInfo.read( submitData );
        
            var returnError = app.bankingTransferService.viewModel.transferInfo.data()[0].ErrorCode;
            if ( returnError === null ) returnError = 0;
            
            if (returnError > 0) {
                console.log(returnError);
                app.errorService.viewModel.setError(returnError);
                
                // restore original data
                app.bankingTransferService.viewModel.transferInfo.data()[0].fromacct = submitData.FrAccount;
                app.bankingTransferService.viewModel.transferInfo.data()[0].toacct  = submitData.ToAccount;
                app.bankingTransferService.viewModel.transferInfo.data()[0].amount = submitData.Amount;
                app.bankingTransferService.viewModel.transferInfo.data()[0].startdate = startdate;

                app.bankingTransferService.viewModel.transferInfo.data()[0].schedule = submitData.Schedule;
                app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofweek = submitData.DOW;
                app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth = submitData.DOM;
                app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth = submitData.Months;
                app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofsemimonth = submitData.SDOM;
                app.bankingTransferService.viewModel.transferInfo.data()[0].enddate = enddate;

                app.bankingTransferService.viewModel.transferInfo.data()[0].editrow  = submitData.EditRow;

                var myDS = app.bankingTransferService.viewModel.transferInfo;
                myDS.add({ schedule: "0", startdate: new Date(), enddate: new Date() });
                if (myDS.data().length > 1) 
                {
                	myDS.remove(myDS.data()[1]);
                }
               
                $("#modal-transferconfirm").kendoMobileModalView("close");
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
            	app.application.navigate('#tabstrip-transferposted');
            	$("#modal-transferconfirm").kendoMobileModalView("close");
            }
            console.log("Submit - end");
        },
        
        checkTransfer: function() {
 
            var errorString = "Errors:";
            var maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 3);
             
            if (app.bankingTransferService.viewModel.transferInfo.data()[0].fromacct === undefined) { errorString = errorString + "<br>From Account Missing"; }
            if (app.bankingTransferService.viewModel.transferInfo.data()[0].toacct === undefined) { errorString = errorString + "<br>To Account Missing"; }
            if (app.bankingTransferService.viewModel.transferInfo.data()[0].amount === undefined) { errorString = errorString + "<br>Amount is Missing"; }
            if (app.bankingTransferService.viewModel.transferInfo.data()[0].startdate === undefined) { errorString = errorString + "<br>Start Date is Missing"; }
            if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === undefined) { errorString = errorString + "<br>the Schedule has not been selected"; }
            else
            {
                if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "0") {
                    //this is okay
                }
                else if (app.bankingTransferService.viewModel.transferInfo.data()[0].enddate === undefined) {
                    errorString = errorString + "<br>End Date is required";
                }
                else if (app.bankingTransferService.viewModel.transferInfo.data()[0].enddate > maxDate) {
                    errorString = errorString + "<br>End Date must be within 3 years";
                }
            }
 
            if (errorString > "Errors:")
            {
				app.errorService.viewModel.setError(1001, "Transfer", errorString);
                $("#modalview-error").data("kendoMobileModalView").open();
                //$("#modalview-error").open();
                //app.application.navigate("#modalview-error");
                return;
            }								
            //app.application.navigate("#modal-transferconfirm");
            app.bankingTransferService.confirmString();
            $("#modal-transferconfirm").data("kendoMobileModalView").open();
            
        },
               
        confirmString: function (beforeShowEvt) {
            var tmp_str = "";
            //var mydata 
            
            console.log("before confirm");
            //alert("confirm");
            tmp_str = "You are transfering $" + app.bankingTransferService.viewModel.transferInfo.data()[0].amount + " from your<br /><b>" + app.bankingTransferService.viewModel.transferInfo.data()[0].fromacct + "</b><br />account to your<br /><b>" + app.bankingTransferService.viewModel.transferInfo.data()[0].toacct + "</b><br />account ";
            
        	if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "0") {
        		tmp_str = tmp_str + "on " + app.bankingTransferService.viewModel.transferInfo.data()[0].startdate;
        	}
        	else {
                tmp_str = tmp_str + " and is scheduled<br />";
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "1") { //"Weekly":
        			tmp_str = tmp_str + "Weekly occurring each ";
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "2") { //"Bi-weekly":
        			tmp_str = tmp_str + "Bi-weekly occurring every second ";
                    //, (weekday_t)ibnk.dow);
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "3") { //"Semi-monthly":
        			tmp_str = tmp_str + "Semi-monthly occurring on the " + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofsemimonth + " and " + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth + " day of each month";
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "4") { //"Monthly":
        			tmp_str = tmp_str + "Monthly occurring on the " + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth + " day of each month";
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "5") { //"Bi-monthly":
        			tmp_str = tmp_str + "Bi-monthly occurring on the " + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth + " day of every second month";
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "6") { //"Quarterly":
        			tmp_str = tmp_str + "Quarterly occurring on the " + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth + " day of every third month";
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "7") { //"Yearly":
        			tmp_str = tmp_str + "Yearly occurring on ";
                    //, (alphamonth_t)ibnk.months, " ", 
                    tmp_str = tmp_str + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth + " each year";
        		}
        		tmp_str = tmp_str + " from<br /><b>" + app.bankingTransferService.viewModel.transferInfo.data()[0].startdate + " to " + app.bankingTransferService.viewModel.transferInfo.data()[0].enddate + "</b>.";
        	}
            document.getElementById("transferConfirm").innerHTML = tmp_str; 
	    },
        
        postedString: function (beforeShowEvt) {
            var tmp_str = "";
            //var mydata 
            
            console.log("before posted");
            //alert("confirm");
            tmp_str = "Transfer $" + app.bankingTransferService.viewModel.transferInfo.data()[0].amount + " from your<br /><b>" + app.bankingTransferService.viewModel.transferInfo.data()[0].fromacct + "</b><br />account to your<br /><b>" + app.bankingTransferService.viewModel.transferInfo.data()[0].toacct + "</b><br />account ";
            
        	if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "0") {
        		tmp_str = tmp_str + "on " + app.bankingTransferService.viewModel.transferInfo.data()[0].startdate;
                tmp_str = tmp_str + "<br />Your <b>" + app.bankingTransferService.viewModel.transferInfo.data()[0].fromacct + "</b> available balance is now " + app.bankingTransferService.viewModel.transferInfo.data()[0].frombalance + ".";
                tmp_str = tmp_str + "<br />Your <b>" + app.bankingTransferService.viewModel.transferInfo.data()[0].toacct + "</b> available balance is now " + app.bankingTransferService.viewModel.transferInfo.data()[0].tobalance + ".";                
        	}
        	else {
                tmp_str = tmp_str + " and is scheduled<br />";
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "1") { //"Weekly":
        			tmp_str = tmp_str + "Weekly occurring each ";
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "2") { //"Bi-weekly":
        			tmp_str = tmp_str + "Bi-weekly occurring every second ";
                    //, (weekday_t)ibnk.dow);
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "3") { //"Semi-monthly":
        			tmp_str = tmp_str + "Semi-monthly occurring on the " + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofsemimonth + " and " + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth + " day of each month";
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "4") { //"Monthly":
        			tmp_str = tmp_str + "Monthly occurring on the " + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth + " day of each month";
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "5") { //"Bi-monthly":
        			tmp_str = tmp_str + "Bi-monthly occurring on the " + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth + " day of every second month";
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "6") { //"Quarterly":
        			tmp_str = tmp_str + "Quarterly occurring on the " + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth + " day of every third month";
        		}
        		if (app.bankingTransferService.viewModel.transferInfo.data()[0].schedule === "7") { //"Yearly":
        			tmp_str = tmp_str + "Yearly occurring on ";
                    //, (alphamonth_t)ibnk.months, " ", 
                    tmp_str = tmp_str + app.bankingTransferService.viewModel.transferInfo.data()[0].paymentdayofmonth + " each year";
        		}
        		tmp_str = tmp_str + " from<br /><b>" + app.bankingTransferService.viewModel.transferInfo.data()[0].startdate + " to " + app.bankingTransferService.viewModel.transferInfo.data()[0].enddate + "</b>.";
        	}
            document.getElementById("transferMessage").innerHTML = tmp_str; 
	    } 
        
    };
})(window);