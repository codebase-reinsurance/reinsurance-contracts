const PROGRAM_ID = 'DajsLYULhHh3SVSDHsCCvnuHD8JeXgVf5mjfnQWpwzix';

const path = require('path');
const programDir = path.join(__dirname, 'programs','insurance');
const idlDir = path.join(__dirname,'target','idl');
const sdkDir = path.join(__dirname,'src');
const PROGRAM_NAME = "insurance";
const binaryInstallDir = path.join(__dirname,'.crates');

module.exports = {
  idlGenerator: 'anchor',
  removeExistingIdl: false,
  programName: PROGRAM_NAME,
  programId: PROGRAM_ID,
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
};