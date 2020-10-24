const easymidi = require("easymidi");
const {exec} = require("child_process");
const commands = require("./commands.json");

//Enter your MIDI Device Name as a String
const INPUT_DEVICE_NAME = "YOUR_DEVICE_HERE";
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

try{
    const input = new easymidi.Input(INPUT_DEVICE_NAME);

    input.on('noteon', (incomingNote) => handleNoteInput(incomingNote, true));
    input.on('noteoff', (incomingNote) => handleNoteInput(incomingNote, false));
    input.on('cc', (incomingCC) => handleMidiCC(incomingCC));
    input.on('program', (program) => handleMidiProgramChange(program.number));

    function handleNoteInput(input, noteDown){
        let formattedNote = translateNoteValueToReadableNote(input.note);
        let command = commands.notes.find( (x) => x.note == formattedNote);
        let directory = null;

        if(command){
            if(Object.keys(command).includes("directory")){
                directory = command.directory;
            }

            if(noteDown){
                runCommand(command.script, directory);
            }else{
                if(Object.keys(command).includes("noteup_script")){
                    runCommand(command.noteup_script, directory);
                }
            }
        }else{
            console.log("No script associated with that note");
            return;
        }

    }

    function handleMidiCC(incomingCC){
        let controller = commands.cc.find( (x) => x.controller == incomingCC.controller);
        
        if(controller){
            try{
                let command = controller.values.find( (y) => y.value == incomingCC.value);
                let directory = null;

                if(Object.keys(command).includes("directory")){
                    directory = command.directory;
                }

                runCommand(command.script, directory);

            }catch(error){
                console.log("Controller has commands, but not associated with this value");
            }
        }else{
            console.log("No scripts associated with this controller");
        }
    }

    function handleMidiProgramChange(programValue){
        let command = commands.program.find( (x) => x.program == programValue);

        if(command){
            let directory = null;
            if(Object.keys(command).includes("directory")){
                directory = command.directory;
            }

            runCommand(command.script, directory);

        }else{
            console.log("No script associated with that program");

        }
    }

    function translateNoteValueToReadableNote(noteValue){
        let value = (noteValue) % 12;
        let octave = Math.floor((noteValue / 12) - 1);
        let formattedNote = `${notes[value]}${octave}`

        return formattedNote;
    }

    function runCommand(commandToRun, directory){
        exec(commandToRun, {cwd: directory}, (error, stdout, stderr) => {
            if(error){
                console.log(`ERROR:\n ${error.message}`);
            }else if(stderr){
                console.log(`STDERR:\n ${stderr}`);
            }else{
                console.log(`STDOUT:\n ${stdout}`);
            }
        });
    }
}catch(error){

    function formatAvailableInputDevices(){
        let devices = easymidi.getInputs();
        let formattedDeviceList = "";

        for(let device of devices){
            formattedDeviceList += `${device}\n`;
        }

        return formattedDeviceList;
    }

    console.log(error);
    console.log(`Available MIDI Devices: \n` + formatAvailableInputDevices());
}