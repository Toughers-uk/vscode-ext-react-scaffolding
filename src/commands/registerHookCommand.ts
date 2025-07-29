import * as vscode from 'vscode';
import { scaffoldReactHook } from './scaffoldUtils';

export function registerHookCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.scaffoldReactHook',
    async (uri: vscode.Uri) => {
      await scaffoldReactHook(uri, context);
    }
  );

  context.subscriptions.push(disposable);
}
