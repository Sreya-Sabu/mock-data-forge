function expandCharSet(set) {
    let chars = "";

    for (let i = 0; i < set.length; i++) {
        if (set[i + 1] === "-" && set[i + 2]) {
            const start = set.charCodeAt(i);
            const end = set.charCodeAt(i + 2);

            for (let c = start; c <= end; c++) {
                chars += String.fromCharCode(c);
            }

            i += 2;
        } else {
            chars += set[i];
        }
    }

    return chars;
}

export default expandCharSet;
