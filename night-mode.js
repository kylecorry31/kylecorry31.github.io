window.onload = function(){
	this.nightMode = new NightMode();
	this.nightMode.enableIfNight();

	setInterval(function(){
		this.nightMode.enableIfNight();
	}.bind(this), 1000 * 60 * 5);
};

function NightMode(){

	this.element = document.body;

	this.enable = function(){
		console.log("Enable night mode");
		this.element.classList.add('night');
	};

	this.disable = function(){
		console.log("Disable night mode");
		this.element.classList.remove('night');
	};

	this.enableIfNight = function(){
		if (nightMode.isNight()) {
		nightMode.enable();
		} else {
			nightMode.disable();
		}
	};

	this.isNight = function(){
		var time = new Date();
		// Night will be after 6 and before 7
		var hour = time.getHours();

		return hour >= 18 || hour <= 7;
	};


	this.isDay = function(){
		return !this.isNight();
	};

}