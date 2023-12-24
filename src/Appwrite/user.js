import { Account, Client, Databases, ID, Storage } from "appwrite";
import config from "../config/config";



export class userService {
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

    async createUser({ profileId, userId, name }) {
        try {
            return this.databases.createDocument(
                config.appWriteDb,
                config.appWriteUserCollection,
                ID.unique(), {
                profileId,
                userId,
                name
            }
            )
        } catch (error) {
            console.log(error);
        }
    }

    async getAllUser() {
        try {
            return await this.databases.listDocuments(
                config.appWriteDb,
                config.appWriteUserCollection,
            )
        } catch (error) {
            console.log(error);
            throw error;
        }
    }



}

const userservice = new userService();

export default userservice;