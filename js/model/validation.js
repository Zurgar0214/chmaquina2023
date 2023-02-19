export class Validation {
    constructor(fileContent=[]) {
        this.fileContent = fileContent;
    }

    validComments() {
        this.fileContent = this.fileContent.filter((line) => {
            if (!(line[0] == '/' && line[1] == '/')) {
                return line
            }
        })
    }
}