module.exports = (app) => {
    app.get('/',  (req, res) => {
        res.send('API up');
        console.log('conntetion made');
    });
};
