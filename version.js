const { exec } = require('child_process');

const args = process.argv.slice(2);
exec(`yarn version --new-version ${args[0]} && git push && git push --tags`);
