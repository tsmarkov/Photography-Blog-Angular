export class Photo {

    $key: string;
    file: File;
    name: string;
    title: string;
    location: string;
    category: string;
    description: string;
    url: string;
    progress: number;
    createdAt: Date;

    constructor(file: File, title: string, category: string, location?: string, description?: string) {
        this.file = file;
        this.title = title;
        this.location = location;
        this.description = description;
        this.category = category;
        this.createdAt = new Date();
    }
}