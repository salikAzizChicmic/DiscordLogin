require('dotenv').config();
const express=require('express');
const axios=require('axios')
const url=require('url');

const port=process.env.PORT || 1500
const app=express();

app.get('/api/auth/discord/redirect',async(req,res)=>{
    const {code}=req.query;
    if(code){
        const formData=new url.URLSearchParams({
            client_id:process.env.ClientId,
            client_secret:process.env.ClientSecret,
            grant_type:'authorization_code',
            code:code.toString(),
            redirect_uri:"http://localhost:1500/api/auth/discord/redirect",
        });

        const output = await axios.post('https://discord.com/api/oauth2/token',
            formData,{
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            }
        );

        if(output.data){
            const access=output.data.access_token;

            const userInfo=await axios.get('https://discord.com/api/users/@me',{
                headers:{
                    'Authorization':`Bearer ${access}`,
                }
            });

            //console.log(output.data,userInfo.data);
            //refresh token
            const formData1=new url.URLSearchParams({
                client_id:process.env.ClientId,
                client_secret:process.env.ClientSecret,
                grant_type:'refresh_token',
                refresh_token: output.data.refresh_token,
            });
    
            const refresh = await axios.post('https://discord.com/api/oauth2/token',
                formData1,{
                    headers:{
                        'Content-Type':'application/x-www-form-urlencoded'
                    }
                }
            );
            console.log(output.data,userInfo.data,refresh.data);
            //refresh token
            
            res.send(userInfo.data.email)
           
        }
        
    }
})

app.listen(port,()=>{console.log(`Running on ${port}`)})
