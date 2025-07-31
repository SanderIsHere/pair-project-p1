class MainController{
    static home(req,res){
        res.render('home')
    }

    static async landingPage(req, res){
        try {
           res.send("welcome to landing page") 
        } catch (err) {
            console.log(err);
            res.send(err)
            
        }
    }
}

module.exports = MainController