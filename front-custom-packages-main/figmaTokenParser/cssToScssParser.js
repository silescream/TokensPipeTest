const fs = require('fs');

const links = process.env['LINKS'].split(',');

let allVariables = {};
links.forEach((link) => {
    const fileName = link.split('/').pop().split('.')[1]
    const lines = fs.readFileSync(__dirname + `/parsedVariables/${fileName}.scss`, 'utf8', (err, data) => {
        if (err) {
            console.error('Error', err);
            return;
        }
        return data;
    })
    lines.split('\n').forEach((line) => {
        if (line.trim().startsWith('--')) {
            const parts = line.split(':').map((part) => part.trim());
            const variableName = parts[0].replace('--', '').trim();
            allVariables[variableName] = `var(${parts[0]});`;

        }
    });
})

function parsingThemeVariable() {
    const file = Object.entries(allVariables).map((variable) => {
        return `$${variable[0]}: ${variable[1]}\n`;
    }).join('');

    fs.writeFile(__dirname + `/parsedVariables/theme-variables.scss`, file, 'utf8', (err) => {
        if (err) {
            console.error('Error', err);
            return;
        }
    });
}

function parsingScssForText() {
    const result = {};

    Object.entries(allVariables).map((variable) => {
        const typography = 'typography';
        if (variable[0].startsWith(typography, 0)) {
            let property = variable[0].split("-").slice(-2).join('-');

            if (property === 'text-case') {
                property = 'text-transform'
            }
            const value = variable[1];
            const className = typography + variable[0]
                .split("-")
                .slice(1, -2)
                .map((item) => {
                    if (item === 'hover') {
                        return '.hover:hover'
                    }
                     return item.charAt(0).toUpperCase() + item.slice(1)
                })
                .join("")

            if (!result[className]) {
                result[className] = [];
            }

            result[className].push(`${property}: ${value}`);
        }
        return null;
    })

    const content = `@use '../../assets/css/themes/theme-variables';\n//File generated on ${new Date()}, don't change file manually\n\n${Object.entries(result).map((variable) => {
        return `.${variable[0]} {\n${variable[1].join('\n')}\n}\n\n`;
    })}`;

    const finalContent = content.split(',').join('');

    fs.writeFile(__dirname + '/textComponentFiles/text.scss', finalContent, 'utf8', (err) => {
        if (err) {
            console.error('Error', err);
            return;
        }
    })
}

function parsingTextTypes() {
    const varName = Object.entries(allVariables).map((variable) => {
        const typography = 'typography';
        if (variable[0].startsWith(typography, 0)) {
            return typography +
                variable[0]
                    .split("-")
                    .slice(1, -2)
                    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                    .join("")
        }
        return null;
    })

    const typeParse = Object.values(Object.fromEntries(varName.map((name) => [name, name]))).slice(0, -1)
    const typeContent = `//File generated on ${new Date()}, don't change file manually\nexport enum TEXT_TYPE {\n${typeParse
        .map(item => ''.concat(" ", `${item} = '${item}',\n`)).join('')}}\n`;

    fs.writeFile(__dirname + '/textComponentFiles/textTypes.ts', typeContent, 'utf8', (err) => {
        if (err) {
            console.error('Error', err);
            return;
        }
    })
}

parsingScssForText();
parsingThemeVariable();
parsingTextTypes();

console.log('Successfully created.');
