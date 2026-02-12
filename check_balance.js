
import fs from 'fs';

const content = fs.readFileSync('app/confessions/new/page.tsx', 'utf8');

function checkBalance(text) {
    let divCount = 0;
    let braceCount = 0;
    let parenCount = 0;
    
    // Split into tokens
    let tokens = text.match(/<div|<\/div>|\/>|\{|\}|\(|\)/g);
    
    tokens.forEach((token, i) => {
        if (token === '<div') divCount++;
        if (token === '</div>') divCount--;
        // For simplicity, we assume /> closes the most recent div if it's a div.
        // Actually, in JSX, <div /> is common.
        // But wait, my script only finds <div.
        // If it's <div ... />, it's one opener and one self-closer.
        // Let's check for the next />
        if (token === '/>') {
            // This is tricky. Let's just look at the raw text.
        }
        if (token === '{') braceCount++;
        if (token === '}') braceCount--;
        if (token === '(') parenCount++;
        if (token === ')') parenCount--;
    });
    
    console.log(`Final counts - Divs: ${divCount}, Braces: ${braceCount}, Parens: ${parenCount}`);
}

checkBalance(content);
