window.onload = function() {
  "use strict";
  startNightModeDaemon();
};

/**
 * Start the daemon which will enable night mode when it is night.
 */
function startNightModeDaemon() {
  "use strict";
  var nightMode = new NightMode();
  nightMode.enableIfNight();

  // Is this really needed?
  setInterval(function() {
    nightMode.enableIfNight();
  }, 1000 * 60 * 5);
}

/**
 * An object which can toggle the night mode of the page.
 */
function NightMode() {
  "use strict";
  this.element = document.body;

  /**
   * Enable the night mode on the page
   */
  this.enable = function() {

    assert(typeof this.element === "object");

    console.log("Enable night mode");
    this.element.classList.add('night');
  };

  /**
   * Disable the night mode on the page
   */
  this.disable = function() {

    assert(typeof this.element === "object");

    console.log("Disable night mode");
    this.element.classList.remove('night');
  };

  /**
   * Enable night mode if it is night, disable otherwise
   */
  this.enableIfNight = function() {
    if (this.isNight()) {
      this.enable();
    } else {
      this.disable();
    }
  };

  /**
   * Determines if it is night.
   * @return boolean - True if it is nighttime, false otherwise.
   */
  this.isNight = function() {
    var time = new Date();

    assert(typeof time === "object");

    // Night will be after 6 and before 7
    var hour = time.getHours();

    return hour >= 18 || hour <= 7;
  };
}

/**
 * An assert function. Throws an error if the assertion fails.
 * @param  boolean - condition The condition which should be true.
 * @param  string - message   The message to display if the assertion fails.
 */
function assert(condition, message) {
  if (!condition) {
    message = message || "Assertion failed";
    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message; // Fallback
  }
}
