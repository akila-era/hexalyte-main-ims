const db = require('../models')
const Page = db.Page

const addPage = async (pageData) => {
    try {
        const newPage = await Page.create(pageData)
        return newPage
    } catch (error) {
        throw error
    }
}

const getPageByID = async (pageId) => {
    try {
        const page = await Page.findByPk(pageId, {
            include: [{
                model: db.NewOrder,
                required: false
            }]
        })
        return page
    } catch (error) {
        throw error
    }
}

const updatePageById = async (pageId, updateData) => {
    try {
        const page = await Page.findByPk(pageId)
        if (!page) {
            return "no page found"
        }
        
        await page.update(updateData)
        return page
    } catch (error) {
        throw error
    }
}

const deletePageById = async (pageId) => {
    try {
        const deletedPage = await Page.destroy({
            where: { PageID: pageId }
        })
        return deletedPage
    } catch (error) {
        throw error
    }
}

const togglePageStatus = async (pageId) => {
    try {
        const page = await Page.findByPk(pageId)
        if (!page) {
            return "no page found"
        }
        
        await page.update({ isActive: !page.isActive })
        return page
    } catch (error) {
        throw error
    }
}

module.exports = {
    addPage,
    getPageByID,
    updatePageById,
    deletePageById,
    togglePageStatus
}