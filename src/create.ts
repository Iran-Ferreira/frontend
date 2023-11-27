import http from "./helpers/http"

function create() {
    return {
        create: async function(){
            try{
                console.log("Deu certo")
                //const { data } = await http.post("/users")
                //console.log(data)
            }catch(error){
                console.log(error)
            }
        }
    }
}

export default create