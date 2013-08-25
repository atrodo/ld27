
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

var create_box = function(c, rgb, x, y)
{
  var border_styles = [
    'rgba(' + rgb + ', 1.0)',
    'rgba(' + rgb + ', 0.6)',
    'rgba(' + rgb + ', 0.3)',
  ]

  $.each(border_styles, function(border, style)
  {
    c.strokeStyle = style

    border++

    c.beginPath()
    c.rect(x - border, y - border, 22 + border * 2, 22 + border * 2);
    c.stroke()
  })
}

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

    $.each(game.actions, function(i)
    {
      var x = 10
      var y = 40 * (i + 1)

      var rgb = '252, 198, 143'
      if (i == current_action)
        rgb = '106, 67, 14'

      create_box(c, rgb, x, y)
    })

    c.font = '16px san-serif'
    c.fillStyle = 'rgb(205, 166, 126)'
    c.shadowColor = 'rgb(39, 12, 2)'
    c.shadowOffsetX = 1
    c.shadowOffsetY = -1

    $.each(game.actions, function(i, sec)
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

    for (var row = 0; row < max_time_rows; row++)
    {
      for (var col = 0; col < [% time_slots %]; col++)
      {
        var x = col * cell_size + 50
        var y = cell_size * row + 50

        if (row % 2 == 1)
        {
          x += cell_size * 0.4
        }

        if (row == current_node[1] && col == current_node[0])
        {
          var rgb = '106, 67, 14'
          create_box(c, rgb, x, y)
          c.strokeStyle = 'rgba(252, 198, 143, 0.6)'
        }
        else
        {
          c.beginPath()
          c.rect(x, y, 22, 22)
          c.stroke()
        }
      }

    }

    return gfx;
  }
}));
