import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.convertComments', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        const selection = editor.selection;

        const text = document.getText(selection);
        const convertedText = convertComments(text);

        editor.edit(editBuilder => {
            editBuilder.replace(selection, convertedText);
        });
    });

    context.subscriptions.push(disposable);
}

function convertComments(text: string): string {
    const lines = text.split('\n');
    const convertedLines = lines.map(line => {
        const match = line.match(/^\s*\/\/\s*(.*)$/);
        if (match) {
            return `/* ${match[1]} */`;
        }
        return line;
    });
    return convertedLines.join('\n');
}

export function deactivate() {}