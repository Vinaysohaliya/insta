import { Account, Client, Databases, ID, Query, Storage } from "appwrite";
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
                userId,
                 {
                profileId,
                name
            }
            )
        } catch (error) {
            console.log(error);
        }
    }

    async getUser(userId) {
        try {
            console.log(userId);
            return await this.databases.listDocuments(
                config.appWriteDb,
                config.appWriteUserCollection,
                [Query.equal('$id', [userId])]
            )
        } catch (error) {
            console.log(error);
            throw error;
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

    async isFollowing(myId, followingId) {
      console.log(myId);
      try {
        const user = await this.databases.getDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          myId
        );
        
        return user?.following?.includes(followingId) || false;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async countFollower(myId){
      try {
        const user = await this.databases.getDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          myId
        );
        return user?.followers ? user.followers.length : 0;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }  
    
    async countFollwing(myId){
      try {
        const user = await this.databases.getDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          myId
        );
        return user?.following ? user.following.length : 0;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }  
    async isFollower(myId, followerId) {
      try {
        const user = await this.databases.getDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          followerId
        );
        
        return user?.followers?.includes(myId) || false;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    
    async addFollowing(myId, followingId) {
      try {
        const isAlreadyFollowing = await this.isFollowing(myId, followingId);
        if (!isAlreadyFollowing) {
          await this.databases.updateDocument(
            config.appWriteDb,
            config.appWriteUserCollection,
            myId,
            {
              following: [
                ...(await this.databases.getDocument(
                  config.appWriteDb,
                  config.appWriteUserCollection,
                  myId
                )).following || [],
                followingId,
              ],
            }
          );
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    
    async addFollower(myId, followerId) {
      try {
        const isAlreadyFollower = await this.isFollower(myId, followerId);
        if (!isAlreadyFollower) {
          await this.databases.updateDocument(
            config.appWriteDb,
            config.appWriteUserCollection,
            followerId,
            {
              followers: [
                ...(await this.databases.getDocument(
                  config.appWriteDb,
                  config.appWriteUserCollection,
                  followerId
                )).followers || [],
                myId,
              ],
            }
          );
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    
    async getMyFollower(myId){
      try {
        const user = await this.databases.getDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          myId
        );
        return user?.followers ? user.followers: [];
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    
    async getMyFollowing(myId){
      try {
        const user = await this.databases.getDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          myId
        );
        return user?.following ? user.following: [];
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    
    async unfollowUser(userId, myId) {
      try {
        const MyDoc = await this.databases.getDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          myId
        );

        const userDoc = await this.databases.getDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          userId
        );
    
        if (!(MyDoc || userDoc)) {
          throw new Error(`User with ID ${myId} not found`);
        }
    
        const MyFollowings =  MyDoc.following || [];
        const UserFollowers =  userDoc.followers || [];
    
        const  updatedUserFollowers= UserFollowers.filter((follower) => follower !== myId);
        const updatedMyFollowings = MyFollowings.filter((following) => following!== userId);
    
        await this.databases.updateDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          myId,
          {
            following: updatedMyFollowings,
          }
        );

        await this.databases.updateDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          userId,
          {
            followers: updatedUserFollowers,
          }
        );
    
        return [updatedMyFollowings,updatedUserFollowers];
      } catch (error) {
        console.error('Error unfollowing:', error);
        throw error;
      }
    }
    
    async removefollower(userId, myId) {
      try {
        const MyDoc = await this.databases.getDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          myId
        );

        const userDoc = await this.databases.getDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          userId
        );
    
        if (!(MyDoc || userDoc)) {
          throw new Error(`User with ID ${myId} not found`);
        }
    console.log("dg");
        const MyFollowers =  MyDoc.followers || [];
        const UserFollowings =  userDoc.following || [];
    
        const  updatedMyFollowers= MyFollowers.filter((follower) => follower !== userId);
        const updatedUserFollowings = UserFollowings.filter((following) => following!== myId);
    
        await this.databases.updateDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          myId,
          {
            followers: updatedMyFollowers,
          }
        );

        await this.databases.updateDocument(
          config.appWriteDb,
          config.appWriteUserCollection,
          userId,
          {
            following: updatedUserFollowings,
          }
        );
    console.log("SD");
        return [updatedMyFollowers,updatedUserFollowings];
      } catch (error) {
        console.error('Error unfollowing:', error);
        throw error;
      }
    }
    
      


}

const userservice = new userService();

export default userservice;