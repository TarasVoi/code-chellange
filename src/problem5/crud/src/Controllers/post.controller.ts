import { PostService } from '../Services/post.service'
import { Post, PostschemaValidate } from '../Models/posts'
import { injectable, inject } from 'inversify'
import { TYPES, SORT_OPT } from "../DI/types" 
import { IResult } from '../Interfaces/IResult'
import { resourceLimits } from 'worker_threads'
import { Express, Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core'
import { error } from 'console'





@injectable() 
class PostController {
    private service: PostService; 

    constructor(@inject(TYPES.service) service: PostService) { 
        this.service = service
    }

    //get all posts
    getPosts = async (req: Request, res: Response) => { // non-blocking approach
        const sortParam = req.query.sort;
        const isValid = this.isValidSortOption(sortParam)



        const posts = await this.service.getPosts();
        res.send(posts);
    }

    isValidSortOption(value: any): value is SORT_OPT {
        return Object.values(SORT_OPT).includes(value);
    }

    //get a single post
    getAPost = async (req: Request, res: Response) => { // when the async task is finished fires a callback function
        const id = req.params.id // extract id from the link
        const post = await this.service.getPost(id)
        if (post == '404') {
            console.log("the post is ",post);
            return res.status(404).json({ message: 'Post not found' });
        }else{
            console.log("post is not undefined")
            res.status(200).send(post)

        }
    }

    //add post controller
    addpost = async (req: Request, res: Response) => {
        const data = {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            published: req.body.published,
            likes: req.body.likes
        }
        const { error, value } = PostschemaValidate.validate(data)

        if (error) {
            res.send(error.message)
        } else {
            const post = await this.service.createPost(value)
            res.status(201).send(post) // status is set to ok
        }
    }

    //update post
    updatePost = async (req: Request, res: Response) => {
        const id = req.params.id
        const post = await this.service.updatePost(id, req.body)
        res.send(post)
    }

    //delete a post
    deletePost = async (req: Request, res: Response) => {
        const id = req.params.id
        await this.service.deletePost(id)
        res.send('post deleted')
    }

    //pagination
    getChunk = async (req: Request, res: Response) => {
        const limit = 5;

        const queryPool = {
            sortType: req.sortType,
            pageIndex: req.pageIndex,
            orderBy: req.orderBy,
            filter: req.filter
        }

        const answer: IResult | undefined = await this.service.getChunk(queryPool, limit);

        const isString = typeof answer;

        if (isString === 'string') { 
            return res.status(400).json({ message: answer })
        }
        return res.status(200).json(answer)
    }
    
    //update post with patch
    patchPost = async (req: Request, res: Response) => {
        const id = req.params.id
        const post = await this.service.patchUpdate(id, req.body)
        res.send(post)
    }

    search = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryPool = {
                sortType: req.sortType,
                pageIndex: req.pageIndex,
                orderBy: req.orderBy
            }
            const query = req.query.q as string
            console.log(req.query.q);
            
            const answer = await this.service.search(query, queryPool)
                return res.status(200).json(answer)
        } catch (error) { console.log(error) }
    }
}

export { PostController } 