import { Account, Client, Databases, ID, Query, Storage } from "appwrite";
import config from "../config/config";



export class Service {
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

    async createPost({ img, caption, location, userId }) {
        try {
            return this.databases.createDocument(
                config.appWriteDb,
                config.appWritePostCollection,
                ID.unique(), {
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

    async getMyPosts(userId) {
        try {
            return await this.databases.listDocuments(
                config.appWriteDb,
                config.appWritePostCollection,
                [Query.equal('userId', [userId])]

            )
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async getPosts() {

        try {
            return await this.databases.listDocuments(
                config.appWriteDb,
                config.appWritePostCollection,

            )
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async createFile(file) {
        try {
            console.log(file);
            return this.storage.createFile(
                config.appWriteBucket,
                ID.unique(),
                file
            )

        } catch (error) {
            console.log(error);
        }
    }
    async getFilePreview(fileId) {
        try {
            return this.storage.getFilePreview(
                config.appWriteBucket,
                fileId
            )

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getLike(documentsId){
        try {
            const post=await this.databases.getDocument(
                config.appWriteDb,
                config.appWritePostCollection,
                documentsId
            )
            if (!post) {
                throw error;
            }

            return post?.like? post.like.length : 0;

            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async isLiked(documentsId,myId){
        try {
            const post=await this.databases.getDocument(
                config.appWriteDb,
                config.appWritePostCollection,
                documentsId
            )
            if (!post) {
                throw error;
            }

            
            const currentLikes = post?.like ? post.like : [];
            return currentLikes.includes(myId);
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async addLike(documentId, myId) {
        try {
            const post = await this.databases.getDocument(
                config.appWriteDb,
                config.appWritePostCollection,
                documentId
            );
    
            if (!post) {
                throw new Error("Post not found");
            }
    
            const currentLikes = post?.like ? post.like : [];
    
            if (!currentLikes.includes(myId)) {
                const updatedLikes = [...currentLikes, myId];
    
                await this.databases.updateDocument(
                    config.appWriteDb,
                    config.appWritePostCollection,
                    documentId,
                    {
                        like: updatedLikes,
                    }
                );
    
                return updatedLikes;
            } else {
                const updatedLikes = currentLikes.filter((likedId) => likedId !== myId);
    
                await this.databases.updateDocument(
                    config.appWriteDb,
                    config.appWritePostCollection,
                    documentId,
                    {
                        like: updatedLikes,
                    }
                );
    
                return updatedLikes;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    
      
}

const service = new Service();

export default service;