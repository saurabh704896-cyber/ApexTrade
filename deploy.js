const { spawn } = require('child_process');
const surge = spawn('npx', ['surge', '.', 'apextrade-saurabh.surge.sh'], { shell: true });
surge.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    if (output.toLowerCase().includes('email:')) {
        surge.stdin.write('saurabh.dummy1234@gmail.com\n');
    }
    if (output.toLowerCase().includes('password:')) {
        surge.stdin.write('saurabhpassword123\n');
    }
});
surge.stderr.on('data', (data) => console.log(data.toString()));
surge.on('close', (code) => console.log('Exited with ' + code));
