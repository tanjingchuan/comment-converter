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
    const convertedLines: string[] = [];
    
    lines.forEach(line => {
        // Handle end-of-line comments
        let match = line.match(/^(\s*)(.*?)(\s*)\/\/\s*(.*)$/);
        if (match) {
            const indent = match[1];
            const code = match[2].trimRight();
            const comment = match[4];
            if (code) {
                convertedLines.push(`${indent}/** ${comment} */`);
                convertedLines.push(`${indent}${code}`);
            } else {
                convertedLines.push(`${indent}/** ${comment} */`);
            }
        } else {
            convertedLines.push(line);
        }
    });

    return convertedLines.join('\n');
}

export function deactivate() {}