import * as vscode from 'vscode';
import { scaffoldReactFeature } from './scaffoldUtils';

export function registerFeatureWithPageCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.scaffoldReactFeatureWithPage',
    async (uri: vscode.Uri) => {
      await scaffoldReactFeature(uri, context, true);
    }
  );

  context.subscriptions.push(disposable);
}
