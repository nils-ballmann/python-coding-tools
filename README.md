# README

When moving from Eclipse and PyDev to vscode I always missed the functionality
to automatically update a module variable to the date and time when saving the
file to disk. There were other functionalities I missed too.

From this was born the idea of the extension "python-coding-tools". It should
contain a compilation of python coding tools which are missing but are helpful
in the everyday coders life.

It is specifically designed to complement the other python extensions out there.
It won't do anything to files which have not the languageId `python`. If
features are incorporated in releases of other extensions, they are probably
shortly removed here after.

## Features

### Update python module variable

This extension provides a command to 'Update a python module variable'. The name
of the python module variable can be configured. The date and time format used
when updating the variable's value can be configured in moment.js (sadly not
python's) notation. The command can be automatically executed on saving a python
file active in the foreground. The automatic command execution on saving a
python file can also be disabled in the configuration.

## Usage

For those, who never have used this feature with Eclipse and PyDev, here is a
short how to description with the default settings.

First you have to put a variable to the module (`__updated__` in this example).

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__updated__ = ''


class PCT(object):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.something = 'else'


def main():
    print('Last update of this file was on {}.'.format(__updated__))


if __name__ == '__main__':
    main()
```

On saving the file, the value gets filled by the current date and time.

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__updated__ = '2019-02-17 23:06:24'


class PCT(object):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.something = 'else'


def main():
    print('Last update of this file was on {}.'.format(__updated__))


if __name__ == '__main__':
    main()
```

Which then results in the following output when executing the Python script:

```shell-session
nils@nyx:~$ python3 pct.py
Last update of this file was on 2019-02-17 23:06:24.
```

The variable works also in Python2. But as Python2 just has 10.5 months left in
the tank, I strongly encourage you to migrate to Python3.

The variable is also accessible when importing a module.

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__updated__ = '2019-02-17 23:36:15'

import pct


def main():
    print('Last update of this file was on {}.'.format(__updated__))
    print('Last update of pct.py was on {}.'.format(pct.__updated__)

if __name__ == '__main__':
    main()
```

When executed the result looks like this:

```shell-session
nils@nyx:~$ python3 import_pct.py
Last update of this file was on 2019-02-17 23:36:15.
Last update of pct.py was on 2019-02-17 23:06:24.
```

## Extension Settings

This extension contributes the following settings:

### Update module variable

* `python-coding-tools.update-module-variable.enableOnSave`: Enable/Disable the
  automatic update of a module variable on saving a python file active in the
  foreground.
* `python-coding-tools.update-module-variable.variableName`: Name of the module
  variable which should be updated.
* `python-coding-tools.update-module-variable.dateTimeFmt`: Specify the DateTime
  format in moment.js notation.

## Known Issues

* No tests

## Release Notes

### x.x.x - UNRELEASED

* Updated some dependencies

### 1.0.3 - 2019-06-08

* Added short usage info
* Fixed several dependencies

### 1.0.2 - 2018-10-14

* Fixed <https://snyk.io/vuln/npm:moment:20170905>

### 1.0.1 - 2017-07-16

* Added Python logo as extension icon

### 1.0.0 - 2017-07-16

Initial release:

* Providing a command to update a single module variable
* Automatic command execution on saving a python file
