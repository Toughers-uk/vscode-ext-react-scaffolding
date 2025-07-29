import * as vscode from 'vscode';
import { scaffoldReactStoreZustand } from './scaffoldUtils';

export function registerStoreZustandCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.scaffoldReactStoreZustand',
    async (uri: vscode.Uri) => {
      await scaffoldReactStoreZustand(uri, context);
    }
  );

  context.subscriptions.push(disposable);
}
