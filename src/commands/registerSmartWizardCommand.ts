import * as vscode from 'vscode';
import {
  scaffoldReactComponent,
  scaffoldReactFeature,
  scaffoldReactHook,
  scaffoldReactStoreZustand,
} from './scaffoldUtils';

export function registerSmartWizardCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.scaffoldReactSmartWizard',
    async () => {
      const type = await vscode.window.showQuickPick(
        ['Feature', 'Feature (w/Page)', 'Component', 'Hook', 'Store (Zustand)'],
        { title: 'What would you like to scaffold?' }
      );
      if (!type) return;

      const folderUris = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        openLabel: 'Select target folder for scaffold',
      });

      if (!folderUris?.length) return;
      const uri = folderUris[0];

      switch (type) {
        case 'Feature':
          await scaffoldReactFeature(uri, context, false);
          break;
        case 'Feature (w/Page)':
          await scaffoldReactFeature(uri, context, true);
          break;
        case 'Component':
          await scaffoldReactComponent(uri, context);
          break;
        case 'Hook':
          await scaffoldReactHook(uri, context);
          break;
        case 'Store (Zustand)':
          await scaffoldReactStoreZustand(uri, context);
          break;
      }
    }
  );

  context.subscriptions.push(disposable);
}
