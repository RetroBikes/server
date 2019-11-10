const fs = require('fs');
const path = require('path');

/**
 * Read configuration file on server root directory and get the content.
 */
export default class Configurations {

    /**
     * Configuration file raw data.
     * @type string
     */
    private fileData: string;

    /**
     * Read the configuration file and store the content to fileData property.
     * @param fileName Filename, without the path (always get the file from server root directory)
     */
    public constructor(fileName: string) {
        const currentPath = path.resolve(__dirname),
            configFilePath = path.join(currentPath, '..', '..', fileName);
        this.fileData = fs.readFileSync(configFilePath);
    }

    /**
     * Parse the configuration file as json and return as object.
     */
    public getJsonData() {
        return JSON.parse(this.fileData);
    }

}
