
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const PACKAGE_JSON_PATH = path.join(__dirname, '../package.json');
const RELEASE_NOTE_PATH = path.join(__dirname, '../releaseNote.md');

// Helper to ask question
const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log('🚀 Starting Release Process...');

    // 1. Read package.json
    const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
    const currentVersion = pkg.version;
    console.log(`Current Version: ${currentVersion}`);

    // 2. Ask for new version
    console.log('\nSelect version bump:');
    console.log('1. Patch (x.x.X)');
    console.log('2. Minor (x.X.0)');
    console.log('3. Major (X.0.0)');
    console.log('4. Custom');

    const choice = await ask('Choice (1-4): ');
    let newVersion = '';
    const parts = currentVersion.split('.').map(Number);

    switch (choice.trim()) {
        case '1':
            newVersion = `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
            break;
        case '2':
            newVersion = `${parts[0]}.${parts[1] + 1}.0`;
            break;
        case '3':
            newVersion = `${parts[0] + 1}.0.0`;
            break;
        case '4':
            newVersion = await ask('Enter custom version: ');
            break;
        default:
            console.log('Invalid choice. Aborting.');
            rl.close();
            return;
    }

    // Confirm version
    const confirm = await ask(`\nProceed with version ${newVersion}? (y/N): `);
    if (confirm.toLowerCase() !== 'y') {
        console.log('Aborted.');
        rl.close();
        return;
    }

    // 3. Ask for Release Notes
    console.log('\nEnter Release Notes (Press Ctrl+D or type "EOF" on a new line to finish):');
    console.log('Format suggestion:');
    console.log('- Feature: ...');
    console.log('- Fix: ...');

    let lines = [];
    rl.on('line', (line) => {
        if (line.trim() === 'EOF') {
            rl.removeAllListeners('line'); // Stop listening to line events
            processRelease(pkg, newVersion, lines.join('\n'));
        } else {
            lines.push(line);
        }
    });
}

async function processRelease(pkg, newVersion, notes) {
    // Update package.json
    pkg.version = newVersion;
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`\n✅ Updated package.json to ${newVersion}`);

    // Update releaseNote.md
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const newEntry = `\n## [${newVersion}] - ${date}\n\n${notes}\n`;

    let currentNotes = '';
    if (fs.existsSync(RELEASE_NOTE_PATH)) {
        currentNotes = fs.readFileSync(RELEASE_NOTE_PATH, 'utf-8');
    }

    // Check if file starts with a title, if so, insert after it, otherwise prepend
    // We assume standard format: "# Title\n\n content..."
    let updatedContent = '';
    const titleMatch = currentNotes.match(/^# .*\n/);

    if (titleMatch) {
        const title = titleMatch[0];
        const rest = currentNotes.substring(title.length);
        updatedContent = title + newEntry + rest;
    } else {
        updatedContent = `# Release Notes\n${newEntry}\n${currentNotes}`;
    }

    fs.writeFileSync(RELEASE_NOTE_PATH, updatedContent);
    console.log(`✅ Updated releaseNote.md`);

    console.log(`\n🎉 Release ${newVersion} completed successfully!`);
    console.log(`Don't forget to run: git commit -am "Release ${newVersion}" && git tag v${newVersion}`);

    rl.close();
    process.exit(0);
}

main();
