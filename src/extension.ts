'use strict';

import * as vscode from 'vscode';
import * as moment from 'moment';

class PythonCodingToolsExtension {
    private _context: vscode.ExtensionContext;
    private _variableName: string;
    private _dateTimeFmt: string;
    private _enableOnSave: boolean;

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

        let lineNumber = null;
        let colStart = null;
        let colEnd = null;
        for (let i = 0; i < document.lineCount; i++) {
            let line = document.lineAt(i);
            if (line.isEmptyOrWhitespace) {
                continue;
            }
            let match = re.exec(line.text);
            if (match != null) {
                lineNumber = line.lineNumber;
                colStart = this._variableName.length + match[1].length + 1 + match[2].length + match[3].length;
                colEnd = colStart + match[4].length;
                break;
            }
        }

        if (!(lineNumber == null || colStart == null || colEnd == null)) {
            let rangeToReplace = new vscode.Range(new vscode.Position(lineNumber, colStart), new vscode.Position(lineNumber, colEnd));
            let textToReplace = moment().format(this._dateTimeFmt);

            editor.edit(function (edit) {
                edit.replace(rangeToReplace, textToReplace);
            });
        }
    }

    public loadConfig(): void {
        let config = vscode.workspace.getConfiguration('python-coding-tools.update-module-variable');
        this._enableOnSave = config.get<boolean>('enableOnSave');
        this._dateTimeFmt = config.get<string>('dateTimeFmt');
        this._variableName = config.get<string>('variableName');
    }

    public isEnabledOnSave(): boolean {
        return this._enableOnSave;
    }
}

export function activate(context: vscode.ExtensionContext) {
    var extension = new PythonCodingToolsExtension(context);

    context.subscriptions.push(vscode.commands.registerCommand('extension.python-coding-tools.update-module-variable', () => {
        extension.updateModuleVariable(vscode.window.activeTextEditor.document);
    }));

    let onWillSave = null;
    if (extension.isEnabledOnSave()) {
        onWillSave = vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
            vscode.commands.executeCommand('extension.python-coding-tools.update-module-variable');
        });
        context.subscriptions.push(onWillSave);
    }

    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
        extension.loadConfig();

        if (extension.isEnabledOnSave()) {
            if (onWillSave == null) {
                context.subscriptions.push(vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
                    vscode.commands.executeCommand('extension.python-coding-tools.update-module-variable');
                }));
            }
        } else {
            if (onWillSave != null) {
                onWillSave.dispose();
                onWillSave = null;
            }
        }
    }));

}

export function deactivate() {
}
