'use strict';

import * as vscode from 'vscode';
import * as moment from 'moment';

class PythonCodingToolsExtension {
    private _context: vscode.ExtensionContext;
    // Default values if configuration from package.json isn't available
    private _variableName: string = "__updated__";
    private _dateTimeFmt: string = "YYYY-MM-DD HH:mm:ss";
    private _enableOnSave: boolean = true;

    constructor(context: vscode.ExtensionContext) {
        this._context = context;
        this.loadConfig();
    }

    public updateModuleVariable(editor: vscode.TextEditor, document: vscode.TextDocument): void {
        if (document.languageId !== 'python') {
            return; // Not python
        }
        if (document.isClosed) {
            return; // File already closed
        }

        let pattern = '^' + this._variableName + '(\\s*)=(\\s*)([\'"])(.*)([\'"])$';
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
            if (match !== null) {
                lineNumber = line.lineNumber;
                colStart = this._variableName.length + match[1].length + 1 + match[2].length + match[3].length;
                colEnd = colStart + match[4].length;
                break;
            }
        }

        if (!(lineNumber === null || colStart === null || colEnd === null)) {
            let rangeToReplace = new vscode.Range(new vscode.Position(lineNumber, colStart), new vscode.Position(lineNumber, colEnd));
            let textToReplace = moment().format(this._dateTimeFmt);

            editor.edit(function (edit) {
                edit.replace(rangeToReplace, textToReplace);
            });
        }
    }

    public loadConfig(): void {
        let config = vscode.workspace.getConfiguration('python-coding-tools.update-module-variable');
        let enableOnSave = config.get<boolean>('enableOnSave');
        if (enableOnSave !== undefined) {
            this._enableOnSave = enableOnSave;
        }
        let dateTimeFmt = config.get<string>('dateTimeFmt');
        if (dateTimeFmt !== undefined) {
            this._dateTimeFmt = dateTimeFmt;
        }
        let variableName = config.get<string>('variableName');
        if (variableName !== undefined) {
            this._variableName = variableName;
        }
    }

    public isEnabledOnSave(): boolean {
        return this._enableOnSave;
    }
}

export function activate(context: vscode.ExtensionContext) {
    let extension = new PythonCodingToolsExtension(context);

    context.subscriptions.push(vscode.commands.registerCommand('extension.python-coding-tools.update-module-variable', () => {
        if (!vscode.window) {
            return;
        }
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        extension.updateModuleVariable(editor, editor.document);
    }));

    let onWillSave: vscode.Disposable | null = null;
    if (extension.isEnabledOnSave()) {
        onWillSave = vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
            vscode.commands.executeCommand('extension.python-coding-tools.update-module-variable');
        });
        context.subscriptions.push(onWillSave);
    }

    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
        extension.loadConfig();

        if (extension.isEnabledOnSave()) {
            if (onWillSave === null) {
                context.subscriptions.push(vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
                    vscode.commands.executeCommand('extension.python-coding-tools.update-module-variable');
                }));
            }
        } else {
            if (onWillSave !== null) {
                onWillSave.dispose();
                onWillSave = null;
            }
        }
    }));

}

export function deactivate() {
}
