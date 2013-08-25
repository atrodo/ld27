[% WRAPPER scope %]
  var view_layer = runtime.add_layer('game.data_view', {})
  [% time_slots = 10 / 0.5 %]
  [% time_rows  = 8 %]

  [% INCLUDE "$game_js/game.js" %]
  [% INCLUDE "$game_js/game_view.js" %]
[% END %]

