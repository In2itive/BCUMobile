(function(global) {  
    var AnnouncementsViewModel,
        app = global.app = global.app || {};
    
    AnnouncementsViewModel = kendo.data.ObservableObject.extend({
        announcementsDataSource: null,
        
        init: function () {
            var that = this,
                dataSource;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
            
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "data/homeData.json",
                        dataType: "json"
                    }
                }
            });
            
           
            
            that.set("announcementsDataSource", dataSource);
            console.log(JSON.stringify(dataSource.data()));

        }        
    });  
    
    app.announcementService = {
        viewModel: new AnnouncementsViewModel()
    };
    
})(window);