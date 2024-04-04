/**
 * Take the text generated from Github pull request diff and convert it into a new object.
 * Each object will have the file name that has been changed with any additions
 * And an array of code chunks that have been changed.
 * 
 * @param {String} diffOutput Text from Github Pull Request Diff
 * @returns Object { fileName: String, codeChunks: [String, String, ...]}
 */
function getFileAndCodeChunkArrayFromDiff(diffOutput) {
    let diffSections = getDiffSections(diffOutput);

    return diffSections.map(diffSection => {
        return { 
            fileName: getFileName(diffSection),
            codeChunks: getCodeChunksFromDiffSection(diffSection)
        }
    })
}

const REGEX_FILE_HEAD_PATTERN = '\\\+{3} [a-z]{1}';
const REGEX_FILE_TAIL_PATTERN = '\\\n';

/**
 * Break down the output of github diff output to an array. 
 * Each value represents the changes for a single file. 
 * Only reaturns if a file has additions
 * 
 * @param {String} diffOutput Output received from getting diff request from github, (Just a big string)
 * @returns Array of Strings. Each is the changes for a specific file.
 */
function getDiffSections(diffOutput) {
    let regex = /\n?diff --git/g;
    let result = diffOutput.split(regex).filter( section => hisFileWithAdditions(section));
    return result;
}

function hisFileWithAdditions(diffSection) {
    let regularExpression = new RegExp(`${REGEX_FILE_HEAD_PATTERN}.*${REGEX_FILE_TAIL_PATTERN}`);
    return regularExpression.test(diffSection);
}

/**
 * Returns a file name contained in a diff section.
 * 
 * @param {String} text Text of a diff section containing a file that has changes (ie. a line starting with +++)
 * @returns name of file
 */
function getFileName(text) {
    let fileNameRegEx = new RegExp(`${REGEX_FILE_HEAD_PATTERN}.*${REGEX_FILE_TAIL_PATTERN}`, 'g'); 
    let fileNameRowArray = text.match(fileNameRegEx);
    if (fileNameRowArray == null) {
        throw new Error(
            `Does not have any files with additions. Check section for containing file with additions first. \nOutput:\n${text}`
        );
    }
    return fileNameRowArray[0].replace(new RegExp(REGEX_FILE_HEAD_PATTERN), '').replace(new RegExp(REGEX_FILE_TAIL_PATTERN), '');
}

/**
 * Take a diff block (one file) of text and break it into various code blocks
 * 
 * @param {String} diffSection Text from a diff section
 * @returns array of blocks of code in form of string
 */
function getCodeChunksFromDiffSection(diffSection) {
    let newSectionRegexPattern = "@{2}.*@{2}" // indicates start of code for a changed section
    let regex = new RegExp(newSectionRegexPattern, "g"); 
    let matches = [...diffSection.matchAll(regex)];

    let codeChunks = matches.map(match => {
        let matchedString = match[0];
        let headerIndex = match.index + matchedString.length;
        let deheadedString = match.input.slice(headerIndex);

        // test if there are additional sections within same diff section
        if (regex.test(deheadedString)) {
            let nextIndex = new RegExp("\\\n" + newSectionRegexPattern, "g").exec(deheadedString).index;
            let detailedString = deheadedString.slice(0, nextIndex);
            return detailedString;
        } else {
            return deheadedString;
        }
    });

    return codeChunks;
}