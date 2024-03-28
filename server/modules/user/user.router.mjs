import raw from "../../middleware/route.async.wrapper.mjs"
import express from "express"
import log from '@ajar/marker'
import user_model from "./user.model.mjs"

const router = express.Router();

// parse json req.body on post routes
router.use(express.json())

// CREATES A NEW USER
router.post("/", async (req, res,next) => {
    try{
      const user = await user_model.create(req.body);
      res.status(200).json(user);
    }catch(err){
      next(err)
    }
});

router.post("/", raw(async (req, res) => {
     log.obj(req.body, "create a user, req.body:");
     const user = await user_model.create(req.body);
     res.status(200).json(user);
}));

// GET ALL USERS
router.get( "/",raw(async (req, res) => {
    const users = await user_model.find()
                                  // .select(`-_id 
                                  //       first_name 
                                  //       last_name 
                                  //       email
                                  //       phone`);
    res.status(200).json(users);
  })
);

// pagination functionality
// http://localhost:3030/api/users/paginate/ <*> ?page= <*> 
// <*> is a value number first for how many users to be display, and the second for what page to view | do not use the bracets
// Example  http://localhost:3030/api/users/paginate/10?page=4 
router.get('/:paginate/:items', async (req, res) => {
  const users = await user_model.find()
  const itemsPerPage = parseInt(req.params.items);
  const currentPage = parseInt(req.query.page);
  const skip = (currentPage - 1) * itemsPerPage;

  try {
    const users = await user_model.find()
      .skip(skip)  // Skip documents based on page number
      .limit(itemsPerPage)
      .exec();
    res.json(users);
    console.log(currentPage);
  } catch (error) {
    res.status(500).send('Error retrieving users');
  }
});

// GETS A SINGLE USER
router.get("/:id",raw(async (req, res) => {
    const user = await user_model.findById(req.params.id)
                                    .select(`-_id 
                                        first_name 
                                        last_name 
                                        email
                                        phone`);
    if (!user) return res.status(404).json({ status: "No user found." });
    res.status(200).json(user);
  })
);
// UPDATES A SINGLE USER
router.put("/:id",raw(async (req, res) => {
    const user = await user_model.findByIdAndUpdate(req.params.id,req.body, 
                                                    {new: true, upsert: true });
    res.status(200).json(user);
  })
);
// DELETES A USER
router.delete("/:id",raw(async (req, res) => {
    const user = await user_model.findByIdAndRemove(req.params.id);
    res.status(200).json(user);
  })
);

export default router;

//Auth
//https://joi.dev/

// skip & Limit
//skip https://mongoosejs.com/docs/api/query.html#Query.prototype.skip()
//limit https://mongoosejs.com/docs/api/query.html#Query.prototype.limit()
//https://mongoosejs.com/docs/guide.html
//https://mongoosejs.com/docs/schematypes.html
//https://mongoosejs.com/docs/api/model.html
//https://mongoosejs.com/docs/api/query.html


