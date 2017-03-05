var request = require('request');

module.exports = {

    getData  : function(req,res){
        var staticData  = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
        var dynamicData = "https://gbfs.citibikenyc.com/gbfs/en/station_status.json "

        request(staticData, function (error, response, staticData) {
                if(!error){
                    request(dynamicData, function (error, response, dynamicData) {
                        if(!error){

                            res.json({status: true, msg: "response received", data: {staticData:staticData,dynamicData:dynamicData}});
                        }
                        else{
                            res.json({status: false, msg: "failed to receive response", data: null});
                        }

                    });
                }
                else{
                    res.json({status: false, msg: "failed to receive response", data: null});
                }

        });
    }
};