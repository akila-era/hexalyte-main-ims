const express = require("express")
const router = express.Router()
const pageController = require("../../controller/page.controller")

router
    .route('/')
    .get(pageController.getAllPages)
    .post(pageController.addPage)

router
    .route('/:id')
    .get(pageController.getPageByID)
    .put(pageController.updatePageById)
    .delete(pageController.deletePageById)

module.exports = router