# MIDI CLI Command Mapper
A tool that allows the user to map Command Line Interface commands, Shell and Bash-scripts to various MIDI inputs. Works with any MIDI controller. Easily customizable through a JSON-file.

## Preprequisites for library dependencies
**OSX**
- Some version of Xcode (or Command Line Tools)
- Python (for node-gyp)

**Windows**
- Microsoft Visual C++ (the Express edition works fine)
- Python (for node-gyp)

**Linux**
- A C++ compiler
- You must have installed and configured ALSA. Without it this module will NOT build.
- Install the libasound2-dev package.
- Python (for node-gyp)

## Usage
MIDI CLI Command Mapper works with any MIDI device. Connect your MIDI device via USB to your computer or MIDI-DIN to your soundcard.
Manually input the name of your MIDI device into the constant nameed `INPUT_DEVICE_NAME`. If your device is invalid or doesn't exist you will automatically be presented a list of all available MIDI devices.

Creating and mapping scripts is done through editing the `commands.json` file.

### MIDI Input Notes
Each object in the notes-array has a key named **note** with a value corresponding to its musical pitch notation. The value of **directory** indicates in which directory the commands will run. If the **directory** doesn't exist or holds an empty value the commands will be run in the current directory. When a MIDI note is sent that matches a value of a note in the notes-array, the value of the **script** key is run as a CLI command. Pressing the D3 key on your MIDI device would in this case run `code .` in C:/Users/Erik/Documents/SomeFolder.
```
  "notes": [
    {
      "note": "D3",
      "directory": "C:/Users/Erik/Documents/SomeFolder",
      "script": "code .",
      "noteup_script": "git init"
    }
  ]
```
Each object may also include the optional **noteup_script** key. The value for this key would be run when the MIDI note is released. In this case `git init` would be run upon releasing the D3 key, in the same directory as before.

### MIDI CC
Each object in the cc-array has a key named **controller** whose value corresponds to the controller number (1 - 127). Each object in the values-array corresponds to a MIDI CC value emitted by the controller. When the controller emites a value present in the values-array, the value of the correspondning **script** key is run.

```
"cc": [
    {
      "controller": 1,
      "name": "modwheel",
      "values": [
        {
          "value": "12",
          "directory": "C:/Users/Erik/Documents/SomeFolder",
          "script": "code ."
        },
        {
          "value": "99",
          "script": "node -v"
        }
      ]
    }
  ]
```
The **name** key is optional and only exists to improve the user experience.

### MIDI Program Change
Each object in the program-array consists of a **program** key whose value represents the MIDI program. When the MIDI program is changed to a value present in the program-array, the correpsonding script is run.

```
  "program": [
    {
      "program": "1",
      "directory": "C:/Users/Erik/Documents/SomeFolder",
      "script": "code ."
    }
  ]
```
