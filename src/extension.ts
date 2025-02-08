import * as vscode from "vscode";
import axios from "axios";

type Code = {
  value: string;
  target: vscode.Uri;
};

type NugetPackage = {
  id: string;
  version: string;
  description: string;
  summary: string;
  title: string;
  iconUrl: string;
  licenseUrl: string;
  projectUrl: string;
  authors: string[];
  owners: string[];
  totalDownloads: number;
  verified: boolean;
};

export function activate(context: vscode.ExtensionContext)
{
  const provider = new MissingNamespaceProvider();

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("csharp", provider, {
      providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.searchNuget",
      async (packageName: string) =>
      {
        const packages = await searchNugetPackages(packageName);
        if (!packages) {
          return;
        }
        const selected = await vscode.window.showQuickPick(
          packages.map((pkg) => pkg.id),
          { placeHolder: "Select a package to install" }
        );

        if (selected) {
          installNugetPackage(selected);
        }
      }
    )
  );
}

export class MissingNamespaceProvider implements vscode.CodeActionProvider
{
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] | undefined
  {
    const diagnostic = context.diagnostics.find(
      (diag) => (diag.code as Code).value === "CS0246"
    );
    if (!diagnostic) {
      return;
    }

    const packageName = diagnostic.message.split("'")[1];
    if (!packageName) {
      return;
    }

    const fixAction = new vscode.CodeAction(
      `Search for NuGet package to resolve '${packageName}'`,
      vscode.CodeActionKind.QuickFix
    );

    fixAction.command = {
      command: "extension.searchNuget",
      title: "Search NuGet",
      arguments: [packageName],
    };

    return [fixAction];
  }
}

export async function searchNugetPackages(
  query: string
): Promise<NugetPackage[]>
{
  const response = await axios
    .get(
      `https://azuresearch-usnc.nuget.org/query?q=${encodeURIComponent(query)}`
    )
    .catch((err) =>
    {
      vscode.window.showErrorMessage(
        `Failed to search for packages: ${err.message}`
      );
      return undefined;
    });

  return response?.data.data.slice(0, 5);
}

export function installNugetPackage(packageName: string)
{
  const command = 'dotnet add package ' + packageName;
  const shellExecution = new vscode.ShellExecution(command);
  vscode.window.showInformationMessage(`Installing NuGet package ${packageName}...\nRunning: ${command}`);
  vscode.tasks.executeTask(
    new vscode.Task(
      { type: "shell" },
      vscode.TaskScope.Workspace,
      "NuGet Install",
      "Nuget",
      shellExecution
    )
  );
}