# NuGet QuickFix - VS Code Missing NuGet Package Installer

A Visual Studio Code extension that helps resolve missing namespaces in C# projects by searching for and installing the corresponding NuGet packages. When you encounter a `CS0246` error (type or namespace not found), this extension provides a quick fix to search NuGet for a matching package and automatically install it using the .NET CLI.

## Features

- **Quick Fix for Missing Namespaces:** Detects the `CS0246` error and offers a quick fix action.
- **NuGet Package Search:** Uses the NuGet API to search for packages matching the missing namespace.
- **Automated Installation:** Once you select a package from the list, the extension runs `dotnet add package` to install it.

## Usage

1. **Open a C# File:**

   Work on your C# project in VS Code.

2. **Trigger the Quick Fix:**

   When a missing namespace error (`CS0246`) occurs, a lightbulb icon appears. Click on it or press `Ctrl+.` (or `Cmd+.` on macOS) to view the available quick fixes.

3. **Search for the NuGet Package:**

   Select the option:

   ```txt
   Search for NuGet package to resolve 'YourMissingNamespace'
   ```

   The extension extracts the missing namespace from the error message and searches NuGet for relevant packages.

4. **Select and Install:**

   A quick pick list displays the top 5 matching NuGet packages. Select the package you wish to install, and the extension will execute the command:

   ```bash
   dotnet add package <SelectedPackageName>
   ```

   A notification will appear indicating that the installation is in progress.

## How It Works

- **Code Action Provider:**  
  The extension registers a `CodeActionProvider` for C# that listens for diagnostics with the error code `CS0246`. When detected, it extracts the missing namespace from the diagnostic message.

- **NuGet Search:**  
  Using [axios](https://github.com/axios/axios), the extension sends a GET request to the NuGet API endpoint:
  
  ```http
  https://azuresearch-usnc.nuget.org/query?q=<MissingNamespace>
  ```

  The response is then filtered to show the top 5 results in a quick pick list.

- **Installation Task:**  
  Upon selection, the extension creates and executes a VS Code task that runs the `dotnet add package` command in the workspace shell.

## Requirements

- **Visual Studio Code**  
- **.NET SDK** – Ensure that the .NET CLI is installed and available in your system PATH.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or improvements, please feel free to submit an issue or a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
