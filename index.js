/* eslint-env es6, node, commonjs */
/* eslint-disable no-console */
/**
 * @author lilliputten <lilliputten@yandex.ru>
 * @desc GUI interface to `npm-package-user-scripts-list` command
 * @since 2018.11.26, 03:00
 * @version 2018.11.26, 03:00
 */

const scriptsList = require('npm-package-user-scripts-list');
const inherit = require('inherit');
const libui = require('libui-node');
const {exec} = require('child_process');
const dateformat = require('dateformat');

/** class ScriptCommandsWindow ** {{{
 */
const ScriptCommandsWindow = inherit(/** @lends ScriptCommandsWindow.prototype */{

  /** Exec options */
  execOptions: {
  },

  /** Format datetime for logging
   * @see [felixge/node-dateformat](https://github.com/felixge/node-dateformat)
   */
  dateformat: 'yyyy.mm.dd, HH:MM:ss',
  // dateformat: 'yymmdd-HHMMss',

  /** Window width (0=auto width) */
  width: 300,

  /** Window title */
  title: 'NPM Commands',

  /** Commands list */
  commands: { test: { title: 'Test' } },

  /** Spaces for adding before and after button text */
  buttonSpaces: '  ',

  /** __constructor ** {{{
   * @param {Object} props
   * @param {Number} [props.width] - Window width (0=auto)
   * @param {String} [props.title] - Window title
   * @param {Object} [props.execOptions] - Options for child_process.exec @see [child_process.exec](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)
   */
  __constructor: function(props = {}) {

    // Load commands list
    this.commands = scriptsList.getScripts();

    // Set all passed params...
    Object.keys(props).map((param) => {
      if (this[param] && props[param]) {
        this[param] = props[param];
      }
    });

  },/*}}}*/

  /** setActionButtonText ** {{{
   * @param {String} id
   * @param {String} [title]
   */
  setActionButtonText: function (id, title) {
    const action = this.commands[id] || {};
    title = title || action.title;
    if (action.button && action.button.getText() !== title) {
      action.button.setText(this.buttonSpaces + title + this.buttonSpaces);
    }
  },/*}}}*/

  /** actionFinished ** {{{
   * @param {String} id
   * @param {String} [title]
   */
  actionFinished: function(id, title) {
    const action = this.commands[id] || {};
    action.runningNow = false;
    this.setActionButtonText(id, title);
    action.button && action.button.setEnabled(true);
  },/*}}}*/

  /** getDateTag ** {{{
   */
  getDateTag: function() {
    const now = Date.now();
    const dateTag = dateformat(now, this.dateformat);
    return dateTag;
  },/*}}}*/

  /** writeLog ** {{{
   */
  writeLog: function(type, message) {
    const dateTag = this.getDateTag();
    let line = ( type ? '[' + dateTag + ' ' + type + ']: ' : '' ) + message;
    console.log(line);
  },/*}}}*/
  /** log ** {{{
   * @param {String} message...
   */
  log: function() {
    const message = Array.from(arguments).map(s => String(s)).join(' ');
    this.writeLog('LOG', message);
  },/*}}}*/
  /** error ** {{{
   * @param {String} message...
   */
  error: function() {
    const message = Array.from(arguments).map(s => String(s)).join(' ');
    this.writeLog('ERROR', message);
  },/*}}}*/

  /** actionStart ** {{{
   * @param {String} id
   */
  actionStart: function(id) {

    const action = this.commands[id];

    const execOptions = Object.assign({}, this.execOptions, {
      // windowsHide: !action.showConsole,
    });

    this.log('Command `' + id + '` running...');
    action.child = exec('npm run -s ' + id + ' 2>&1', execOptions, (error, stdout, stderr) => {
      if (stdout) {
        this.log('DONE\n' + String(stdout));
      }
      if (error || stderr) {
        this.error(error || stderr);
        /*DEBUG*/debugger;// eslint-disable-line no-debugger
      }
      this.actionFinished(id);
    });

    action.runningNow = true;
    this.setActionButtonText(id, action.title + ' (Running)');
    action.button && action.button.setEnabled(false);

  },/*}}}*/

  /** buttonAction ** {{{
   * @param {String} id
   */
  buttonAction: function(id) {

    // const action = this.commands[id];

    // if (action.runningNow) {
    //   // TODO: Terminate process
    //   // action.runningNow = false;
    //   title += ' (Canceled)';
    // }

    this.actionStart(id);

  },/*}}}*/

  /** placeButtons ** {{{
   * @param {UiVerticalBox} box
   */
  placeButtons: function placeButtons(box) {

    const buttons = new libui.UiVerticalBox();

    const scriptKeys = Object.keys(this.commands);
    scriptKeys.map((id) => {
      const action = this.commands[id];
      const title = action.title;
      const buttonTitle = this.buttonSpaces + title + this.buttonSpaces;
      const button = new libui.UiButton(buttonTitle);
      action.button = button;
      button.onClicked(() => this.buttonAction(id));
      buttons.append(button, false);
    });

    box.append(buttons, false);

  },/*}}}*/

  /** showWindow ** {{{ Show window
   */
  showWindow: function showWindow() {

    this.log('START');

    const win = new libui.UiWindow(this.title, this.width, 20, false);
    win.margined = 1;

    win.onClosing(() => {
      win.close();
      libui.stopLoop();
      this.log('EXIT');
    });

    const box = new libui.UiVerticalBox();

    this.placeButtons(box);

    win.setChild(box);

    win.show();
    libui.startLoop();

  },/*}}}*/

});/*}}}*/

module.exports = ScriptCommandsWindow;
