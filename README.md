# python-coding-tools README

When moving from Eclipse and PyDev to vscode I always missed the functionality to automatically update a module variable to the date and time when saving the file to disk. There were other functionalities I missed too.

From this was born the idea of the extension "python-coding-tools". It should contain a compilation of python coding tools which are missing but are helpful in the everyday coders life.

It is specifically designed to complement the other python extensions out there. It won't do anything to files which have not the languageId "python". If features are incorporated in releases of other extensions, they are probably shortly removed here after.

## Features

### Update python module variable

This extension provides a command to 'Update [a] python module variable'. The name of the python module variable can be configured. The date and time format used when updating the variable's value can be configured in moment.js (sadly not python's) notation. The command can be automatically executed on saving a python file. The automatic command execution on saving a python file can also be disabled in the configuration.

## Extension Settings

This extension contributes the following settings:

### Update python module variable

* `python-coding-tools.update-module-variable.enableOnSave`: Enable/Disable the automatic update of a module variable on saving a python file.
* `python-coding-tools.update-module-variable.variableName`: Name of the module variable which should be updated.
* `python-coding-tools.update-module-variable.dateTimeFmt`: Specify the DateTime format in moment.js notation.

## Known Issues

None yet...

## Release Notes

### 1.0.0

Initial release:
- Providing a command to update a single module variable
- Automatic command execution on saving a python file
