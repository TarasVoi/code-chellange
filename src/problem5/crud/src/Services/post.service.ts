import { IRepository } from '../Interfaces/IRepository'
import { IPost } from '../Interfaces/IPost'
import { IResult } from '../Interfaces/IResult'
import { injectable } from 'inversify'
import { Post } from '../Models/posts'
import "reflect-metadata";
import { Document, Types } from 'mongoose'

@injectable() 
class PostService implements IRepository {

    //get all posts
    async getPosts() { 
        try {
            const posts = await Post.find({})
            return posts
        } catch (error) {
            console.log(error)
        }
    }

    //get a single post
    async getPost(id: string) {
        try {
            const post = await Post.findById({ _id: id })
            if (!post) {
                return '404'
            }
                return post
            
        } catch (error) {
            console.log(error)
            return '404';
        }
    }
    //create a post
    async createPost(data: any) {
        try {
            const newPost = await Post.create(data)
            return newPost
        } catch (error) {
            console.log(error)
        }
    }

    //update a post
    async updatePost(id: string, data: any) {
        try {
            
            const posts = await Post.findByIdAndUpdate({ _id: id }, data, { new: true })
            if (!posts) {
                return "post not available"
            }
            return posts
        } catch (error) {
            console.log(error)
        }
    }

    //delete a post by using the find by id and delete 
    async deletePost(id: string) {
        try {
            const post = await Post.findByIdAndDelete(id)
            if (!post) {
                return 'post not available'
            }
        } catch (error) {
            console.log(error)
        }
    }

    async patchUpdate(id: string, data: any) {
        try {
            const updatedOne = await Post.updateOne(
                { _id: id },
                { $set: data }
            );
            return updatedOne
        } catch (err) {
            console.log(err);
        }

    }

    async getChunk(queryPool: {
        sortType: string,
        pageIndex: number,
        orderBy: 1 | -1,
        filter: {
            likes: {
                $gte: number;
                $lte: number;
            };
        }
    }, limit: number = 5) {
        //const pagination = new Pagination(queryPool.pageIndex, limit); 

        let items: (Document<unknown, any, IPost> & IPost & {
            _id: Types.ObjectId;
        })[]

/*         if(queryPool.filter){
            items = await Post.find(queryPool.filter)
            .sort({ [queryPool.sortType]: queryPool.orderBy }) 
            .skip((queryPool.pageIndex - 1) * limit) 
            .limit(limit) 
        }else{ */
            items = await Post.find(/* queryPool.filter */)
            .sort({ [queryPool.sortType]: queryPool.orderBy }) 
            .skip((queryPool.pageIndex - 1) * limit) 
            .limit(limit) 
        

        const result: IResult = {
            total: await Post.countDocuments(),
            limit: limit,
            posts: items
        }
        return result
    }

    async search(q: string, queryPool: {
        sortType: string,
        pageIndex: number,
        orderBy: 1 | -1
    }, limit: number = 2) {
        try {
            console.log(q)
            const answer = await Post.find({ $text: { $search: q, $caseSensitive: true } })
                 .sort({[queryPool.sortType]: queryPool.orderBy })
                .skip((queryPool.pageIndex - 1) * limit)
                .limit(limit)

            const result: IResult = {
                total: answer.length,
                limit: limit,
                posts: answer
            }
            return result
        } catch (error) { console.log(error) }
    }
}

export { PostService } 
