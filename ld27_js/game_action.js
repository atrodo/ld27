  var Action = function(sec, options)
  {
    $.extend(this, {
      name: "",
      sec: sec || 1.0,
      pos: {x: -1, y: -1},
      show: true,
      fixed: false,
    }, options);

    var self = this;

    self.sec = floor(sec * 2) / 2

    if (!self.show)
    {
      self.fixed = true
    }
  }
