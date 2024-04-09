
/**
 * 
 * @param {codeLines} codeLines Array of Strings representing code thats changed
 * @param {language} language Langue the code is written in
 * @returns True if todo comments are present, False if not
 */
function doChangedLinesHaveTodoComments(codeLines, language) {
    let regex = getTodoRegex(language);
    return codeLines.some(line => {
        return regex.test(line);
    })
}


/**
 * 
 * @param {language} language Programming language 
 * @returns Regular Expression used to determin if a line is a comment
 */
function getTodoRegex(language) {
    let commonSuffix = ' ?(todo|fixme)(( |:|\n){1}|$)';
    let flags = 'i';

    let prefix01 = '(\\/\\/|\\<\\!\\-\\-|\\/\\*\\*|\\/\\*|\\*|^)'; // // or <!-- or /** or /* or * or start of line
    let prefix02 = '#'; // #
    let prefix03 = '(\\/\\/|\\/\\*|\\^)'; // // or /* or start of line
    let prefix04 = '(\\/\\/|\\/\\*\\*|\\/\\*|\\*)'; // // or /** or /* or *
    let prefix05 = '(\\/\\/|#|\\/\\*|\\^)'; // // or # or /* or new line
    let prefix06 = '(#|\'|^)'; // # or ' or new line
    let prefix07 = '(\\/\\/(!|\\/){0,2}|\\/\\*(\\*)?|\\*)'; // or //! or //!! or /// or //// or /** or /** or *
    let prefix08 = '(\\/\\/|\\/\\*\\*|\\/\\*|\\*|\\/\\/\\/|^)'; // // or /** or /* or * or /// or new line
    let prefix09 = '(\\-\\-|^)'; // -- or new line
    let prefixDefault = '((\\/){2,}|\\/\\*(\\*)?|\\*|#|^)'; // at leaset 2 / or /** or /* or * or # or new line

    let regex01 = new RegExp(prefix01 + commonSuffix, flags);
    let regex02 = new RegExp(prefix02 + commonSuffix, flags);
    let regex03 = new RegExp(prefix03 + commonSuffix, flags);
    let regex04 = new RegExp(prefix04 + commonSuffix, flags);
    let regex05 = new RegExp(prefix05 + commonSuffix, flags);
    let regex06 = new RegExp(prefix06 + commonSuffix, flags);
    let regex07 = new RegExp(prefix07 + commonSuffix, flags);
    let regex08 = new RegExp(prefix08 + commonSuffix, flags);
    let regex09 = new RegExp(prefix09 + commonSuffix, flags);
    let regexDefault = new RegExp(prefixDefault + commonSuffix, flags);

    let finalLanguage = language === null ? 'none given' : language
    console.log(`language defined as: ${finalLanguage}`);

    switch (finalLanguage.toLowerCase()) {
        case 'java':
            return regex01;
        case 'python':
            return regex02;
        case 'go':
            return regex03;
        case 'javascript':
            return regex04;
        case 'c++':
            return regex03;
        case 'typescript':
            return regex04;
        case 'php':
            return regex05;
        case 'ruby':
            return regex02;
        case 'c':
            return regex03;
        case 'c#':
            return regex03;
        case 'nix':
            return regex02;
        case 'shell':
            return regex06;
        case 'rust':
            return regex07;
        case 'scala':
            return regex04;
        case 'kotlin':
            return regex01;
        case 'swift':
            return regex08;
        case 'dart':
            return regex08;
        case 'groovy':
            return prefix03;
        case 'perl':
            return regex02;
        case 'lua':
            return regex09;
        default:
            return regexDefault;
    }
}

module.exports = { doChangedLinesHaveTodoComments };