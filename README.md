# npm-package-user-scripts-gui

GUI interface to `npm-package-user-scripts-list` command.

The idea of this tool came to my mind when I tried to introduce my son to the
development of node projects and manage them using npm scripts from the
console.

This script scans current project (in running path) `package.json` commands (see
[npm-package-user-scripts-list](https://github.com/lilliputten/npm-package-user-scripts-list)
for parsing details) and shows minimalistic window for interactive running your
service tasks.

Take in mind that the content of the log tab is updated only after the command
is completed. All logs are doubled on stdout.

## Requirements

See [LibUI-Node Requirements](https://github.com/parro-it/libui-node#prerequisites).

## Installation

For current project:

```shell
npm i -D npm-package-user-scripts-gui
```
Global:
```shell
npm i -g npm-package-user-scripts-gui
```

## Usage

In js code:

```js
const ScriptCommandsGUI = require('./');

const commandsWindow = new ScriptCommandsGUI({

  // NOTE: Options are optional :)
  // TODO: Create avalable options reference

  /** Format datetime for logging
   * @see [felixge/node-dateformat](https://github.com/felixge/node-dateformat)
   */
  dateformat: 'yyyy.mm.dd, HH:MM:ss',

  /** Window width (0=auto width) */
  width: 300,

  /** Window title */
  title: 'NPM Commands',

});

commandsWindow.showWindow();
```

See section __Options__ below.

Windows shell command line:
```shell
$ start /B npm-package-user-scripts-gui
```

Linux/MacOS shell command line:
```shell
$ npm-package-user-scripts-gui &
```

## Options

<!-- options begin -->
<!-- generated via `scan-options.sh` at 2018.11.27 00:25:48 -->
- **execOptions**: Exec options (default: `{}`)
- **dateformat**: Format datetime for logging; @see [felixge/node-dateformat](https://github.com/felixge/node-dateformat) (default: `'yyyy.mm.dd HH:MM:ss'`)
- **width**: Window width (0=auto) (default: `600`)
- **height**: Window height (0=auto) (default: `400`)
- **title**: Window title (if can't to generate from `package.json`'s `name` field) (default: `'NPM Commands'`)
- **commands**: Commands list (default: `{ test: { title: 'Test' } }`)
- **buttonSpaces**: Spaces for adding before and after button text (default: `' '`)
<!-- options end -->

## Screenshots

Initial screen:

![Initial screen](screenshots/01-initial-screen.png "Initial screen")

Running command:

![Running command](screenshots/02-lint-running.png "Running command")

Successfully finished command:

![Successfully finished command](screenshots/03-lint-done.png "Successfully finished command")

Log tab:

![Log tab](screenshots/04-log-screen.png "Log tab")

Failed command:

![Failed command](screenshots/05-lint-error.png "Failed command")

Show error in the log tab:

![Show error in the log tab](screenshots/06-lint-error-log.png "Show error in the log tab")

## See also:

- [lilliputten/npm-package-user-scripts-list: List all available npm script commands](https://github.com/lilliputten/npm-package-user-scripts-list)
- [parro-it/libui-node: Node bindings for libui, an awesome native UI library for Unix, OSX and Windows](https://github.com/parro-it/libui-node)

<!--
@version 2018.11.27, 00:27
-->
