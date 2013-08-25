[% INCLUDE "$game_js/game_action.js" %]

var game = {
  actions: [
    new Action(1),
    new Action(2),
    new Action(3),
    new Action(4),
    new Action(10),
    new Action(5),
  ]
}

var current_action = 0
var current_node = [-1, -1]
var selected_action = null
var select_latch = false

var input = new Input({ layer: view_layer })

input.register_action("select",  "enter")

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

var max_time_rows = [% time_rows %] * 2 - 2
input.add_action({
  up: function()
  {
    if (selected_action == null)
      return

    current_node[1]--
    if (current_node[1] < 0)
      current_node[1] = max_time_rows

    return new Cooldown()
  },
  down: function()
  {
    if (selected_action == null)
      return

    current_node[1]++
    if (current_node[1] >= max_time_rows)
      current_node[1] = 0

    return new Cooldown()
  },
  left: function()
  {
    if (selected_action == null)
      return

    current_node[0]--
    if (current_node[0] < 0)
      current_node[0] = [% time_slots %]

    return new Cooldown()
  },
  right: function()
  {
    if (selected_action == null)
      return

    current_node[0]++
    if (current_node[0] >= [% time_slots %])
      current_node[0] = 0

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

    selected_action = null
    current_action = 0
    current_node = [-1, -1]
    select_latch = true

    return new Cooldown()
  },
})
