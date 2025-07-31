class BuyerController{
    static async showRegisterB(req,res){
        try {
            res.send("xBuyer")
        } catch (err) {
            console.log(err);
            res.send(err)
            
        }
    }
    static async saveRegisterB(req,res){
        try {
            res.send("xBuyer")
        } catch (err) {
            console.log(err);
            res.send(err)
            
        }
    }
}

module.exports = BuyerController