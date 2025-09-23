const db = require('../models')
const Page = db.Page
const pageServices = require('../service/page.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')

const getAllPages = catchAsync(async (req, res) => {
    const allPages = await Page.findAll({
        include: [{
            model: db.NewOrder,
            required: false
        }]
    })
    if (allPages.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Pages Found"
        })
    }

    return res.status(httpStatus.OK).send({ allPages })
})

const getPageByID = catchAsync(async (req, res) => {
    const page = await pageServices.getPageByID(req.params.id)
    if (!page) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `No Page Found with ID:${req.params.id}`
        })
    }

    return res.status(httpStatus.OK).send({ page })
})

const addPage = catchAsync(async (req, res) => {
    const newPage = await pageServices.addPage(req.body)
    return res.status(httpStatus.OK).send({ newPage })
})

const updatePageById = catchAsync(async (req, res) => {
    const updatedPage = await pageServices.updatePageById(req.params.id, req.body)
    if (updatedPage == "no page found") {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `Invalid Page ID. Page ID does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ updatedPage })
})

const deletePageById = catchAsync(async (req, res) => {
    const deletedPage = await pageServices.deletePageById(req.params.id)
    if (deletedPage == 0) {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: `Invalid Page ID. Page does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ deletedPage })
})

const togglePageStatus = catchAsync(async (req, res) => {
    const updatedPage = await pageServices.togglePageStatus(req.params.id)
    if (updatedPage == "no page found") {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `Invalid Page ID. Page ID does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ updatedPage })
})

module.exports = {
    addPage,
    getAllPages,
    getPageByID,
    updatePageById,
    deletePageById,
    togglePageStatus
}