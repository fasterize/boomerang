/**
\file ttfc.js
Measure time to first clic metric.
Answers: When does a user tries to interact with the page?
Can give insight on when does a user considers a page ready enough to interact with
It needs a global BOOMR_lstart = new Date().getTime(); in the calling page
Metric will be sent for every new page loaded.
*/

(function(w, d) {

  BOOMR = BOOMR || {};
  BOOMR.plugins = BOOMR.plugins || {};

  var
    complete,
    name = 't_ttfc';

  function done() {
    complete = true;
    BOOMR.sendBeacon();
  }

  function iscomplete() {
    return complete;
  }

  function clicked() {
    if (w.sessionStorage) {
      w.sessionStorage.setItem(name, new Date().getTime() - w.BOOMR_lstart);
    }
    else {
      BOOMR.utils.setCookie(name, {value: new Date().getTime() - w.BOOMR_lstart});
    }
    BOOMR.utils.removeListener(d, 'mousedown', clicked);
  }

  BOOMR.plugins.TTFC = {
    init: function() {
      if (w.sessionStorage) {
        var ttfc = w.sessionStorage.getItem(name) || "0";

        if (ttfc) {
          BOOMR.plugins.RT.setTimer(name, parseInt(ttfc));
          w.sessionStorage.removeItem(name);
        }
      }
      else {
        var ttfc = BOOMR.utils.getCookie(name);
        if (ttfc) {
          ttfc = BOOMR.utils.getSubCookies(ttfc);
        } else {
          ttfc = {value: 0};
        }

        // cookie set? we can now store it to be sent
        if (ttfc.value) {
          BOOMR.plugins.RT.setTimer(name, parseInt(ttfc.value));
          BOOMR.utils.removeCookie(name);
        }
      }

      if (w.BOOMR_lstart) {
        BOOMR.utils.addListener(d, 'mousedown', clicked);
      }

      done();
      return this;
    },

    is_complete: iscomplete
  };

}(BOOMR.window, BOOMR.window.document));
