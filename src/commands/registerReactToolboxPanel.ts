import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function registerReactToolboxPanel(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.openReactToolbox', () => {
    const panel = vscode.window.createWebviewPanel(
      'reactToolbox',
      'React Toolbox',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'media')),
          vscode.Uri.file(path.join(context.extensionPath, 'media/snippets')),
          vscode.Uri.file(path.join(context.extensionPath, 'media/snippets/components')),
          vscode.Uri.file(path.join(context.extensionPath, 'media/snippets/functions')),
          vscode.Uri.file(path.join(context.extensionPath, 'media/snippets/hooks')),
        ],
        retainContextWhenHidden: true,
      }
    );

    panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'icon-32x32.png'));

    panel.webview.html = getWebviewContent(context, panel.webview);
    panel.webview.onDidReceiveMessage((msg) => {
      if (msg.type === 'insertSnippet') {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          editor.edit((editBuilder) => {
            editBuilder.insert(editor.selection.active, msg.snippet);
          });
        }
      }
    });
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(context: vscode.ExtensionContext, webview: vscode.Webview): string {
  const mediaPath = path.join(context.extensionPath, 'media');
  const htmlPath = path.join(mediaPath, 'toolbox.html');
  const cssUri = webview.asWebviewUri(vscode.Uri.file(path.join(mediaPath, 'toolbox.css')));
  const jsUri = webview.asWebviewUri(vscode.Uri.file(path.join(mediaPath, 'toolbox.js')));

  const rawSnippets = fs.readFileSync(path.join(mediaPath, 'snippets.json'), 'utf-8');
  const parsedSnippets = JSON.parse(rawSnippets);

  const updatedSnippets = parsedSnippets.map((snippet: any) => {
    const fullFilePath = path.join(mediaPath, snippet.file);
    return {
      ...snippet,
      file: webview.asWebviewUri(vscode.Uri.file(fullFilePath)).toString(),
    };
  });

  const encodedSnippets = JSON.stringify(updatedSnippets);

  let html = fs.readFileSync(htmlPath, 'utf-8');

  html = html.replace('href="toolbox.css"', `href="${cssUri}"`);
  html = html.replace('src="toolbox.js"', `src="${jsUri}"`);
  html = html.replace(
    `<script src="${jsUri}"></script>`,
    `<script>window._snippets = ${encodedSnippets};</script>\n<script src="${jsUri}"></script>`
  );

  return html;
}
