import { error } from 'console';
import { PostController } from '../Controllers/post.controller'
import { diContainer } from "../DI/iversify.config";
import { TYPES } from "../DI/types";
import { pageIndexChecker, sortParamChecker, orderByParamChecker, filterChecker } from "../Middlewares/param.validator";
import express from 'express';
import { Express, Request, Response } from 'express';


export const router = express.Router()
const controller = diContainer.get<PostController>(TYPES.controller);

const middlewares = [pageIndexChecker, sortParamChecker, orderByParamChecker, filterChecker]; 

router.get('/pagination', middlewares, controller.getChunk)
router.post('/', controller.addpost) 
router.get('/', controller.getPosts)
router.get('/search',middlewares, controller.search)
router.get('/:id', controller.getAPost) 
router.put('/:id', controller.updatePost)
router.patch('/:id', controller.patchPost)
router.delete('/:id', controller.deletePost)


