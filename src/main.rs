use rltk::{GameState, Rltk, RGB};
use specs::prelude::*;
mod map;
pub use map::*;
mod components;
pub use components::*;
mod player;
pub use player::*;
mod rect;
pub use rect::*;
// TODO: http://bfnightly.bracketproductions.com/rustbook/chapter_3.html

pub struct State {
    ecs: World,
}
impl GameState for State {
    fn tick(&mut self, ctx: &mut Rltk) {
        ctx.cls();

        self.run_systems();
        player_input(self, ctx);

        let map = self.ecs.fetch::<Map>();
        map.draw_map(ctx);
        let positions = self.ecs.read_storage::<Position>();
        let renderables = self.ecs.read_storage::<Renderable>();
        for (pos, render) in (&positions, &renderables).join() {
            ctx.set(pos.x, pos.y, render.fg, render.bg, render.glyph)
        }
    }
}
impl State {
    fn run_systems(&mut self) {
        // Do things here when we have a system
        self.ecs.maintain();
    }
}

fn main() -> rltk::BError {
    println!("Hello, world!");

    use rltk::RltkBuilder;
    let context = RltkBuilder::simple80x50()
        .with_title("Roguelike Tutorial")
        .build()?;
    let mut gs = State { ecs: World::new() };

    //Register those components
    gs.ecs.register::<Position>();
    gs.ecs.register::<Renderable>();
    gs.ecs.register::<Player>();

    let map = Map::new_map_rooms_and_corridors();
    let (player_x, player_y) = map.rooms[0].center();
    gs.ecs.insert(map);

    // The player's entity
    gs.ecs
        .create_entity()
        .with(Position {
            x: player_x,
            y: player_y,
        })
        .with(Renderable {
            glyph: rltk::to_cp437('@'),
            fg: RGB::named(rltk::YELLOW),
            bg: RGB::named(rltk::BLACK),
        })
        .with(Player {})
        .build();

    // The non-player entities
    rltk::main_loop(context, gs)
}
