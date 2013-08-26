var puzzles = [
  {
    actions: [
      new Action(10),
    ],
    rows: 1,
  },
  {
    actions: [
      new Action(9),
      new Action(1),
    ],
    rows: 1,
  },
  {
    actions: [
      new Action(10),
      new Action(10),
    ],
    rows: 2,
  },
  {
    actions: [
      new Action(9),
      new Action(9),
      new Action(1),
    ],
    rows: 2,
  },
  {
    actions: [
      new Action(2),
      new Action(6),
      new Action(2, {pos: {x: 4, y: 0}, fixed: true}),
    ],
    rows: 1,
  },
  {
    actions: [
      new Action(2),
      new Action(2),
      new Action(8),
      new Action(2, {pos: {x: 4, y: 0}, show: false}),
    ],
    rows: 2,
  },

  // End Tutorial
  {
    actions: [
      new Action(2.5),
      new Action(2.5),
      new Action(5),
      new Action(1),
      new Action(4),
    ],
    rows: 2,
  },
  {
    actions: [
      new Action(3.5),
      new Action(2),
      new Action(2),
      new Action(2),
      new Action(5),
      new Action(1),
      new Action(1.5),
    ],
    rows: 3,
  },
  {
    actions: [
      new Action(3.5),
      new Action(1.5),
      new Action(1.5),
      new Action(3),
      new Action(3),
      new Action(3),
      new Action(5),
      new Action(7),
      new Action(0.5),
      new Action(0.5),
      new Action(3, {pos: {x: 0, y: 0}, fixed: true}),
      new Action(3, {pos: {x: 0, y: 2}, fixed: true}),
      new Action(1.5, {pos: {x: 7, y: 1}, show: false}),
    ],
    rows: 4,
  },
  {
    actions: [
      new Action(3.5),
      new Action(2),
      new Action(2),
      new Action(2),
      new Action(3),
      new Action(3),
      new Action(5),
      new Action(5),
      new Action(6),
      new Action(1),
      new Action(1.5),
      new Action(1.5, {pos: {x: 6, y: 1}, show: false}),
      new Action(1.5, {pos: {x: 5, y: 3}, show: false}),
    ],
    rows: 5,
  },
  {
    actions: [
      new Action(0.5),
      new Action(0.5),
      new Action(0.5),
      new Action(2),
      new Action(2),
      new Action(2),
      new Action(3),
      new Action(3),
      new Action(3),
      new Action(3.5),
      new Action(3.5),
      new Action(3.5),
      new Action(2, {pos: {x: 0, y: 1}, fixed: true}),
      new Action(2, {pos: {x: 0, y: 2}, fixed: true}),
      new Action(7, {pos: {x: 6, y: 1}, show: false}),
      new Action(7, {pos: {x: 6, y: 3}, show: false}),
    ],
    rows: 6,
  },

]
