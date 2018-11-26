# npm-package-user-scripts-gui

GUI interface to `npm-package-user-scripts-list` command.

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

Windows commandline:
```shell
start /B npm-package-user-scripts-gui
```

Linux/MacOS  commandline:
```shell
npm-package-user-scripts-gui &
```

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

