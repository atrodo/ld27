[% INCLUDE "$game_js/game_action.js" %]

var game = {
  rows: 2,
  actions: [
    new Action(2.5),
    new Action(2.5),
    new Action(5),
    new Action(1),
    new Action(4),
  ],
  grid: []
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


  // Make sure we arn't on the same place as another

  // Update the grid/Check for the solution
  [% WRAPPER scope %]
    game.grid = []
    var grid = game.grid = []

    var solution_possible = true

    // Rebuild the grid
    $.each(game.actions, function(i, action)
    {
      var x = action.pos.x
      var y = action.pos.y

      if (i == selected_action)
      {
        x = current_node[0]
        y = current_node[1]
      }

      if (grid[y] == null)
        grid[y] = []

      for (var i = 0; i < action.sec * 2; i++)
      {
        // There is overlap, we know this is not a solution
        if (grid[y][x + i] != null)
        {
          solution_possible = false
          return false
        }

        grid[y][x + i] = -1

        if (i == 0)
          grid[y][x + i] = i
      }
    })

    if (!solution_possible)
      return;

    $.each(grid, function(y, row)
    {

      for (var x = 0; x < [% time_slots %]; x++)
      {
        if (grid[y][x] == undefined)
        {
          // We can join another row if the one above or below us is >= 0
          if (x > 0 && grid[y + 1] != undefined && grid[y + 1][x] >= 0)
          {
            x--
            y++
            continue
          }
          if (x > 0 && grid[y - 1] != undefined && grid[y - 1][x] >= 0)
          {
            x--
            y--
            continue
          }

          solution_possible = false
          return false
        }
      }
    });

    if (solution_possible)
      console.log("Good")
  [% END %]

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

    current_node = set_action_pos(
        game.actions[selected_action],
        current_node[0], current_node[1]
    )

    game.actions[selected_action].pos = {x: current_node[0], y: current_node[1]}
    current_action = selected_action
    selected_action = null
    current_node = [-1, -1]
    select_latch = true

    console.log(game)

    return new Cooldown()
  },
  cancel: function()
  {
    if (selected_action == null)
      return

    current_action = selected_action
    selected_action = null
    current_node = [-1, -1]

    console.log(game)

    return new Cooldown()
  },
})
