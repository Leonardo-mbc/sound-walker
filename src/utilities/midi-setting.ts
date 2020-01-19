export async function getMidiAccess() {
  return navigator
    .requestMIDIAccess({
      sysex: true,
    })
    .then(onMIDISuccess, onMIDIFailure);
}

function onMIDISuccess(midiAccess: any) {
  return midiAccess;
}
function onMIDIFailure() {}
