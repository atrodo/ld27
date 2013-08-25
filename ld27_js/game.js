[% INCLUDE "$game_js/game_action.js" %]
[% INCLUDE "$game_js/puzzles.js" %]

var puzzle_num = 0;
var game = puzzles[puzzle_num]
game.grid = []

var current_action = 0
var current_node = [-1, -1]
var selected_action = null
var select_latch = false

var fadeou_cooldown
var fadein_cooldown = new Cooldown('1s', function()
{
  fadein_cooldown = null
});
view_layer.events.once('frame_logic', fadein_cooldown)

var get_action_pos = function()
{
  var result = []
  $.each(game.actions, function(i, action)
  {
    var a = {
      sec: action.sec,
    }
    if (i == selected_action)
    {
      a.x = current_node[0]
      a.y = current_node[1]
    }
    else
    {
      a.x = action.pos.x
      a.y = action.pos.y
    }
    result.push(a)
  })

  return result
}

var set_current_pos = function()
{
  var action = game.actions[selected_action]
  var x = current_node[0]
  var y = current_node[1]

  var max_x = [% time_slots %]
  var max_y = game.rows

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

  current_node[0] = x
  current_node[1] = y

  // Make sure we arn't on the same place as another

  // Update the grid/Check for the solution
  [% WRAPPER scope %]
    game.grid = []
    var grid = game.grid = []

    for (var i = 0; i < game.rows; i++)
      grid[i] = []

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
        return

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
    {
      console.log("Good")
      view_layer.deactivate_input()
      fadeou_cooldown = new Cooldown('1s', function()
      {
        fadeou_cooldown = null
        view_layer.activate_input()

        game = puzzles[++puzzle_num]

        current_action = 0
        current_node = [-1, -1]
        selected_action = null

        fadein_cooldown = new Cooldown('1s', function()
        {
          fadein_cooldown = null
        });
        view_layer.events.once('frame_logic', fadein_cooldown)
      })
      view_layer.events.once('frame_logic', fadeou_cooldown)
    }
  [% END %]

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

    set_current_pos()

    return new Cooldown()
  },
})

input.add_action({
  up: function()
  {
    if (selected_action == null)
      return

    current_node[1]--

    set_current_pos()

    return new Cooldown()
  },
  down: function()
  {
    if (selected_action == null)
      return

    current_node[1]++

    set_current_pos()

    return new Cooldown()
  },
  left: function()
  {
    if (selected_action == null)
      return

    current_node[0]--

    set_current_pos()

    return new Cooldown()
  },
  right: function()
  {
    if (selected_action == null)
      return

    current_node[0]++

    set_current_pos()

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

    set_current_pos()

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
