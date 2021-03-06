(function (global) {
    var sysType = "",
        app = global.app = global.app || {};

    app.changeSystemType = function (e) {
        if (e.sender.element.text() === "Dev") {
            e.sender.element.text("QA");
            sysType = "Dev";
        }
        else {
            e.sender.element.text("Dev");
            sysType = "";
        }

        //app.application.skin(systemType);
    };
       
    app.sysURL = function () {
        if(sysType === "Dev")
        {
        	return "http://dev.in2itive.ca";
        }
        return "http://dev.in2itive.ca";
    }
    
    app.appType = "Prod";
    app.ipAddress = "0";
    app.deviceID = "0";
    
    // set the app build number here.  The gateway will enforce a minimum build number
    app.buildNum = "1507.05.2";
    
    app.getURL = function() {
        if(app.appType === "Dev") {
            return "https://dev.in2itive.ca";
        }
        if(app.appType === "UAT") {
            return "http://66.252.148.81";
        }
        return "https://mobile.bculink.ca";
    }
    
    app.openSettings = function (e) {
        $('#apptype').val(app.appType);
		$("#modal-appconfig").data("kendoMobileModalView").open();
    }
    
    app.closeSettings = function (e) {
        localStorage.setItem("appType", app.appType)
        $("#modal-appconfig").kendoMobileModalView("close");
    }
      
    app.setTypeProd = function (e) {
        app.appType = "Prod";
        $('#apptype').val(app.appType);
    }
    app.setTypeUAT = function (e) {
        app.appType = "UAT";
        $('#apptype').val(app.appType);
    }    
    app.setTypeDev = function (e) {
        app.appType = "Dev";
        $('#apptype').val(app.appType);
    }
    
})(window);