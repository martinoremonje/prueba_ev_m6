import express from "express";
import fs from "fs";
import path from "path";

const routes = express.Router();
const __dirname = path.resolve();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
routes.get("/", (req, res) => {
    const { posts } = JSON.parse(fs.readFileSync('data/deportes.json', 'utf-8'));
    
    fs.readFile(__dirname + '/views/index.html', 'utf8', (err, html) => {
        if (err) {
            console.error('Error leyendo el archivo HTML:', err);
            return res.status(500).send("Error en el servidor al leer el archivo HTML");
        } 
        let listItems = posts.map(post => `<li>${capitalizeFirstLetter(post.nombre)}-$${post.precio}</li>`).join(''); 
        html = html.replace('<ol id="show-li"></ol>', `<ul id="show-li">${listItems}</ul>`);
        res.send(html);
    });
});

routes.post("/agregar", (req,res)=>{
    const {nombre, precio} = req.body;
    if(nombre != "" && precio != ""){

        const data = JSON.parse(fs.readFileSync(`data/deportes.json`, 'utf-8'));
        
        const usuarios = data.posts
        const existe = usuarios.some(deporte => deporte.nombre === nombre);
        
            if(existe){
                res.status(400).sendFile(__dirname + "/views/notfound.html")
            } else{
                const newUser = {
                    nombre,
                    precio
                };
                usuarios.push(newUser);
                fs.writeFileSync("data/deportes.json", JSON.stringify(data));
                res.sendFile(__dirname + "/views/agregado.html")
            }
    } else{
        res.sendFile(__dirname + "/views/notfound.html")
    }
    }) ;


routes.get("/deportes", (req, res)=>{
    const data = JSON.parse(fs.readFileSync(`data/deportes.json`, 'utf-8'));
    const deportes = data.posts.map(e=>{
        return e.nombre
    });
    res.json({deportes})
});
routes.get("/editar", (req, res) => {
    const { nombreC, newPrice } = req.query;
    if(nombreC != "" && newPrice != ""){

        let data = JSON.parse(fs.readFileSync("data/deportes.json", "utf-8"));
        let found = false;
    
        for (let i = 0; i < data.posts.length; i++) {
            if (data.posts[i].nombre === nombreC) {
                data.posts[i].precio = newPrice;
                found = true;
                break; 
            }
        }
    
        if (found) {
            fs.writeFileSync("data/deportes.json", JSON.stringify(data, null, 2), "utf-8");
            res.sendFile(__dirname + "/views/agregado.html");
        } else {
            res.status(404).sendFile(__dirname + "/views/notfound.html")
        }
    }else{
        res.sendFile(__dirname + "/views/notfound.html")
    }
});
routes.get("/eliminar", (req, res) => {
    const { nombreE} = req.query; 
    if(nombreE != ""){

        let data = JSON.parse(fs.readFileSync("data/deportes.json", "utf-8"));
        let found = false;
    
        for (let i = 0; i < data.posts.length; i++) {
            if (data.posts[i].nombre === nombreE) {
                data.posts.splice(i, 1); 
                found = true;
                break; 
            }
        }
    
        if (found) {
            fs.writeFileSync("data/deportes.json", JSON.stringify(data, null, 2), "utf-8"); 
            res.sendFile(__dirname + "/views/agregado.html");
        } else {
            res.status(404).sendFile(__dirname + "/views/notfound.html")
        }
    }else{
        res.sendFile(__dirname + "/views/notfound.html")
    }
});

    


export default routes

