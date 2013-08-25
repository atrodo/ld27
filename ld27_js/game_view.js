var bg;

[% pal = {} %]
[% pal.selected = '59, 247, 64' %]
[% pal.unselect = '23, 157, 24' %]
[% pal.hint     = '12,  66, 14' %]

[% WRAPPER scope %]
  var g = new Gfx([% width / 2 %], [% height / 2 %])

  var rng = new lprng(null)

  var c = g.context
  var count = 0
  for (var x = 0; x < g.xw(); x++)
  {
    for (var y = 0; y < g.yh(); y++)
    {
      if (rng.random() > 0.98)
      {
        count++
        var l = floor(rng.random(10))
        c.fillStyle = "hsl(121, 65%, "+ l + "%)"
        c.fillRect(x, y, 1, 1)
      }
    }
  }
  console.log(count)

  bg = new Animation({gfx: g, frame_x: 0, frame_y: 0,})
[% END %]

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

    c.fillStyle = 'rgb(0, 0, 0)'
    c.fillRect(0, 0, this.xw, this.yh)

    c.scale(2, 2)
    gfx.draw_animation(bg)

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

    if (fadeou_cooldown != null)
      c.globalAlpha = 1 - fadeou_cooldown.get_pctdone()
    if (fadein_cooldown != null)
      c.globalAlpha = fadein_cooldown.get_pctdone()
    c.translate(0, this.yh)
    c.scale(1, -1)

    c.fillRect(0, 0, this.xw, 10)

    c.fillStyle = 'rgba(0, 0, 0, 0)'
    c.lineWidth = 1

    $.each(game.actions, function(i)
    {
      var x = 10
      var y = 40 * (i + 1)

      var rgb = '[% pal.unselect %]'
      if (i == current_action)
        rgb = '[% pal.selected %]'

      create_box(c, rgb, x, y)
    })

    c.font = '16px san-serif'
    c.shadowColor = 'rgb(39, 12, 2)'
    c.shadowOffsetX = 1
    c.shadowOffsetY = -1

    $.each(game.actions, function(i, action)
    {
      var rgb = '[% pal.unselect %]'
      if (i == current_action)
        rgb = '[% pal.selected %]'

      c.fillStyle = 'rgb(' + rgb + ')'
      c.fillText(action.sec + "s", 40, 40 * (i + 1) + 16)
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
    if (fadeou_cooldown != null)
      c.globalAlpha = 1 - fadeou_cooldown.get_pctdone()
    if (fadein_cooldown != null)
      c.globalAlpha = fadein_cooldown.get_pctdone()

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
    
    c.strokeStyle = 'rgba([% pal.hint %],0.6)'

    for (var row = 0; row < game.rows; row++)
    {
      for (var col = 0; col < [% time_slots %]; col++)
      {
        var x = col * cell_size + 50
        var y = cell_size * row + 50

        var cell_action = null
        $.each(game.actions, function(i, action)
        {
          if (i == selected_action)
            return;

          if (action.pos.x == col && action.pos.y == row)
          {
            cell_action = action
            return false
          }
        })

        var rgb = '[% pal.unselect %]'

        if (row == current_node[1] && col == current_node[0])
        {
          cell_action = game.actions[selected_action]
          rgb = '[% pal.selected %]'
        }

        if (cell_action != null)
        {
          var cells = cell_action.sec * 2 - 1
          var x_len = cells * cell_size

          var next_is_action = false
          var join_up_action = false
          var join_dn_action = false
          var next_col = col + cell_action.sec * 2

          $.each(game.actions, function(i, action)
          {
            if (action.pos.y == row && action.pos.x == next_col)
              next_is_action = true
            if (action.pos.y == row - 1 && action.pos.x == next_col)
              join_up_action = true
            if (action.pos.y == row + 1 && action.pos.x == next_col)
              join_dn_action = true
          })

          if (next_is_action)
          {
            x_len += 8
          }
          else if (join_up_action || join_dn_action)
          {
            x_len -= 11
          }

          c.strokeStyle = 'rgb([% pal.unselect %])'
          c.beginPath();
          c.moveTo(x + 23, y + 10)
          c.lineTo(x + 23 + x_len, y + 10)

          if (!next_is_action)
          {
            if (join_up_action)
            {
              c.lineTo(x + 23 + x_len + 19, y + 10 - 19)
            }
            else if (join_dn_action)
            {
              c.lineTo(x + 23 + x_len + 19, y + 10 + 19)
            }
          }

          c.stroke();

          create_box(c, rgb, x, y)

          c.strokeStyle = 'rgba([% pal.hint %],0.6)'
        }
        else
        {
          var on_path = false
          $.each(game.actions, function(i, action)
          {
            if (i == selected_action)
              return

            var pos = action.pos
            if (pos.y != row)
              return;

            if (col >= pos.x && col <= pos.x + action.sec * 2 - 1)
            {
              on_path = true
              return false
            }
          })

          if (row == current_node[1])
          {
            var action = game.actions[selected_action]
            if (col >= current_node[0] && col <= current_node[0] + action.sec * 2 - 1)
              on_path = true
          }

          if (!on_path)
          {
            c.beginPath()
            c.rect(x, y, 22, 22)
            c.stroke()
          }
        }
      }

    }

    return gfx;
  }
}));
