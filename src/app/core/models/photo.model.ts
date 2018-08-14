export class Photo {

    $key: string;
    file: File;
    name: string;
    url: string;
    progress: number;
    createdAt: Date = new Date();
    owner: string;

    constructor(file: File) {
        this.file = file;
    }
}