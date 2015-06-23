(function (global) {
    var mobileSkin = "",
        app = global.app = global.app || {};
    
    cancelDefaultAction = function(e) {
        var evt = e ? e:window.event;
        if (evt.preventDefault) evt.preventDefault();
        evt.returnValue = false;
        return false;
    }
    
    document.addEventListener("deviceready", function () {
        
        app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout", statusBarStyle: "black-translucent"});
        app.application.skin("flat");
        app.appType = localStorage.getItem("appType");
        
        if (app.appType === undefined || app.appType === null || app.appType === "null") {
			app.appType = "Prod";
		}
        
        console.log(localStorage.getItem("appType"));
        
        $.ajaxSetup({
            timeout: 3000 //Time in milliseconds
        });
        
        $("#buildNum").html("Build " + app.buildNum); // set build number in config.js
        
    }, false);
    
    window.addEventListener('error', function (e) {
        e.preventDefault();
        var message = e.message + "' from " + e.filename + " line:" + e.lineno;
        //showAlert(message, 'Error occurred');
        console.log(message);
        app.errorService.viewModel.setError(1001, "General Error", message);

        $("#modalview-error").data("kendoMobileModalView").open();
        return cancelDefaultAction(e);
    }, false);

    app.changeSkin = function (e) {
        if (e.sender.element.text() === "Flat") {
            e.sender.element.text("Native");
            mobileSkin = "flat";
        }
        else {
            e.sender.element.text("Flat");
            mobileSkin = "";
        }

        app.application.skin(mobileSkin);
    };  
    
    app.errorObj = {errorCode: 0, errorStr: "", errorStr2: "", errorStr3: "", errorCancel: "", errorBack: "", errorLogin: ""};
    
    isOnline = function () {
        return navigator.connection.type !== Connection.NONE;
    };
    
    app.doRequestStart = function () {
        if ( navigator.connection.type === Connection.NONE ) {
            message = "No network connection available. Please try again when online.";
            app.errorService.viewModel.setError(0101, "General Error", message);

            $("#modalview-error").data("kendoMobileModalView").open();            
            return false;
        }
        
        return true;
    };
    
    app.testshow = function (e) {
        console.log("testshow has run");
    }
})(window);