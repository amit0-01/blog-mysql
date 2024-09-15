const { Router } = require('express');
const db = require('../db');
const {getAll, addBlog, getBlogById, commentBlog, deleteBlog} = require('../controllers/blog.controller')
const upload = require('../middleware/multer.middleware')
const { checkForAuthenticationCookie } = require('../middleware/authentication');

  
const router = Router();


// Route to get all blogs
router.get('/all', getAll);

// router.get('/add-new', function(req, res) {
//     return res.render('addBlog', {
//         user: req.user,
//     });
// });




router.post('/', upload.single('coverImage'), addBlog);

router.get('/:id', getBlogById);

router.post('/comment/:blogId', commentBlog);

router.delete('/:id',deleteBlog)



module.exports = router;