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

            app.application.showLoading();   
            
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
                        data: {"Trxn": "ver", "CustID": username, "Passwd": passwd},
                    },
                    
                    parameterMap: function (data, operation) {
                        return kendo.stringify(data);
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
                    else {
                        that.set("isLoggedIn", true);
                        that.set("ErrorMessage", "");
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
        }
    });
    
    app.loginService = {
        viewModel: new LoginViewModel()
    };
    
    app.selectionData = null;
    
})(window); 