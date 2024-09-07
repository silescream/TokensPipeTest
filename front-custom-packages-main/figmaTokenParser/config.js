const parserConfig = (token, fileName) => {
    return {
        source: [`**/**/${token}`],
        platforms: {
            css: {
                transforms: [
                    'ts/descriptionToComment',
                    'ts/size/px',
                    'ts/opacity',
                    'ts/size/lineheight',
                    'ts/typography/fontWeight',
                    'ts/resolveMath',
                    'ts/size/css/letterspacing',
                    'ts/typography/css/fontFamily',
                    'ts/typography/css/shorthand',
                    'ts/border/css/shorthand',
                    'ts/shadow/css/shorthand',
                    'ts/color/css/hexrgba',
                    'ts/color/modifiers',
                    'name/cti/kebab',
                ],
                buildPath: 'figmaTokenParser/parsedVariables/',
                files: [
                    {
                        destination: `${fileName}.scss`,
                        format: 'css/variables',
                    },
                ],
            },
        },
    }
}

const typographyOptions = (token) => {
    // remove if result would be -> letter-spacing: 0
    if (token.value['letterSpacing'] === '{letter-spacing.0}') {
        delete token.value['letterSpacing']
    }
    // remove if result would be -> paragraphSpacing: 0
    if (token.value['paragraphSpacing'] === '{paragraph-spacing.0}') {
        delete token.value['paragraphSpacing']
    }
    // remove if result would be -> paragraphIndent: 0
    if (token.value['paragraphIndent'] === '{paragraph-indent.first-stroke-default}') {
        delete token.value['paragraphIndent']
    }
    // remove if result would be -> textCase: none
    if (token.value['textCase'] === '{text-case.none}') {
        delete token.value['textCase']
    }

    return token
}

module.exports = {parserConfig, typographyOptions};
