/* Define bodyParse module */
const bodyParser = require('body-parser')
/* Get express router to define routes for posts and comments */
const routes = require('express').Router({mergeParams: true});

/* Define the store variable with the posts key to save all the information */
let store = {
    posts: []
}

var posts = require('./posts')(store)
var comments = require('./comments')(store)

/* Use the bodyParser module to parse the body requests as json */
routes.use(bodyParser.json())

/* Custom function to perform validations on our store variable*/
const validateStore =  (req, res, next) => {
    /* Validate when post does not exist */        
    if (req.params.postId) {        
        if (Object.keys(store.posts).indexOf(req.params.postId) == -1) {
            return res.status(500).send({ status: 500, message: 'Post Not Found', type: 'internal' });
        }
    }

    /* Validate if comment position does not exist into the post */
    if (req.params.postId) {
        if (Object.keys(store.posts[req.params.postId]).indexOf('comments') == -1) {
            store.posts[req.params.postId]['comments'] = []
        }
    }

    /* Validate when comment does not exist */
    if (req.params.commentId) {
        if (Object.keys(store.posts[req.params.postId].comments).indexOf(req.params.commentId) == -1) {
            return res.status(500).send({ status: 500, message: 'Comment Not Found', type: 'internal' });
        }
    }
    next()
}

/* Create routes for posts */
routes.get('/posts', validateStore, posts.getPosts)
routes.post('/posts', validateStore, posts.addPost)
routes.put('/posts/:postId/', validateStore, posts.updatePost)
routes.delete('/posts/:postId/', validateStore, posts.removePost)

/* Create routes for comments */
routes.get('/posts/:postId/comments', validateStore, validateStore, comments.getComments)
routes.post('/posts/:postId/comments', validateStore, comments.addComment)
routes.put('/posts/:postId/comments/:commentId', validateStore, comments.updateComment)
routes.delete('/posts/:postId/comments/:commentId', validateStore, comments.removeComment)

module.exports = routes;