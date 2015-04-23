var getSensorUpdate = function () {
    console.log("Getting Sensor Update");
    $.ajax({
        url: 'sensor.json',
        dataType: 'json',
        type: 'get',
        cache: false,
        success: function (data) {
            console.log(data);
            var temp = parseInt(data.temp);
            var light = data.light;
            if (light === "True") {
                light = "Light";
            } else {
                light = "Dark";
            }
            if (temp > 0)
                $('#temp').text(temp);
            $('#light').text(light);
        },
        error: function () {
            $('#temp').text("NA");
            $('#light').text("Unknown");
        }
    });
};

$(document).ready(function () {
    getSensorUpdate();
    setInterval(getSensorUpdate, 20000);
});