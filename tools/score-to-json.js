const fs = require('fs');

const musicId = process.argv[2];
const bpm = parseFloat(process.argv[3]);
const offsetTime = parseFloat(process.argv[4]);

if (!musicId) {
  console.error('Error: Please input musicId.');
  process.exit(1);
}

if (!bpm) {
  console.error('Error: Please input bpm.');
  process.exit(1);
}

if (!offsetTime && offsetTime !== 0) {
  console.error('Error: Please input offset time.');
  process.exit(1);
}

console.log('[meta]:', { musicId, bpm, offsetTime });

const stepTime = 60.0 / bpm;
const scoreJson = {
  meta: {
    title: 'NOT_SET',
    musicId,
    bpm,
    offsetTime
  },
  scores: []
};

const baseRawPath = './public/scores/raw';
const rawScores = fs.readdirSync(`${baseRawPath}/${musicId}/`, { encoding: 'utf8' });
rawScores.map(scoreFileName => {
  let stepCount = 0;
  let previousPosition = null;
  let score = [];

  const scoreFile = fs.readFileSync(`${baseRawPath}/${musicId}/${scoreFileName}`, { encoding: 'utf8' });
  scoreFile.split(/,/m).map(block => {
    block.split(/\n/).filter(v => !!v).map(line => {
      if (line === ';') {
        scoreJson.scores.push(score);
        console.log('[EOF]');
        const outputPath = `./public/scores/${musicId}.json`;
        fs.writeFileSync(outputPath, JSON.stringify(scoreJson), { encoding: 'utf8' });
        console.log('output:', outputPath);
        return;
      }

      const time = stepTime * stepCount + offsetTime;

      const splittedLine = line.split('1');
      if (1 < splittedLine.length) {
        const stepPosition = splittedLine[0].length + 1;

        const stepSignal = (() => {
          if (previousPosition === null) {
            return 0;
          }

          if (stepPosition < previousPosition) {
            return -1;
          } else if (stepPosition > previousPosition) {
            return 1;
          } else {
            return 0;
          }
        })();;

        console.log(stepCount, time, line, stepPosition, stepSignal);
        score.push({
          time,
          signal: stepSignal,
          position: stepPosition
        });

        previousPosition = stepPosition;
      }
      stepCount += 1;
    });
  });
});
