const nodemailer=require("nodemailer")
let transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"roman.zinkevich1903@gmail.com",
        pass:'fvrioydsntdakyrh'
    }
})
let mailOptions={
    from:"roman.zinkevich1903@gmail.com",
    to:"roman.zinkevich1903@gmail.com",
    subject:'test',
    text:"I hope it works"
}
transporter.sendMail(mailOptions, (err,res)=>{
    if (err)
        console.log(err)
    else 
        console.log("done boiii: ",info.response)
})