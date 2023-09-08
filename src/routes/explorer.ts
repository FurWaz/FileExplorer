import express from 'express';
import * as controller from '../controllers/explorer';

const router = express.Router();

router.get('*', controller.listElement);
router.post('*', controller.createElement);
router.patch('*', controller.renameElement);
router.delete('*', controller.deleteElement);

module.exports = router;
