# slu-demos

Store demo plugins, themes, widgets to help as example to users

# Widgets

In these demos we have some widgets to follow as guide, on all these examples we
are using [Deno](https://deno.land/) but you can use any other runtime you
prefer as [Node](https://nodejs.org) or [Bun](https://bun.sh), also we are using
VanillaJS but you can use any library or framework you want, at the end all will
be bundled into a single file with esbuild or the bundler of your choice.

The only important and essential library is
[`@seelen-ui/lib`](https://github.com/Seelen-Inc/slu-lib) you need this library
to write the widget logic, get user settings, and a lot of wrapper classes and
functions to avoid the need of interacting directly with the raw background api.

1. [simple widget](./widgets/0-simple)
2. [multi instance widget](./widgets/1-multi-instance)
3. [widget by monitor](./widgets/2-instance-by-monitor)
