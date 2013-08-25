  var Action = function(sec, options)
  {
    $.extend(this, {
      name: "",
      sec: sec || 1.0,
      pos: {x: 0, y: 0},
    }, options);

    var self = this;

    self.sec = floor(sec * 2) / 2
  }
