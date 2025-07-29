import * as vscode from 'vscode';
import { registerFeatureCommand } from './commands/registerFeatureCommand';
import { registerFeatureWithPageCommand } from './commands/registerFeatureWithPageCommand';
import { registerComponentCommand } from './commands/registerComponentCommand';
import { registerHookCommand } from './commands/registerHookCommand';
import { registerStoreZustandCommand } from './commands/registerStoreZustandCommand';

export function activate(context: vscode.ExtensionContext) {
  registerFeatureCommand(context);
  registerFeatureWithPageCommand(context);
  registerComponentCommand(context);
  registerHookCommand(context);
  registerStoreZustandCommand(context);
}

export function deactivate() {}
