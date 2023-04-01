import express from 'express';

const exampleRouter = express.Router();

exampleRouter.get('/', (req, res) => {
    res.status(200).json('Hello World!');
});

exampleRouter.get<{ id: string }>('/:id', (req, res) => {
    if (req.params.id !== '1') {
        res.status(404).json('not found');
    } else {
        res.status(200).json('found');
    }
});

export default exampleRouter;
