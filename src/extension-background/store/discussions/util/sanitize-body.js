const sanitizeBody = (body) =>
    body
    // Remove leading & trailing spaces
    .trim()
    // Remove leading spaces from empty lines
    .replace(/^[ \t]+/gm, '')
    // Avoid more than two consecutive empty lines
    .replace(/^\n\n\n+/gm, '\n\n');

export default sanitizeBody;
