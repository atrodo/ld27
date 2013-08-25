
view_layer.add_animation(new Animation({
  frame_x: 0,
  frame_y: 0,
  xw: [% width %],
  yh: [% height %],
  get_gfx: function()
  {
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context
    c.translate(0, this.yh)
    c.scale(1, -1)

    c.fillStyle = 'rgba(247, 223, 187, 0.95)'
    c.fillRect(0, 0, this.xw, this.yh)

    return gfx
  }
}));

[% action_grid_xw = 80 %]
// The action grid
view_layer.add_animation(new Animation({
  frame_x: 0,
  frame_y: 0,
  xw: [% action_grid_xw %],
  yh: [% height %],
  get_gfx: function()
  {
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context
    c.translate(0, this.yh)
    c.scale(1, -1)

    c.fillRect(0, 0, this.xw, 10)

    c.fillStyle = 'rgba(0, 0, 0, 0)'
    c.lineWidth = 1

    var border_styles = [
      'rgba(106, 67, 14, 1.0)',
      'rgba(252, 198, 143, 0.6)',
      'rgba(255, 216, 154, 0.3)',
    ]

    var boxes = [0, 1, 2, 3, 4, 5, 10]

    $.each(border_styles, function(border, style)
    {
      c.strokeStyle = style

      var x = 10
      border++

      $.each(boxes, function(i)
      {
        var y = 40 * (i + 1)

        c.beginPath()
        c.rect(x - border, y - border, 22 + border * 2, 22 + border * 2);
        c.stroke()
      })
    })

    c.font = '16px san-serif'
    c.fillStyle = 'rgb(205, 166, 126)'
    c.shadowColor = 'rgb(39, 12, 2)'
    c.shadowOffsetX = 1
    c.shadowOffsetY = -1

    $.each(boxes, function(i, sec)
    {
      c.fillText(sec + "s", 40, 40 * (i + 1) + 16)
    });
   
    return gfx;
  }
}));

view_layer.add_animation(new Animation({
  frame_x: [% action_grid_xw %],
  frame_y: 0,
  xw: [% width - action_grid_xw %],
  yh: [% height %],
  get_gfx: function()
  {
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context
    c.translate(0, this.yh)
    c.scale(1, -1)

    c.fillRect(0, 0, this.xw, 10)

    c.fillStyle = 'rgba(0, 0, 0, 0)'
    c.lineWidth = 1

    var grid_xw = this.xw - 10*2

    // Reserve space for the person
    grid_xw -= 40

    // Reserve space for the goal
    grid_xw -= 40

    // Split everything into 10 seconds, in .5 increments
    var cell_size = grid_xw / [% time_slots %]
    
    c.strokeStyle = 'rgba(252, 198, 143, 0.6)'

    for (var row = 0; row < 8; row++)
    {
      for (var col = 0; col < [% time_slots %]; col++)
      {
        c.beginPath()
        c.rect(col * cell_size + 50, cell_size * 2 * row + 50, 22, 22)
        c.stroke()
      }

      for (var col = 0; col < [% time_slots %]; col++)
      {
        c.beginPath()
        c.rect(col * cell_size + 50 + cell_size * 0.4, cell_size * 2 * row + (50 + cell_size), 22, 22)
        c.stroke()
      }
    }

    return gfx;
  }
}));
