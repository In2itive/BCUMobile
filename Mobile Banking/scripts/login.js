(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        loginDataSource: null,
        CustID: "",
        passwd: "", 
        SessionID: "0",
        Sequence: "0",
        ExtraData: "0",
        ErrorCode: "0",
        ErrorMessage: "",
        isLoggedIn: false,
        ipAddress: "",
        diviceID: "",

        onLogin: function () {
            var that = this,
                username = that.get("CustID").trim(),
                passwd = that.get("passwd").trim(),
                dataSource;

            if (username === "" || passwd  === "") {
                //navigator.notification.alert("Both fields are required!",
                //    function () { }, "Login failed", 'OK');
				app.errorService.viewModel.setError(1401);
                $("#modalview-error").data("kendoMobileModalView").open();
                //$("#modalview-error").open();
                //app.application.navigate("#modalview-error");
                return;
            }
            
            if (app.doRequestStart() === false) {
                return;
            }

            //app.application.showLoading();   
            
            //kendo.data.ObservableObject.fn.init.apply(that, []);  keep this out, it seems to mess it up
            
            dataSource = new kendo.data.DataSource({
                
                transport: {
                   read: {
                        type: "POST",
                        //contentType: "application/json",
                        crossDomain:true,
                        timeout: 90,
                        //url: "http://in2itive.dlinkddns.com/IbnkWcf/service1.svc/JSONService"
                        url: function(options) { return app.getURL() + "/IbnkWcf/service1.svc/JSONService"; },
                        dataType: "json",
                        async: false,
                        //data: {"Trxn": "ver", "CustID": username, "Passwd": passwd},
                    },
                    
                    parameterMap: function (data, operation) {
                        //return kendo.stringify(data);
                        console.log("login: data=" + kendo.stringify(data) + " IP=" + app.ipAddress);
                        console.log("login: custID=" + app.loginService.viewModel.get("CustID").trim());
                        
                        return kendo.stringify({"Trxn":	  "ver",
                            "Passwd" :	app.loginService.viewModel.get("passwd").trim(),
                            "CustID":     app.loginService.viewModel.get("CustID").trim(),
                            "ClientIP":   app.ipAddress,
                            "ClientID":   app.deviceID}) 
                     }   
                },
                schema: {
                    model: {
                        id: "CustID",
                        fields: {
                            CustID: { type: "string" },
                            SessionID: { type: "string" },
							Sequence: { type: "string" },
							ExtraData: { type: "string" },
                            ErrorCode: { type: "string" },
                            isLoggedIn: { type: "boolean", defaultValue: false }
        					
                        }
                    }
                },
                error: function(e) {
                    console.log(e.errors); // displays "Invalid query"
                    message = "Connection failure. Please try again later.";
                    app.errorService.viewModel.setError(0101, "General Error", message);

                    $("#modalview-error").data("kendoMobileModalView").open();            
                    return false;                    
                }
                
            });
            
 
            dataSource.fetch (function(){
            	//var that = this;
                var data = this.data();
                console.log(data.length);  
           	 app.application.hideLoading();
            	if (data.length > 0 ) {
                    //data[0].set("isLoggedIn", true );
                    that.set("CustID", data[0].get("CustID"));
                    that.set("SessionID", data[0].get("SessionID"));
                    that.set("Sequence ", data[0].get("Sequence"));
                    that.set("ExtraData", data[0].get("ExtraData"));
                    that.set("ErrorCode", data[0].get("ErrorCode")); 
                    that.set("isLoggedIn", true);
                    
                    //set for testing...
                    if(app.appType === "Prod") {
                        //that.set("ExtraData", "Change Password");
                    }
                    
                    if (parseInt(data[0].get("ErrorCode")) > 0 ) {
                        that.set("isLoggedIn", false);
                        that.set("username", "");
                        that.set("CustID", "");
                        that.set("passwd", "");
                        that.set("ErrorMessage", "Login failed, re-enter your ID and Password");
                    }
                    else if (parseInt(data[0].get("Sequence")) < 1 ) {
                        that.set("isLoggedIn", false);
                        that.set("username", "");
                        that.set("CustID", "");
                        that.set("passwd", "");
                        that.set("ErrorMessage", "Login failed, re-enter your ID and Password");
                    }

                    else if (that.get("ExtraData").indexOf("Change Password") >= 0 ) {
                        that.set("loginDataSource", dataSource); 
                        app.application.navigate("#tabstrip-password");
                        that.set("username", "");
                        that.set("passwd", "");
                        that.set("isLoggedIn", false);
                        that.set("ErrorMessage", "");
                    }
                    else {
                        that.set("ErrorMessage", "");
                        that.set("isLoggedIn", true);
                    }
                }
            });
            
            
            //dataSource.read();
        

            that.set("loginDataSource", dataSource); 
            
        },
        onLogout: function () {
            var that = this;
            that.clearForm();
            that.set("Sequence", "0");
            that.set("passwd", "");
			that.set("isLoggedIn", false);
            console.log("onLogout has run");
            app.application.navigate("#tabstrip-login");
        },
        clearForm: function () {
            var that = this;
            that.set("username", "");
            that.set("CustID", "");
            that.set("passwd", "");
        },
        show: function () {
            
            console.log("login show");
            if ( app.loginService.viewModel.get("ExtraData").trim().indexOf("Change Pass") >= 0 ) { 
                app.loginService.viewModel.set("CustID", "");
            }
        
            $.ajax({jsonp: 'jsonp',
              dataType: 'jsonp',
              url: 'http://myexternalip.com/json',
              success: function(myip) {app.ipAddress = myip; }
            });        
            
            app.deviceID = device.uuid;
        }
    });
    
    app.loginService = {
        viewModel: new LoginViewModel()
    };
    
    app.selectionData = null;
    
})(window); 