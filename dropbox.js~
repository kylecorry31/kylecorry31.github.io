$(function () {
    var client = new Dropbox.Client({
        key: 'e7chfasn94dxoky'
    });

    client.authenticate({
        interactive: true
    }, function (error) {
        if (error) alert('Authentication error: ' + error);
    });

    if (client.isAuthenticated()) {
        var datastoreManager = client.getDatastoreManager();
        datastoreManager.openDefaultDatastore(function (error, datastore) {
            if (error) alert('Error opening default datastore: ' + error);
            var sensorTable = datastore.getTable('sensors');

            function getTemp() {
                var results = sensorTable.query({
                    name: 'Temperature'
                });
                return results[0].get('value');
            }

            function getLight() {
                var results = sensorTable.query({
                    name: 'Light'
                });
                return results[0].get('value');
            }

            function updateTemp(val) {
                sensorTable.insert({
                    name: 'Temperature',
                    value: val
                });
                var results = sensorTable.query({
                    name: 'Temperature'
                });
                for (var i = 0; i < results.length - 1; i++) {
                    results[i].deleteRecord();
                }
            }

            function updateLight(val) {
                sensorTable.insert({
                    name: 'Light',
                    value: val
                });
                var results = sensorTable.query({
                    name: 'Light'
                });
                for (var i = 0; i < results.length - 1; i++) {
                    results[i].deleteRecord();
                }
            }

            function updateSite() {
                    var temp = getTemp();
                    var light = getLight();
                    $('#temp').text(temp);
                    if (light === "True") {
                        light = "Light";
                    } else {
                        light = "Dark";
                    }
                    $('#light').text(light);
                }
                //            updateTemp(77);
                //            updateLight(true);
                //            console.log(getTemp());
                //            console.log(getLight());
            updateSite();
            setInterval(function () {
                console.log('Updating Sensors');
                updateSite();
            }, 20000);
        });






    }
});