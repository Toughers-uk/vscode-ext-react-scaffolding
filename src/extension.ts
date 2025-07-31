import * as vscode from 'vscode';
import { registerFeatureCommand } from './commands/registerFeatureCommand';
import { registerFeatureWithPageCommand } from './commands/registerFeatureWithPageCommand';
import { registerComponentCommand } from './commands/registerComponentCommand';
import { registerHookCommand } from './commands/registerHookCommand';
import { registerStoreZustandCommand } from './commands/registerStoreZustandCommand';
import { registerSmartWizardCommand } from './commands/registerSmartWizardCommand';
import { registerReactToolboxPanel } from './commands/registerReactToolboxPanel';

export function activate(context: vscode.ExtensionContext) {
  registerFeatureCommand(context);
  registerFeatureWithPageCommand(context);
  registerComponentCommand(context);
  registerHookCommand(context);
  registerStoreZustandCommand(context);
  registerSmartWizardCommand(context);
  registerReactToolboxPanel(context);
}

export function deactivate() {}
