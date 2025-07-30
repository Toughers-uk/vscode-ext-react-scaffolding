# vscode-ext-react-scaffolding

A VS Code extension designed to help users quickly scaffold features/component file/folder structure.

## Packaging & Installation

### Package Extension

Run the below command:

```ps
vsce package
```

This will create a file like `vscode-ext-react-scaffolding-0.0.1.vsix`

**NB:** The following are required in the `package.json` for the above package command to work.

```json
  ...
  "publisher": "<e.g. git username>",
  "repository": {
    "type": "git",
    "url": "https://github.com/<git repo path>.git"
  },
  ...
```

### Install Extension

Install the VSIX using one of the following options:

#### Option 1 - UI

Open a regular VS Code instance > Extensions > ... > Install from VSIX > Select `.vsix` file > Reload/Restart VS Code

#### Option 2 - Symlink

_Use this option for live development while using on local projects_

```ps
npm install
npm run compile
code --install-extension vscode-ext-react-scaffolding-0.0.1.vsix
```

### Publish Extension

1. [Create a publisher](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
2. Use `vsce publish` to push it
