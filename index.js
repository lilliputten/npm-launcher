/* eslint-env es6, node, commonjs */
/* eslint-disable no-console */
/**
 * @author lilliputten <lilliputten@yandex.ru>
 * @desc GUI interface to `npm-package-user-scripts-list` command
 * @since 2018.11.26, 03:00
 * @version 2018.11.27, 00:34
 */

const scriptsList = require('npm-package-user-scripts-list');
const path = require('path');
const inherit = require('inherit');
const libui = require('libui-node');
const {exec} = require('child_process');
const dateformat = require('dateformat');
const clipboardy = require('clipboardy');

/** @class ScriptCommandsWindow */
const ScriptCommandsWindow = inherit(/** @lends ScriptCommandsWindow.prototype */{

  /*{{{ Propeties... */

  /** Exec options (for `child_process.exec`);
   * @see [child_process.exec](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)
   */
  execOptions: {},

  /** Format datetime for logging;
   * @see [felixge/node-dateformat](https://github.com/felixge/node-dateformat)
   */
  dateformat: 'yyyy.mm.dd HH:MM:ss',

  /** Minimal window width */
  width: 600,

  /** Minimal window height */
  height: 400,

  /** Window title (if can't to generate from `package.json`'s `name` field) */
  title: 'NPM Commands',

  /** Commands list */
  commands: { test: { title: 'Test' } },

  /** Spaces for adding before and after button text */
  buttonSpaces: '  ',

  /* ...Properties }}}*/

  // Logging...

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
    const text = ( type ? '[' + dateTag + ' ' + type + ']: ' : '' ) + message;
    this.logEntry && this.logEntry.append(text + '\n');
    console.log(text);
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
  /** clearLog ** {{{
   */
  clearLog: function(){
    this.logEntry && this.logEntry.setText('');
  },/*}}}*/
  /** copyLog ** {{{
   */
  copyLog: function(){
    if (this.logEntry) {
      var text = this.logEntry.getText();
      clipboardy.write(text);
    }
  },/*}}}*/
  /** logDelim ** {{{
   */
  logDelim: function(){
    this.writeLog('', '--------------------------------------------------------------------------------');
  },/*}}}*/

  // Actions...

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

  /** actionShowResults ** {{{
   * @param {Object} props
   * @param {String} props.id
   * @param {String} props.status
   * @param {String} [props.title]
   * @param {String} [props.elapsedTime]
   */
  actionShowResults: function(props) {
    const {id} = props;
    const action = this.commands[id] || {};
    if (!props.title || !props.status) {
      props = Object.assign({ title: action.title, status: 'OK' }, props);
    }
    Object.keys(props).map((id) => {
      this.showResultsItemInfo(id, props[id]);
    });
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

  /** actionStart ** {{{
   * @param {String} id
   */
  actionStart: function(id) {

    const action = this.commands[id];
    const startTime = Date.now();

    const execOptions = Object.assign({}, this.execOptions, {
      // windowsHide: !action.showConsole,
    });

    this.log('Running:', id, '...');
    action.child = exec('npm run -s ' + id + ' 2>&1', execOptions, (error, stdout, stderr) => {
      const endTime = Date.now();
      const elapsedTime = String(endTime - startTime) + ' ms';
      let status = 'SUCCESS';
      if (stdout) {
        this.log('Finished in ' + elapsedTime + '\n' + String(stdout));
      }
      if (error || stderr) {
        this.error(error || stderr);
        /*DEBUG*/debugger;// eslint-disable-line no-debugger
        status = 'ERROR';
      }
      this.logDelim();
      this.actionShowResults({ id, elapsedTime, status });
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

  // Window construction...

  /** placeButtons ** {{{
   * @param {UiVerticalBox} box
   */
  placeButtons: function(box) {

    const group = new libui.UiGroup(' Commands list ');
    group.margined = true;

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

    group.setChild(buttons);
    box.append(group, true);

  },/*}}}*/
  /** showResultsItemInfo ** {{{
   * @param {String} id
   * @param {String} [value]
   */
  showResultsItemInfo: function(id, value='') {
    if (this.resultElems && this.resultElems[id]) {
      this.resultElems[id].setText(value);
    }
  },/*}}}*/
  /** addResultsItem ** {{{
   * @param {UiContainer} container
   * @param {String} id
   * @param {String} title
   * @param {String} [value]
   */
  addResultsItem: function(container, id, title, value='') {

    const hBox = new libui.UiHorizontalBox();

    const eLabel = new libui.UiLabel(title + ': ');
    hBox.append(eLabel, false);

    const eItem = new libui.UiLabel(value);
    hBox.append(eItem, false);

    container.append(hBox, false);

    // Store element...
    ( this.resultElems || (this.resultElems = {}) )[id] = eItem;

  },/*}}}*/
  /** placeResults ** {{{
   * @param {UiVerticalBox} box
   */
  placeResults: function(box) {

    const group = new libui.UiGroup(' Last command ');
    group.margined = true;

    const container = new libui.UiVerticalBox();

    this.addResultsItem(container, 'status', 'Status');
    this.addResultsItem(container, 'elapsedTime', 'Elapsed time');
    this.addResultsItem(container, 'id', 'Command');
    this.addResultsItem(container, 'title', 'Name');

    group.setChild(container);
    box.append(group, true);

  },/*}}}*/

  /** placeLogBox ** {{{
   * @param {UiVerticalBox} box
   */
  placeLogBox: function(box){

    const logEntry = new libui.UiMultilineEntry();
    box.append(logEntry, true);

    const hBox = new libui.UiHorizontalBox();

    const copyLogButton = new libui.UiButton(' Copy to clipboard ');
    this.copyLog && copyLogButton.onClicked(() => this.copyLog());
    hBox.append(copyLogButton, false);

    const clearLogButton = new libui.UiButton(' Clear all ');
    this.clearLog && clearLogButton.onClicked(() => this.clearLog());
    hBox.append(clearLogButton, false);

    box.append(hBox, false);

    // Save entry for logging functions
    this.logEntry = logEntry;

  },/*}}}*/

  // External interface...

  /** __constructor ** {{{
   * @param {Object} props
   * @param {Number} [props.width] - Window width (0=auto)
   * @param {Number} [props.height] - Window width (0=auto)
   * @param {String} [props.title] - Window title
   * @param {Object} [props.execOptions] - Options for child_process.exec @see [child_process.exec](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)
   */
  __constructor: function(props = {}) {

    // Evaluate window title from project name (later m.b. overwritten from `props`)
    const pkgFilename = path.join(process.cwd(), 'package.json');
    const pkgData = require(pkgFilename) || {};
    if (pkgData.name) {
      this.prjName = pkgData.name;
      this.title = 'Project [' + this.prjName + '] commands';
    }

    // Load commands list
    this.commands = scriptsList.getScripts();

    // Set all passed params...
    Object.keys(props).map((param) => {
      if (this[param] && props[param]) {
        this[param] = props[param];
      }
    });

  },/*}}}*/

  /** showWindow ** {{{ Show window
   */
  showWindow: function showWindow() {

    const win = new libui.UiWindow(this.title, this.width, this.height, false);
    win.margined = 1;

    win.onClosing(() => {
      win.close();
      libui.stopLoop();
      this.log('EXIT');
    });

    const box = new libui.UiVerticalBox();

    this.placeButtons(box);
    this.placeResults(box);

    const tabs = new libui.UiTab();

    tabs.append('Commands', box);
    const logBox = new libui.UiVerticalBox();
    this.placeLogBox(logBox);
    tabs.append('Log', logBox); // new libui.UiMultilineEntry());

    tabs.setMargined(0, true);
    tabs.setMargined(1, true);

    win.setChild(tabs);
    // win.setChild(box);

    if (this.prjName) {
      this.log('Project:', this.prjName);
    }
    this.log('START');
    this.logDelim();

    win.show();
    libui.startLoop();

  },/*}}}*/

});

module.exports = ScriptCommandsWindow;
