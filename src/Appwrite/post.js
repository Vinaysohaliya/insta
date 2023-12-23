import { Account, Client, Databases, ID, Storage } from "appwrite";
import config from "../config/config";



export class Service{
     client = new Client();
     databases;
     storage;
    constructor() {
        this.client.setEndpoint(config.appWriteUrl)
        this.client.setProject(config.appWriteProject)
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPost({img,caption,location,userId}){
        try {
           return this.databases.createDocument(
                config.appWriteDb,
                config.appWriteCollection,
                ID.unique(),{
                    img,
                    caption,
                    location,
                    userId
                }
            )
        } catch (error) {
            console.log(error);
        }
    }

    async getPosts() {
        try {
            return await this.databases.listDocuments(
                config.appWriteDb,
                config.appWriteCollection,
            )
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async createFile(file){
        try {
           return this.storage.createFile(
                config.appWriteBucket,
                ID.unique(),
                file
            )
            
        } catch (error) {
            console.log(error);
        }
    }

    async getFilePreview(fileId){
        console.log(fileId);
        try {
            return  this.storage.getFilePreview(
                config.appWriteBucket,
                fileId
            )

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

const service=new Service();

export default service;