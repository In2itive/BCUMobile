(function(global) {  
    var BankingPasswordViewModel,
        app = global.app = global.app || {};
    
    BankingPasswordViewModel = kendo.observable({      
        passwordInfo: new kendo.data.DataSource({
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
                    
                    return kendo.stringify({"Trxn":	  "pwc",
                        "Access":	 "Process",
                        "Passwd" :	data.newpassword,
                        "Passwdretype" :	data.confirmpassword,
                        "Button" :	"OK",
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
                        password: { type: "string" },
                        newpassword: { type: "string" }, 
                        confirmpassword: { type: "string" },
                        ref: { type: "string" },
                        info: { type: "string" },
                        error: { type: "string" }
                  }
                }
            },
            fetch: function(e) {
                
                	//var that = this;
                    var data = this.data();
                    console.log("accounts length = " + data.length);  
               	 
                    if (data.length > 0 ) {
                        var errorCode = parseInt(data[0].get("ErrorCode"));
                        app.loginService.viewModel.set("SessionID", data[0].get("SessionID"));
                        app.loginService.viewModel.set("Sequence ", data[0].get("Sequence"));
                        
        				if (errorCode > 0 ) {
                            // we have an error to process
                        	// Set these fields for the sake of the template
                           
                        }
                        else {
                            // Set the session info
                            
                        }
                        
                    }
                    else {
                        // need to track this
                    }
                }  
        })

    });
    
    app.bankingPasswordService = {

        viewModel: BankingPasswordViewModel,
        
        init: function (initEvt) {         
            //app.bankingPasswordService.viewModel.passwordInfo.read();
            
            var x = 1;
            var view = initEvt.view;
            
            /*
            view.element.find("#pwdone").data("kendoMobileButton").bind("click", function() {
                app.bankingPasswordService.viewModel.passwordInfo.one("change", function() {
                    view.loader.hide();
                    app.application.navigate("#:back");
                    //window.kendoMobileApplication.navigate("#:back");
                });

                view.loader.show();
                var ds = app.bankingPasswordService.viewModel.passwordInfo;
                app.bankingPasswordService.viewModel.passwordInfo.sync();
            });

            view.element.find("#pwcancel").data("kendoMobileBackButton").bind("click", function(e) {
                e.preventDefault();
                app.bankingPasswordService.viewModel.passwordInfo.one("change", function() {
                    view.loader.hide();
                    app.application.navigate("#:back");
                    //window.kendoMobileApplication.navigate("#:back");
                });

                view.loader.show();
                app.bankingPasswordService.viewModel.passwordInfo.cancelChanges();
            }); */
            
        },

        show: function (showEvt) {},
        beforeShow: function (beforeShowEvt) {
            console.log("before PWC");
            
            var myDS = app.bankingPasswordService.viewModel.passwordInfo;
            if (myDS.data().length > 0) 
            {
            	myDS.remove(myDS.data()[0]);
            }       
            myDS.add({ newpassword: "", confirmpassword: "" });
             
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
            $("#password-listview").find("input:not([type=checkbox])").val("");
            $("#password-listview").find("input[type=checkbox]").attr('checked', false);
            //hide validation messages
            $(".validation-summary .k-invalid-msg").hide();
            //scroll back to top
            app.view().scroller.reset();        
        },
        submitChange: function() {


            submitData = {
                "newpassword" :	app.bankingPasswordService.viewModel.passwordInfo.data()[0].newpassword,
                "confirmpassword" :	app.bankingPasswordService.viewModel.passwordInfo.data()[0].confirmpassword
            };
            
            app.bankingPasswordService.viewModel.passwordInfo.read( submitData );
        
            var returnError = app.bankingPasswordService.viewModel.passwordInfo.data()[0].ErrorCode;
            if ( returnError === null ) returnError = 0;
            
            
            if (returnError > 0) {
                console.log(returnError);
                app.errorService.viewModel.setError(returnError);
                
                // restore original data
                app.bankingPasswordService.viewModel.passwordInfo.data()[0].newpassword = submitData.newpassword;
                app.bankingPasswordService.viewModel.passwordInfo.data()[0].confirmpassword  = submitData.confirmpassword;

                var myDS = app.bankingPasswordService.viewModel.passwordInfo;
                myDS.add({ newpassword: "", confirmpassword: "" });
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
                app.loginService.viewModel.set("SessionID", app.bankingPasswordService.viewModel.passwordInfo.data()[0].get("SessionID"));
                app.loginService.viewModel.set("Sequence ", app.bankingPasswordService.viewModel.passwordInfo.data()[0].get("Sequence"));
            	app.application.navigate('#tabstrip-login');
            }
            console.log("Submit - end");
        }        
        
    };
})(window);