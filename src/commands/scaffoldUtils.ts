import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as mustache from 'mustache';

type Config = {
  include: string[];
  styleExtension: string;
  useIndexFile: boolean;
};

const defaultConfig: Config = {
  include: ['component', 'css', 'types'],
  styleExtension: 'css',
  useIndexFile: false,
};

function validate(uri: vscode.Uri): boolean {
  if (!uri || !fs.lstatSync(uri.fsPath).isDirectory()) {
    vscode.window.showErrorMessage('Please right-click on a folder.');
    return false;
  }

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('Could not determine workspace root.');
    return false;
  }

  return true;
}

function loadUserConfig(workspacePath: string): Config {
  const configPath = path.join(workspacePath, '.reactscaffoldrc');
  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, 'utf-8');
      return { ...defaultConfig, ...JSON.parse(raw) };
    } catch (e) {
      vscode.window.showErrorMessage('Failed to parse .reactscaffoldrc. Using defaults.');
      return defaultConfig;
    }
  }

  return defaultConfig;
}

export async function scaffoldReactComponent(uri: vscode.Uri, context: vscode.ExtensionContext) {
  if (!validate) return;
  const config = loadUserConfig(vscode.workspace.getWorkspaceFolder(uri)!.uri.fsPath);

  const name = await vscode.window.showInputBox({
    prompt: 'Enter component name',
    placeHolder: 'e.g., Button',
  });

  if (!name) return;

  const targetDir = path.join(uri.fsPath, name);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  // Determine which files to include based on config
  const include = ['component', 'css'];
  if (config.useIndexFile) {
    include.push('index');
  }

  const templates = [
    {
      type: 'component',
      extension: 'tsx',
      fileName: 'component.tsx.mustache',
    },
    {
      type: 'css',
      extension: config.styleExtension ?? 'css',
      fileName: 'css.mustache',
    },
    {
      type: 'index',
      extension: 'ts',
      fileName: 'index.ts.mustache',
    },
  ];

  const templateDir = path.join(context.extensionPath, 'templates');

  for (const kind of include) {
    const template = templates.find((temp) => temp.type === kind);
    if (!template) continue;

    const rendered = mustache.render(
      fs.readFileSync(path.join(templateDir, template.fileName), 'utf-8'),
      { name, styleExtension: config.styleExtension, type: 'component' }
    );

    let fileName = `${name}.${template.extension}`;
    if (kind === 'index') fileName = 'index.ts';

    fs.writeFileSync(path.join(targetDir, fileName), rendered, 'utf-8');
  }

  vscode.window.showInformationMessage(`Scaffolded component: ${name}`);
}

export async function scaffoldReactFeature(
  uri: vscode.Uri,
  context: vscode.ExtensionContext,
  includesPage: boolean = false
) {
  if (!validate) return;
  const config = loadUserConfig(vscode.workspace.getWorkspaceFolder(uri)!.uri.fsPath);

  const name = await vscode.window.showInputBox({
    prompt: 'Enter feature name',
    placeHolder: 'e.g., Dashboard',
  });

  if (!name) return;

  const rootDir = path.join(uri.fsPath, name);
  const pagesDir = path.join(rootDir, 'pages');
  const componentsDir = path.join(rootDir, 'components');

  let dirs = includesPage ? [rootDir, pagesDir, componentsDir] : [rootDir];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  });

  const templateDir = path.join(context.extensionPath, 'templates');

  const templates = [
    {
      type: 'page',
      extension: 'tsx',
      fileName: 'page.tsx.mustache',
      folder: pagesDir,
      forceName: `${name}Page`,
    },
    {
      type: 'css',
      extension: config.styleExtension ?? 'css',
      fileName: 'css.mustache',
      folder: pagesDir,
      forceName: `${name}Page`,
    },
    {
      type: 'component',
      extension: 'tsx',
      fileName: 'component.tsx.mustache',
      folder: componentsDir,
      forceName: `${name}`,
    },
    {
      type: 'css',
      extension: config.styleExtension ?? 'css',
      fileName: 'css.mustache',
      folder: componentsDir,
      forceName: `${name}`,
    },
    {
      type: 'types',
      extension: 'ts',
      fileName: 'types.ts.mustache',
      folder: rootDir,
    },
    {
      type: 'api',
      extension: 'ts',
      fileName: 'api.ts.mustache',
      folder: rootDir,
    },
    {
      type: 'store',
      extension: 'ts',
      fileName: 'store.ts.mustache',
      folder: rootDir,
    },
    {
      type: 'index',
      extension: 'ts',
      fileName: 'index.ts.mustache',
      folder: rootDir,
    },
  ];

  for (const template of templates) {
    if (!fs.existsSync(path.join(templateDir, template.fileName))) continue;
    if (!includesPage && template.folder === pagesDir) continue;
    if (includesPage && template.folder === componentsDir) continue;

    const rendered = mustache.render(
      fs.readFileSync(path.join(templateDir, template.fileName), 'utf-8'),
      { name: template.forceName ?? name, styleExtension: config.styleExtension, type: 'feature' }
    );

    const fileName = `${template.forceName ?? template.type}.${template.extension}`;
    const filePath = includesPage
      ? path.join(template.folder, fileName)
      : path.join(rootDir, fileName);
    fs.writeFileSync(filePath, rendered, 'utf-8');
  }

  vscode.window.showInformationMessage(
    `Scaffolded feature: ${name}${includesPage ? ' (w/Page)' : ''}`
  );
}

export async function scaffoldReactHook(uri: vscode.Uri, context: vscode.ExtensionContext) {
  let name = await vscode.window.showInputBox({
    prompt: `Enter hook name (excluding 'use' prefix)`,
    placeHolder: 'e.g., PermissionsCheck',
  });

  if (!name) return;

  name = `use${name}`;

  const targetDir = uri.fsPath;
  const templateDir = path.join(context.extensionPath, 'templates');

  const rendered = mustache.render(
    fs.readFileSync(path.join(templateDir, 'hook.ts.mustache'), 'utf-8'),
    { name }
  );

  let fileName = `${name}.ts`;
  fs.writeFileSync(path.join(targetDir, fileName), rendered, 'utf-8');
  vscode.window.showInformationMessage(`Scaffolded hook: ${name}`);
}

export async function scaffoldReactStoreZustand(uri: vscode.Uri, context: vscode.ExtensionContext) {
  const name = await vscode.window.showInputBox({
    prompt: `Enter store name`,
    placeHolder: 'e.g., auth -> (will result in auth.store.ts)',
  });

  if (!name) return;

  const targetDir = uri.fsPath;
  const templateDir = path.join(context.extensionPath, 'templates');

  const rendered = mustache.render(
    fs.readFileSync(path.join(templateDir, 'store.zustand.ts.mustache'), 'utf-8'),
    { name: name.charAt(0).toUpperCase() + name.slice(1) }
  );

  let fileName = `${name}.store.ts`;
  fs.writeFileSync(path.join(targetDir, fileName), rendered, 'utf-8');
  vscode.window.showInformationMessage(`Scaffolded store: ${name}`);
}
