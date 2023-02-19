export class File {

    constructor(validExtensions) {
        this.validExtensions = validExtensions;
    }
    async loadFile(file, callback) {
        if (!file) {
            return;
        }
        const fileName = file.name;
        const extension = fileName.split('.').pop().toLowerCase();
        if (!this.validExtensions.includes(extension)) {
            alert(`La extensión del archivo "${fileName}" no es válida.`);
            return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            let fileContent = []
            const content = event.target.result;
            const lines = content.split(/\r\n|\n/);

            for (let i = 0; i < lines.length; i++) {
                fileContent.push(lines[i])
            }
            callback(fileContent)
        }
        reader.readAsText(file);
    }
    readTextFile(file) {
        return new Promise((resolve, reject) => {
          this.reader.onload = () => {
            const fileContent = this.reader.result;
            resolve(fileContent);
          };
          this.reader.onerror = reject;
          this.reader.readAsText(file);
        });
    }
}