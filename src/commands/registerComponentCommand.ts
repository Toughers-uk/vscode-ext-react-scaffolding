import * as vscode from 'vscode';
import { scaffoldReactComponent } from './scaffoldUtils';

export function registerComponentCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.scaffoldReactComponent',
    async (uri: vscode.Uri) => {
      await scaffoldReactComponent(uri, context);
    }
  );

  context.subscriptions.push(disposable);
}
