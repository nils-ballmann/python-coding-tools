'use strict';

import * as vscode from 'vscode';
import * as moment from 'moment';

class PythonCodingToolsExtension {
    private _context: vscode.ExtensionContext;
    private _variableName: string;
    private _dateTimeFmt: string;

    constructor(context: vscode.ExtensionContext) {
        this._context = context;
        this.loadConfig();
    }

    public updateModuleVariable(document: vscode.TextDocument): void {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Open a python file to update a module variable.');
            return; // No open text editor
        }
        if (document.languageId != 'python') {
            vscode.window.showInformationMessage('Document "' + document.fileName + '" is not a python file.');
            return; // Not python
        }
        if (document.isClosed) {
            vscode.window.showInformationMessage('Document "' + document.fileName + '" is already closed.');
            return; // File already closed
        }

        let pattern = '^' + this._variableName + '(\\s*)=(\\s*)([\'"])(.*)([\'"])$'
        let re = new RegExp(pattern);

        for (let i = 0; i < document.lineCount; i++) {
            let line = document.lineAt(i);
            let match = re.exec(line.text);
            if (match != null) {
                var lineNumber = line.lineNumber;
                var colStart = this._variableName.length + match[1].length + 1 + match[2].length + match[3].length;
                var colEnd = colStart + match[4].length;
                break;
            }
        }

        let rangeToReplace = new vscode.Range(new vscode.Position(lineNumber, colStart), new vscode.Position(lineNumber, colEnd));
        let textToReplace = moment().format(this._dateTimeFmt);

        editor.edit(function (edit) {
            edit.replace(rangeToReplace, textToReplace);
        });
    }

    public loadConfig(): void {
        this._dateTimeFmt = <any>vscode.workspace.getConfiguration('python-coding-tools.dateTimeFmt');
        this._variableName = <any>vscode.workspace.getConfiguration('python-coding-tools.variableName');
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('python-coding-tools activated');

    var extension = new PythonCodingToolsExtension(context);

    context.subscriptions.push(vscode.commands.registerCommand('extension.python-coding-tools.update-module-variable', () => {
        extension.updateModuleVariable(vscode.window.activeTextEditor.document);
    }));

    context.subscriptions.push(vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
        vscode.commands.executeCommand('extension.python-coding-tools.update-module-variable');
    }));
}

export function deactivate() {
    console.log('python-coding-tools deactivated')
}
