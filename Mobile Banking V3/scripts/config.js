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
        	return "http://192.168.0.185";
        }
        return "http://in2itive.dlinkddns.com";
    }
    
})(window);