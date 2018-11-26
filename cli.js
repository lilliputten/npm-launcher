#!/usr/bin/env node
/* eslint-env es6, node, commonjs */
/* eslint-disable no-console */

const ScriptCommandsGUI = require('./');

const commandsWindow = new ScriptCommandsGUI();

// Show window
commandsWindow.showWindow();
