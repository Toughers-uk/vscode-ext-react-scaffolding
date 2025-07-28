import * as vscode from 'vscode';
import { registerFeatureCommand } from './commands/registerFeatureCommand';
import { registerFeatureWithPageCommand } from './commands/registerFeatureWithPageCommand';
import { registerComponentCommand } from './commands/registerComponentCommand';

export function activate(context: vscode.ExtensionContext) {
  registerFeatureCommand(context);
  registerFeatureWithPageCommand(context);
  registerComponentCommand(context);
}

export function deactivate() {}
