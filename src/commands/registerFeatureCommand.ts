import * as vscode from 'vscode';
import { scaffoldReactFeature } from './scaffoldUtils';

export function registerFeatureCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.scaffoldReactFeature',
    async (uri: vscode.Uri) => {
      await scaffoldReactFeature(uri, context);
    }
  );

  context.subscriptions.push(disposable);
}
