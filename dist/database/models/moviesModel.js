"use strict";
const mongoose = require('mongoose');
const MovieSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    reating: { type: String, required: true },
    quality: { type: String, required: true },
    category: [{ type: Array, required: true }],
    translate: { type: String, required: true },
    country: { type: String, required: true },
    year: { type: String, required: true },
    duration: { type: String, required: true },
    trailer: { type: String, required: true },
    actors: {
        name: { type: String, required: true },
        image: { type: String, required: true },
    },
    downloads: [{ type: String, required: true }],
});
const MovieModel = (module.exports = mongoose.model('movie', MovieSchema));
