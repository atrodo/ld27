[% INCLUDE "$game_js/game_action.js" %]

var game = {
  rows: 2,
  actions: [
    new Action(2.5),
    new Action(2.5),
    new Action(5),
    new Action(1),
    new Action(4),
  ]
}

var current_action = 0
var current_node = [-1, -1]
var selected_action = null
var select_latch = false

var set_action_pos = function(action, x, y)
{
  var max_x = [% time_slots %]
  var max_y = max_time_rows

  // Make sure the position is sane
  if (y < 0)
    y = max_y - 1
  if (y >= max_y)
    y = 0

  if (x < 0)
    x = max_x - 1
  if (x >= max_x)
    x = 0

  // Make sure we don't overlap with the end of the grid
  if (x + action.sec * 2 > max_x)
    x -= x + action.sec * 2 - max_x

  return [x, y]
}

var input = new Input({ layer: view_layer })

input.register_action("select",  "enter")
input.register_action("cancel",  "esc")

input.add_action({
  up: function()
  {
    if (current_action == null)
      return

    current_action--
    if (current_action < 0)
      current_action = game.actions.length-1

    return new Cooldown()
  },
  down: function()
  {
    if (current_action == null)
      return

    current_action++
    if (current_action >= game.actions.length)
      current_action = 0

    return new Cooldown()
  },
  select: function()
  {
    if (current_action == null)
      return

    if (select_latch)
    {
      select_latch = false
      return new Cooldown()
    }

    selected_action = current_action
    current_action = null
    current_node = [0, 0]
    select_latch = true

    return new Cooldown()
  },
})

var max_time_rows = game.rows
input.add_action({
  up: function()
  {
    if (selected_action == null)
      return

    current_node[1]--

    current_node = set_action_pos(
        game.actions[selected_action],
        current_node[0], current_node[1]
    )

    return new Cooldown()
  },
  down: function()
  {
    if (selected_action == null)
      return

    current_node[1]++

    current_node = set_action_pos(
        game.actions[selected_action],
        current_node[0], current_node[1]
    )

    return new Cooldown()
  },
  left: function()
  {
    if (selected_action == null)
      return

    current_node[0]--

    current_node = set_action_pos(
        game.actions[selected_action],
        current_node[0], current_node[1]
    )

    return new Cooldown()
  },
  right: function()
  {
    if (selected_action == null)
      return

    current_node[0]++

    current_node = set_action_pos(
        game.actions[selected_action],
        current_node[0], current_node[1]
    )

    return new Cooldown()
  },
  select: function()
  {
    if (selected_action == null)
      return

    if (select_latch)
    {
      select_latch = false
      return new Cooldown()
    }

    game.actions[selected_action].pos = {x: current_node[0], y: current_node[1]}
    selected_action = null
    current_action = 0
    current_node = [-1, -1]
    select_latch = true

    console.log(game)

    return new Cooldown()
  },
  cancel: function()
  {
    if (selected_action == null)
      return

    selected_action = null
    current_action = 0
    current_node = [-1, -1]

    console.log(game)

    return new Cooldown()
  },
})
