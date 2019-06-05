// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "easy-include" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('easyinclude.addInclude', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInputBox({
			value: 'example_header_file.hpp',
			validateInput: value => {
				if (value.length === 0) {
					return 'Enter a valid include file';
				} else if (value[0] === '\"' && value[value.length -1] !== '\"') {
					return `\`#include ${value}\` is not a valid include statement.`
				} else if (value[0] === '<' && value[value.length -1] !== '>') {
					return `\`#include ${value}\` is not a valid include statement.`
				} else {
					return null;
				}
			}
		}).then(value => {
			if (value) {
				if (value[0] !== '<' && value[0] !== '\"') {
					value = `<${value}>`;
				}

				const editor = vscode.window.activeTextEditor;
				if (editor) {
					const text = editor.document.getText();
					const regex = /[ \t]*#\s*include\s+[<\"][^>\"]*[>\"]/g;
					var match;

					var insertOffset = 0;
					do {
						match = regex.exec(text);
						if (match) {
							insertOffset = match.index + match[0].length + 1;
						}
					} while (match);

					editor.edit((editBuilder) => {
						editBuilder.insert(
							editor.document.positionAt(insertOffset),
							`#include ${value}\n`)
					});
				}
			}
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
