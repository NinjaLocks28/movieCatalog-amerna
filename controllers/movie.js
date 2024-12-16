const Movie = require('../models/Movie');
const { errorHandler } = require('../auth')

module.exports.addMovie = async (req, res) => {

    try {
        const userId = req.user.id
        const { title, director, year, description, genre} = req.body

        let newMovie = new Movie ({
            userId,
            title,
            director,
            year,
            description,
            genre   
        })

        const result = await newMovie.save();

        return res.status(201).send(result)

    }
    catch (err) {
        errorHandler (err, req, res)
    }
}


module.exports.getAllMovies = async (req, res) => {
    try {

        const result = await Movie.find({})

        if (result.length > 0) {
            return res.status(200).send({
                movies: result
            })
        } else {
            return res.status(404).send({
                message: 'No movies found'
            })
        }


    }
    catch (err) {
        errorHandler(err, req, res)
    }
}


module.exports.getMovieById = async (req, res) => {

    try {

        const  movieId  = req.params.id

        const result = await Movie.findById(movieId);

        if (result) {
            return res.status(200).send(result)
        } else {

            res.status(404).send({
                message: 'No movie found'
            })
        }


    }
    catch (err) {
        errorHandler(err, req, res)
    }
}


module.exports.updateMovie = async (req, res) => {
    try {

        const { title, director, year, description, genre } = req.body;
        const movieId = req.params.id

        let updatedMovie = {
            title,
            director,
            year,
            description,
            genre
        }

        const movie = await Movie.findByIdAndUpdate(movieId, updatedMovie, {new: true})

        if(movie) {
            return res.status(200).send({
                message: 'Movie updated successfully',
                updatedMovie: movie
            })
        } else {
            return res.status(404).send({
                message: 'Movie not found'
            })
        }
    }
    catch (err) {
        errorHandler (err, req, res)
    }
}


module.exports.deleteMovie = async (req, res) => {
    try {

        const movieId = req.params.id

        const result = await Movie.findByIdAndDelete(movieId)
        if(result) {
            return res.status(200).send({
                message: 'Movie updated successfully'
            })
        } else {
            return res.status(404).send({
                message: 'Movie not found'
            })
        }
    }
    catch (err) {
        errorHandler(err, req, res)
    }
}


module.exports.addComment = async (req, res) => {
    try {

        const userId = req.user.id;
        const movieId = req.params.id
        const { comment } = req.body;

        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            {
                $push: {
                    comments: {
                        userId,
                        comment,
                        createdAt: new Date(),
                    }
                },
            },
            { new: true}
        )

        if(!updatedMovie) {
            return res.status(404).send({
                message: 'Movie not found'
            })
        }

        return res.status(200).send({
            message: 'Comment added successfully',
            updatedMovie
        })
    }
    catch (err) {
        errorHandler (err, req, res)
    }
}


module.exports.getComment = async (req, res) => {
    try {

        const movieId = req.params.id

        const movie = await Movie.findById(movieId)

        if(!movie) {
            return res.status(404).send({
                message: 'Movie not found'
            })
        } else {
            return res.status(200).send({
                comments : movie.comments
            })
        }

    }
    catch (err) {
        errorHandler (err, req, res)
    }
}