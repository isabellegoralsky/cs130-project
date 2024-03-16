const router = require('express').Router();
const Picture = require('../models/Picture');

/**
   * Return a user's profile picture.
   *
   * @name  /:id
   * @route   {GET} routes/pictureRoute/:id
   * @routeparam {request} req - contains field 'params' to access the request details.
   */
router.get('/:id', async (req, res) => {
    try {
        const picture = await Picture.findById(req.params.id);
        if (!picture) {
            return res.status(404).send('Picture not found');
        }
        res.set('Content-Type', picture.contentType);
        res.status(200).send(picture.image);
    } catch (error) {
        console.log('Failed to get Picture');
        res.status(400).send('Failed to get Picture');
    }
});

module.exports = router;